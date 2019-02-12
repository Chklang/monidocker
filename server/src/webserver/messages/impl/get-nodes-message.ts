import * as Websocket from 'websocket';
import * as CommunicationApi from '../../../api';
import { IWebMessage } from "../i-communicator";
import { WebMessage } from '../communicator-annotation';
import { Configuration } from '../../../configuration';

@WebMessage({
    messageType: CommunicationApi.GET_NODES.TYPE
})
export class GetNodesMessage implements IWebMessage {
    public receive(connection: Websocket.connection, message: CommunicationApi.IMessageRequest<CommunicationApi.GET_NODES.IRequest>): void {
        Configuration.INSTANCE.get().then((config) => {
            connection.sendUTF(JSON.stringify(<CommunicationApi.IMessageResponse<CommunicationApi.GET_NODES.IResponse>>{
                id: message.id,
                type: CommunicationApi.ETypeMessage.RESPONSE,
                content: {
                    status: 'OK',
                    message: {
                        nodes: config.nodes.map(e => e.url)
                    }
                }
            }));
        });
    }
}
