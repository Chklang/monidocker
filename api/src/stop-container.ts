export const TYPE: string = 'STOP_CONTAINER';

export interface IRequest {
    node: string;
    containerId: string;
}

export interface IResponse {
}