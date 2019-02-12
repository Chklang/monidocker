import * as CommunicationApi from '../../api';

export class WebsocketMockService {

    public init(): Promise<WebSocket> {
        const result = {
            send: (message: string) => {
                const content = JSON.parse(message) as CommunicationApi.IMessage<any>;
                switch (content.type) {
                    case CommunicationApi.ETypeMessage.REQUEST: {
                        const request = content as CommunicationApi.IMessageRequest<any>;
                        switch (request.content.channel) {
                            case CommunicationApi.GET_NODES.TYPE: {
                                sendMessage(request, <CommunicationApi.GET_NODES.IResponse>{
                                    nodes: [
                                        "http://toto1",
                                        "http://toto2",
                                        "http://toto3",
                                        "http://toto4",
                                        "http://toto5"
                                    ]
                                });
                                break;
                            }
                            case CommunicationApi.GET_CONTAINERS.TYPE: {
                                const messageTyped = request.content.message as CommunicationApi.GET_CONTAINERS.IRequest;
                                if (messageTyped.node === "http://toto1") {
                                    //Simulate no reply
                                    sendMessage(request, <CommunicationApi.GET_CONTAINERS.IResponse>null, 'KO');
                                }
                                sendMessage(request, <CommunicationApi.GET_CONTAINERS.IResponse>{
                                    containers: [this.generateContainer()]
                                });
                                break;
                            }
                            case CommunicationApi.GET_NODE_INFOS.TYPE: {
                                const messageTyped = request.content.message as CommunicationApi.GET_NODE_INFOS.IRequest;
                                sendMessage(request, <CommunicationApi.GET_NODE_INFOS.IResponse>{
                                    name: 'node_' + messageTyped.node.split(/([0-9]+)$/)[1],
                                    cpu: Number(messageTyped.node.split(/([0-9]+)$/)[1]),
                                    ram: Number(messageTyped.node.split(/([0-9]+)$/)[1]) * 1_000,
                                    architecture: "x" + messageTyped.node.split(/([0-9]+)$/)[1],
                                    os: "Linux " + messageTyped.node.split(/([0-9]+)$/)[1],
                                    dockerVersion: "18.00.0" + messageTyped.node.split(/([0-9]+)$/)[1]
                                });
                                break;
                            }
                        }
                        break;
                    }
                }
            },
            onmessage: (ev: MessageEvent) => { }
        }
        const sendMessage = (from: CommunicationApi.IMessage<any>, message: any, status?: 'KO' | 'OK') => {
            status = status || 'OK';
            const response: CommunicationApi.IMessageResponse<any> = {
                id: from.id,
                type: CommunicationApi.ETypeMessage.RESPONSE,
                content: {
                    status: status,
                    message: message
                }
            };
            //Simulate network and calculations
            window.setTimeout(() => {
                result.onmessage(<any>{
                    data: JSON.stringify(response, null, 4)
                });
            }, 300 + Math.random() * 2000);
        };
        return Promise.resolve(<any>result);
    }

    private generateContainer(): CommunicationApi.GET_CONTAINERS.IContainer {
        return {
            id: Math.random().toString(10),
            names: ['titi' + Math.random().toString(16).substr(2)],
            labels: {},
            Image: 'tata',
            ImageID: 'tutu',
            volumes: [],
            state: (Math.random() < 0.5) ? CommunicationApi.GET_CONTAINERS.EContainerState.RUNNING : CommunicationApi.GET_CONTAINERS.EContainerState.STOPPED
        }
    }
}