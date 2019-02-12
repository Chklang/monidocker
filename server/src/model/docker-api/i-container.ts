export interface IContainer {
    Id: string;
    Names: string[];
    Image: string;
    ImageID: string;
    Command: string;
    Created: number;
    Ports: {
        IP: string;
        PrivatePort: number;
        PublicPort: number;
        Type: string;
    }[];
    Labels: { [key: string]: string };
    State: string;
    Status: string;
    HostConfig: { NetworkMode: string };
    NetworkSettings: {
        Networks: {
            [key: string]: {
                IPAMConfig: null;
                Links: null;
                Aliases: null;
                NetworkID: string;
                EndpointID: string;
                Gateway: string;
                IPAddress: string;
                IPPrefixLen: number;
                IPv6Gateway: string;
                GlobalIPv6Address: string;
                GlobalIPv6PrefixLen: number;
                MacAddress: string;
                DriverOpts: null
            }
        }
    };
    Mounts: {
        Type: string;
        Name: string;
        Source: string;
        Destination: string;
        Driver: string;
        Mode: string;
        RW: boolean;
        Propagation: string;
    }[]
}