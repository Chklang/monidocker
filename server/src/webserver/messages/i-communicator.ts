import * as Websocket from 'websocket';
import * as CommunicationApi from '../../api';

export interface IWebMessage {
    receive: (connection: Websocket.connection, message: CommunicationApi.IMessageRequest<any>) => void;
}