import * as Websocket from 'websocket';
import * as CommunicationApi from '../../../api';
import { IWebMessage } from "../i-communicator";
import { WebMessage } from '../communicator-annotation';
import { DockerApi } from '../../../docker-api';

@WebMessage({
    messageType: CommunicationApi.STOP_CONTAINER.TYPE
})
export class GetNodesMessage implements IWebMessage {
    private readonly dockerApi = new DockerApi();
    
    public receive(connection: Websocket.connection, message: CommunicationApi.IMessageRequest<CommunicationApi.STOP_CONTAINER.IRequest>): void {
        this.dockerApi.stopContainer({
            url: message.content.message.node,
        }, message.content.message.containerId).then(() => {
            connection.sendUTF(JSON.stringify(<CommunicationApi.IMessageResponse<CommunicationApi.STOP_CONTAINER.IResponse>>{
                id: message.id,
                type: CommunicationApi.ETypeMessage.RESPONSE,
                content: {
                    status: 'OK',
                    message: {}
                }
            }));
        });
    }
}
