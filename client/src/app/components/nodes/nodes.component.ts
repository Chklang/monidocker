import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../services/websocket/websocket.service';
import * as CommunicationApi from '../../api';
import { INode, EState } from '../../model/i-node';
import { IContainer, EContainerState } from '../../model/i-ccontainer';

@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.css']
})
export class NodesComponent implements OnInit {
  public detailsMaxValue: number = 1;
  public detailsCurrentValue: number = 0;
  public stepLoad: EStepLoad = EStepLoad.INITIALIZATION;
  public stepLoadMaxValue: number = 3;
  public stepLoadCurrentValue: number = 0;
  public EStepLoad = EStepLoad;
  public nodes: INode[] = [];
  public EContainerState = EContainerState;
  public EState = EState;

  constructor(
    private WebsocketService: WebsocketService
  ) { }

  public ngOnInit() {
    this.stepLoad = EStepLoad.LOADNODES;
    this.stepLoadCurrentValue++;
    this.WebsocketService.send(CommunicationApi.GET_NODES.TYPE, <CommunicationApi.GET_NODES.IRequest>{}).then((response: CommunicationApi.GET_NODES.IResponse) => {
      const promises: Promise<INode>[] = [];
      this.detailsMaxValue = response.nodes.length;
      this.stepLoad = EStepLoad.LOADCONTAINERS;
      this.stepLoadCurrentValue++;
      response.nodes.forEach((node) => {
        promises.push(Promise.all([
          this.WebsocketService.send(CommunicationApi.GET_CONTAINERS.TYPE, <CommunicationApi.GET_CONTAINERS.IRequest>{
            node: node
          }),
          this.WebsocketService.send(CommunicationApi.GET_NODE_INFOS.TYPE, <CommunicationApi.GET_NODE_INFOS.IRequest>{
            node: node
          })
        ]).then((responses) => {
          const responseContainers = responses[0] as CommunicationApi.GET_CONTAINERS.IResponse;
          const responseInfos = responses[1] as CommunicationApi.GET_NODE_INFOS.IResponse;
          this.detailsCurrentValue++;
          return <INode>{
            state: EState.UP,
            url: node,
            name: responseInfos.name,
            cpu: responseInfos.cpu,
            ram: responseInfos.ram,
            architecture: responseInfos.architecture,
            os: responseInfos.os,
            dockerVersion: responseInfos.dockerVersion,
            containers: responseContainers.containers.map(e => {
              return <IContainer>{
                Image: e.Image,
                ImageID: e.ImageID,
                id: e.id,
                labels: e.labels,
                names: e.names,
                state: e.state === CommunicationApi.GET_CONTAINERS.EContainerState.RUNNING ? EContainerState.STARTED : EContainerState.STOPPED,
                volumes: e.volumes,
              }
            })
          }
        }, () => {
          return <INode>{
            state: EState.DOWN,
            url: node,
            name: "",
            cpu: -1,
            ram: 0,
            architecture: "",
            os: "",
            dockerVersion: "",
            containers: []
          };
        }));
      });
      return Promise.all(promises);
    }).then((nodes: INode[]) => {
      this.nodes = nodes;
      this.stepLoad = EStepLoad.FINISHED;
      this.stepLoadCurrentValue++;
    });
  }

  public containerStateToText(container: IContainer): string {
    switch (container.state) {
      case EContainerState.STARTED:
        return 'Stop';
      case EContainerState.STARTING:
        return 'Starting...';
      case EContainerState.STOPPED:
        return 'Start';
      case EContainerState.STOPPING:
        return 'Stopping...';
    }
  }

  public containerStateToImg(container: IContainer): string {
    switch (container.state) {
      case EContainerState.STARTED:
        return '/assets/status-green.png';
      case EContainerState.STARTING:
        return '/assets/status-green.png';
      case EContainerState.STOPPED:
        return '/assets/status-red.png';
      case EContainerState.STOPPING:
        return '/assets/status-red.png';
    }
  }

  public toggleContainer(node: INode, container: IContainer): void {
    switch (container.state) {
      case EContainerState.STARTED:
        this.stopContainer(node, container);
        break;
      case EContainerState.STOPPED:
        this.startContainer(node, container);
        break;
    }
  }

  public startContainer(node: INode, container: IContainer): void {
    container.state = EContainerState.STARTING;
    this.WebsocketService.send(CommunicationApi.START_CONTAINER.TYPE, <CommunicationApi.START_CONTAINER.IRequest>{
      node: node.url,
      containerId: container.id
    }).then(() => {
      container.state = EContainerState.STARTED;
    }, (e) => {
      container.state = EContainerState.STOPPED;
      console.error(e);
    });
  }

  public stopContainer(node: INode, container: IContainer): void {
    container.state = EContainerState.STOPPING;
    this.WebsocketService.send(CommunicationApi.STOP_CONTAINER.TYPE, <CommunicationApi.STOP_CONTAINER.IRequest>{
      node: node.url,
      containerId: container.id
    }).then(() => {
      container.state = EContainerState.STOPPED;
    }, (e) => {
      container.state = EContainerState.STARTED;
      console.error(e);
    });
  }
}

export enum EStepLoad {
  INITIALIZATION, LOADNODES, LOADCONTAINERS, FINISHED
}