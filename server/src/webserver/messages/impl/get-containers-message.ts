import * as Websocket from 'websocket';
import * as CommunicationApi from '../../../api';
import { IWebMessage } from "../i-communicator";
import { WebMessage } from '../communicator-annotation';
import { Configuration } from '../../../configuration';
import { DockerApi } from '../../../docker-api';

@WebMessage({
    messageType: CommunicationApi.GET_CONTAINERS.TYPE
})
export class GetNodesMessage implements IWebMessage {
    private readonly dockerApi = new DockerApi();

    public receive(connection: Websocket.connection, message: CommunicationApi.IMessageRequest<CommunicationApi.GET_CONTAINERS.IRequest>): void {
        this.dockerApi.getContainers({
            url: message.content.message.node
        }).then((response) => {
            const containersResult: CommunicationApi.GET_CONTAINERS.IContainer[] = [];
            const result: CommunicationApi.IMessageResponse<CommunicationApi.GET_CONTAINERS.IResponse> = {
                id: message.id,
                type: CommunicationApi.ETypeMessage.RESPONSE,
                content: {
                    status: 'OK',
                    message: {
                        containers: containersResult
                    }
                }
            };
            response.forEach((container) => {
                const containerResult: CommunicationApi.GET_CONTAINERS.IContainer = {
                    id: container.Id,
                    names: container.Names,
                    ImageID: container.ImageID,
                    Image: container.Image,
                    labels: container.Labels,
                    volumes: [],
                    state: container.State === "running" ? CommunicationApi.GET_CONTAINERS.EContainerState.RUNNING : CommunicationApi.GET_CONTAINERS.EContainerState.STOPPED
                };
                container.Mounts.forEach((volume) => {
                    containerResult.volumes.push({
                        name: volume.Name,
                        driver: volume.Driver,
                        source: volume.Source,
                        destination: volume.Destination
                    });
                });
                containersResult.push(containerResult);
            });
            connection.sendUTF(JSON.stringify(result));
        }, () => {
            const result: CommunicationApi.IMessageResponse<CommunicationApi.GET_CONTAINERS.IResponse> = {
                id: message.id,
                type: CommunicationApi.ETypeMessage.RESPONSE,
                content: {
                    status: 'KO',
                    message: null
                }
            };
            connection.sendUTF(JSON.stringify(result));
        });
    }
}
