import { Injectable } from '@angular/core';
import * as rxjs from 'rxjs';
import * as CommunicationApi from '../../api';
import { environment } from 'src/environments/environment';
import { WebsocketMockService } from './websocket.mock.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private static AUTOINCREMENT: number = 1;
  private get promiseSocket(): Promise<WebSocket> {
    if (this._promiseSocket === null) {
      this._promiseSocket = this.init();
    }
    return this._promiseSocket;
  }
  private _promiseSocket: Promise<WebSocket> = null;
  private onMessageSubject: { [key: string]: rxjs.Subject<any> } = {};
  private waitingResponses: { [key: string]: { ok: (reply: any) => void, ko: (reply: any) => void } } = {};

  constructor() {
  }

  private init(): Promise<WebSocket> {
    if (!environment.production) {
      const mock = new WebsocketMockService();
      return mock.init().then((websocket) => {
        websocket.onmessage = (ev: MessageEvent) => {
          this.onMessage(JSON.parse(ev.data));
        };
        return websocket;
      })
    }
    return new Promise((resolve, reject) => {
      let url = environment.protocol;
      let port = environment.port;
      if (url.startsWith("##") && url.endsWith("##") && url.indexOf("AUTOMATIC_PROTOCOL") !== -1 && url.length === 22)  {
        switch (location.protocol) {
          case 'http:':
            url = 'ws';
            break;
          case 'https:':
            url = 'wss';
            break;
        }
      }
      if (port.startsWith("##") && port.endsWith("##") && port.indexOf("AUTOMATIC_PORT") !== -1 && port.length === 18)  {
        port = location.port;
      }
      url += '://' + location.hostname + ':' + port + '/ws';
      const websocket = new WebSocket(url);
      websocket.onopen = (ev: Event) => {
        console.log('Open socket OK');
        resolve(websocket);
      };
      websocket.onclose = (ev: CloseEvent) => {
        console.log('Close socket OK');
      };
      websocket.onerror = (ev: Event) => {
        console.log('Error socket', ev);
      };
      websocket.onmessage = (ev: MessageEvent) => {
        this.onMessage(JSON.parse(ev.data));
      };
    });
  }

  private onMessage(ev: CommunicationApi.IMessage<any>): void {
    if (ev.type === CommunicationApi.ETypeMessage.RESPONSE) {
      if (this.waitingResponses[ev.id]) {
        const evResponse = ev as CommunicationApi.IMessageResponse<any>;
        switch (evResponse.content.status) {
          case 'OK':
            this.waitingResponses[ev.id].ok(evResponse.content.message);
            break;
          case 'KO':
            this.waitingResponses[ev.id].ko(evResponse.content.message);
            break;
        }
      }
      return;
    }
    // It's message from server
    if (this.onMessageSubject[ev.content.channel]) {
      this.onMessageSubject[ev.content.channel].next(ev.content.message);
    }
  }

  public send<TRequest, TResponse>(type: string, content?: TRequest): Promise<TResponse> {
    const id: string = 'R_' + WebsocketService.AUTOINCREMENT++;
    return this.promiseSocket.then((socket) => {
      return new Promise<TResponse>((resolve, reject) => {
        this.waitingResponses[id] = { ok: resolve, ko: reject };
        const message: CommunicationApi.IMessageRequest<any> = {
          id: id,
          type: CommunicationApi.ETypeMessage.REQUEST,
          content: {
            channel: type,
            message: content
          }
        };
        socket.send(JSON.stringify(message));
      });
    });
  }

  public getSubject<T>(type: string): rxjs.Observable<T> {
    if (!this.onMessageSubject[type]) {
      this.onMessageSubject[type] = new rxjs.Subject();
    }
    return this.onMessageSubject[type];
  }
}
