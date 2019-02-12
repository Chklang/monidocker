export interface IContainer {
    id: string;
    names: string[];
    labels: { [key: string]: string };
    Image: string;
    ImageID: string;
    volumes: IVolume[];
    state: EContainerState;
}

export interface IVolume {
    name: string;
    driver: string;
    source: string;
    destination: string;
}

export enum EContainerState {
  STARTED, STARTING, STOPPED, STOPPING
}