import { IContainer } from "./model/docker-api/i-container";
import { INode } from "./model/i-configuration";
import { IContainerStatistic } from "./model/docker-api/i-container-statistic";
import * as fetch from 'node-fetch';
import { ISystemInfos } from "./model/docker-api/i-system-infos";
import { cpus } from "os";

export class DockerApi {
    public getSysteminfos(node: INode): Promise<ISystemInfos> {
        return this.get(node, '/info');
    }
    public getContainers(node: INode): Promise<IContainer[]> {
        return this.get(node, '/containers/json?all=true');
    }
    public getContainerStatistics(node: INode, containerId: string): Promise<IContainerStatistic> {
        return this.get(node, '/containers/' + containerId + '/stats?stream=false');
    }
    public startContainer(node: INode, containerId: string): Promise<void> {
        return this.post(node, '/containers/' + containerId + '/start');
    }
    public stopContainer(node: INode, containerId: string): Promise<void> {
        return this.post(node, '/containers/' + containerId + '/stop');
    }
    private get<T>(node: INode, url: string): Promise<T> {
        return fetch.default(node.url + url).then((response) => {
            if (response.status === 204) {
                return null;
            }
            return response.json();
        });
    }
    private post<T>(node: INode, url: string): Promise<T> {
        return fetch.default(node.url + url, {
            method: 'POST'
        }).then((response) => {
            if (response.status === 204) {
                return null;
            }
            return response.json();
        });
    }
}
