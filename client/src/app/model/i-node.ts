import { IContainer } from './i-ccontainer';

export interface INode {
    state: EState;
    url: string;
    name: string;
    cpu: number;
    ram: number;
    os: string;
    architecture: string;
    dockerVersion: string;
    containers: IContainer[];
}

export enum EState {
    UP, DOWN
}