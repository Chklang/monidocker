import * as GET_NODES from './get-nodes';
import * as GET_CONTAINERS from './get-containers';
import * as GET_NODE_INFOS from './get-node-infos';
import * as START_CONTAINER from './start-container';
import * as STOP_CONTAINER from './stop-container';

export { GET_NODES };
export { GET_CONTAINERS };
export { GET_NODE_INFOS };
export { START_CONTAINER };
export { STOP_CONTAINER };

export interface IMessage<T> {
    id: string;
    type: ETypeMessage;
    content: T;
}

export interface IMessageRequest<T> extends IMessage<IMessageRequestContent<T>> {
    type: ETypeMessage.REQUEST;
}

export interface IMessageRequestContent<T> {
    channel: string;
    message: T
}

export interface IMessageResponse<T> extends IMessage<IMessageResponseContent<T>> {
    type: ETypeMessage.RESPONSE;
}

export interface IMessageResponseContent<T> {
    status: 'OK' | 'KO';
    message: T
}

export enum ETypeMessage {
    REQUEST = 'REQUEST',
    RESPONSE = 'RESPONSE'
}