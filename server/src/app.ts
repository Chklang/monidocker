import { Configuration } from "./configuration";
import { DockerApi } from "./docker-api";
import { INode } from "./model/i-configuration";
import { IContainerStatistic } from "./model/docker-api/i-container-statistic";

export class Application {
    public start(): void {
        const configuration = Configuration.INSTANCE;
        const dockerApi = new DockerApi();
        configuration.get().then((config) => {
            const promises: Promise<IWaitContainers>[] = [];
            config.nodes.forEach((node) => {
                promises.push(dockerApi.getContainers(node).then((res) => {
                    return <IWaitContainers>{
                        node: node,
                        containersIds: res.map(c => c.Id)
                    };
                }));
            })
            return Promise.all(promises);
        }).then((promisesResolved) => {
            const promises: Promise<IWaitStatistics>[] = [];
            promisesResolved.forEach(waitContainers => {
                const promisesCurrentContainer: Promise<IWaitStatisticsContainer>[] = [];
                waitContainers.containersIds.forEach(waitContainer => {
                    promisesCurrentContainer.push(dockerApi.getContainerStatistics(waitContainers.node, waitContainer).then(res => {
                        return <IWaitStatisticsContainer>{
                            id: waitContainer,
                            statistics: res
                        };
                    }));;
                });
                promises.push(Promise.all(promisesCurrentContainer).then(res => {
                    return <IWaitStatistics>{
                        node: waitContainers.node,
                        containers: res
                    };
                }));
            });
            return Promise.all(promises);
        }).then((promisesResolved) => {
            console.log(JSON.stringify(promisesResolved, null, 4));
        });
    }
}

interface IWaitContainers {
    node: INode;
    containersIds: string[];
}

interface IWaitStatistics {
    node: INode;
    containers: IWaitStatisticsContainer[];
}

interface IWaitStatisticsContainer {
    id: string;
    statistics: IContainerStatistic;
}