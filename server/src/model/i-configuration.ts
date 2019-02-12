export interface IConfiguration {
    nodes: INode[];
    port: number;
    web_port?: number;
    web_protocol?: string;
}

export interface INode {
    url: string;
}
