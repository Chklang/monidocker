import { IWebMessage } from "./i-communicator";
import { Dictionnary } from 'arrayplus';

declare var global: any;

// tslint:disable-next-line:only-arrow-functions
if (!global["MONIKER_WEBMESSAGES_CLASSES"]) {
    // tslint:disable-next-line:no-string-literal
    global["MONIKER_WEBMESSAGES_CLASSES"] = Dictionnary.create();
}
// tslint:disable-next-line:no-string-literal
export const STORE: Dictionnary<string, IClassWebMessage> = global["MONIKER_WEBMESSAGES_CLASSES"];

export function WebMessage(params: IParameters) {
    // tslint:disable-next-line:only-arrow-functions
    return function (constructor: { new(...args: any[]): IWebMessage }): any {
        const result: any = class extends constructor {
            // tslint:disable-next-line:member-access
            _messageType = params.messageType;
        };
        result.messageType = params.messageType;
        STORE.addElement(params.messageType, result);
        return result;
    };
}
export interface IParameters {
    messageType: string;
}
export interface IClassWebMessage {
    messageType: string;
    new(): IWebMessage;
}
