export const TYPE: string = 'GET_NODE_INFOS';

export interface IRequest {
    node: string;
}

export interface IResponse {
    name: string;
    cpu: number;
    ram: number;
    os: string;
    architecture: string;
    dockerVersion: string;
}