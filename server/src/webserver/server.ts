import * as http from 'http';
import * as url from 'url';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as Websocket from 'websocket';
import { Dictionnary } from 'arrayplus';
import { loadModules } from 'server-load-modules';
import * as CommunicationApi from '../api';
import { STORE } from './messages/communicator-annotation';
import { IWebMessage } from './messages/i-communicator';
import { Configuration } from '../configuration';

console.log('Load monidocker...');
const messagesClasses: Dictionnary<string, IWebMessage> = Dictionnary.create();
loadModules({
    arbitraryAdd: [
        path.normalize(__dirname + path.sep + 'messages' + path.sep + 'impl')
    ],
    propertyDetection: ['moniker', 'webmessages']
}).then(() => {
    //Try to load configuration
    return Configuration.INSTANCE.get();
}).then((config) => {
    console.log('Start server...');
    STORE.forEach(e => {
        messagesClasses.addElement(e.messageType, new e());
    });
    const contentTypesByExtension: { [key: string]: string } = {
        '.html': "text/html",
        '.css': "text/css",
        '.js': "text/javascript"
    };
    const basePathStatics = __dirname + path.sep + '..' + path.sep + '..' + path.sep + 'lib-client';
    const indexHtml = path.normalize(basePathStatics + path.sep + 'index.html');
    const server = http.createServer((request, response) => {
        const uri = url.parse(request.url as string);

        let filePath = path.normalize(basePathStatics + uri.pathname as string);
        fs.pathExists(filePath).then((isExists) => {
            if (!isExists) {
                filePath = indexHtml;
            }
            return fs.stat(filePath);
        }).then((stats: fs.Stats) => {
            if (stats.isDirectory()) {
                filePath = indexHtml;
            }
            if (/main\.[0-9a-f]+\.js/.test(filePath)) {
                return fs.readFile(filePath, 'binary').then(content => {
                    content = content.toString();
                    if (config.web_port) {
                        content = content.replace('##AUTOMATIC_PORT##', config.web_port.toString());
                    }
                    if (config.web_protocol) {
                        content = content.replace('##AUTOMATIC_PROTOCOL##', config.web_protocol);
                    }
                    return content;
                });
            } else {
                return fs.readFile(filePath, 'binary');
            }
        }).then((content) => {
            const headers: { [key: string]: string } = {};
            const contentType = contentTypesByExtension[path.extname(filePath)];
            if (contentType) headers["Content-Type"] = contentType;
            response.writeHead(200, headers);
            response.write(content, 'binary');
            response.end();
            return;
        }, () => {
            response.writeHead(500, { "Content-Type": "text/plain" });
            response.write('Error...');
            response.end();
            return;
        });
    }).listen(config.port);

    const wsServer = new Websocket.server({
        httpServer: server,
        autoAcceptConnections: false
    });

    function originIsAllowed(origin: string) {
        // put logic here to detect whether the specified origin is allowed.
        return true;
    }

    wsServer.on('request', (request) => {
        if (!originIsAllowed(request.origin)) {
            // Make sure we only accept requests from an allowed origin
            request.reject();
            console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
            return;
        }

        var connection = request.accept();//'echo-protocol', request.origin);
        // console.log((new Date()) + ' Connection accepted.');
        connection.on('message', (message) => {
            if (message.type === 'utf8') {
                // console.log('Received Message: ' + message.utf8Data);
                onReceiveMessage(connection, JSON.parse(message.utf8Data));
                // connection.sendUTF(message.utf8Data);
            }
            else if (message.type === 'binary') {
                // console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
                connection.sendUTF('Binary not supported');
            }
        });
        connection.on('close', (reasonCode, description) => {
            console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        });
    });

    function onReceiveMessage(connection: Websocket.connection, message: CommunicationApi.IMessage<any>): void {
        switch (message.type) {
            case CommunicationApi.ETypeMessage.RESPONSE:
                break;
            case CommunicationApi.ETypeMessage.REQUEST:
                onMessageRequest(connection, message as CommunicationApi.IMessageRequest<any>);
                break;
            default:
                connection.sendUTF(JSON.stringify(<CommunicationApi.IMessageResponse<any>>{
                    id: message.id,
                    type: CommunicationApi.ETypeMessage.RESPONSE,
                    content: {
                        status: 'KO',
                        message: 'Message type ' + message.type + ' isn\'t supported'
                    }
                }));
                break;
        }
    }

    function onMessageRequest(connection: Websocket.connection, message: CommunicationApi.IMessageRequest<any>) {
        const messageImpl = messagesClasses.getElement(message.content.channel);
        if (!messageImpl) {
            connection.sendUTF(JSON.stringify(<CommunicationApi.IMessageResponse<any>>{
                id: message.id,
                type: CommunicationApi.ETypeMessage.RESPONSE,
                content: {
                    status: 'KO',
                    message: 'Request type ' + message.content.channel + ' isn\'t supported'
                }
            }));
            return;
        }
        messageImpl.receive(connection, message);
    }
    console.log('Server started on port ', config.port);
});