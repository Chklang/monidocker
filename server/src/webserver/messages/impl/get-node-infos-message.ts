import * as Websocket from 'websocket';
import * as CommunicationApi from '../../../api';
import { IWebMessage } from "../i-communicator";
import { WebMessage } from '../communicator-annotation';
import { DockerApi } from '../../../docker-api';

@WebMessage({
    messageType: CommunicationApi.GET_NODE_INFOS.TYPE
})
export class GetNodesMessage implements IWebMessage {
    private readonly dockerApi = new DockerApi();
    
    public receive(connection: Websocket.connection, message: CommunicationApi.IMessageRequest<CommunicationApi.GET_NODE_INFOS.IRequest>): void {
        this.dockerApi.getSysteminfos({
            url: message.content.message.node
        }).then((response) => {
            connection.sendUTF(JSON.stringify(<CommunicationApi.IMessageResponse<CommunicationApi.GET_NODE_INFOS.IResponse>>{
                id: message.id,
                type: CommunicationApi.ETypeMessage.RESPONSE,
                content: {
                    status: 'OK',
                    message: {
                        name: response.Name,
                        cpu: response.NCPU,
                        ram: response.MemTotal,
                        architecture: response.Architecture,
                        os: response.OperatingSystem,
                        dockerVersion: response.ServerVersion
                    }
                }
            }));
        }, () => {
            connection.sendUTF(JSON.stringify(<CommunicationApi.IMessageResponse<CommunicationApi.GET_NODE_INFOS.IResponse>>{
                id: message.id,
                type: CommunicationApi.ETypeMessage.RESPONSE,
                content: {
                    status: 'KO',
                    message: null
                }
            }));
        })
    }
}
