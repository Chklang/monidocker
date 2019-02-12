export interface ISystemInfos {
    ID: string;
    Containers: number;
    ContainersRunning: number;
    ContainersPaused: number;
    ContainersStopped: number;
    Images: number;
    Driver: string;
    DriverStatus: [string, string][];
    SystemStatus: null;
    Plugins: {
        Volume: string[];
        Network: string[];
        Authorization: null;
        Log: string[];
    };
    MemoryLimit: boolean;
    SwapLimit: boolean;
    KernelMemory: boolean;
    CpuCfsPeriod: boolean;
    CpuCfsQuota: boolean;
    CPUShares: boolean;
    CPUSet: boolean;
    IPv4Forwarding: boolean;
    BridgeNfIptables: boolean;
    BridgeNfIp6tables: boolean;
    Debug: boolean;
    NFd: number;
    OomKillDisable: boolean;
    NGoroutines: number;
    SystemTime: string;
    LoggingDriver: string;
    CgroupDriver: string;
    NEventsListener: number;
    KernelVersion: string;
    OperatingSystem: string;
    OSType: string;
    Architecture: string;
    IndexServerAddress: string;
    RegistryConfig: {
        AllowNondistributableArtifactsCIDRs: [];
        AllowNondistributableArtifactsHostnames: [];
        InsecureRegistryCIDRs: string[];
        IndexConfigs: {
            [key: string]: {
                Name: string;
                Mirrors: [];
                Secure: boolean;
                Official: boolean;
            }
        };
        Mirrors: [];
    };
    NCPU: number;
    MemTotal: number;
    GenericResources: null;
    DockerRootDir: string;
    HttpProxy: string;
    HttpsProxy: string;
    NoProxy: string;
    Name: string;
    Labels: [];
    ExperimentalBuild: boolean;
    ServerVersion: string;
    ClusterStore: string;
    ClusterAdvertise: string;
    Runtimes: {
        runc: {
            path: string;
        };
    };
    DefaultRuntime: string;
    Swarm: {
        NodeID: string;
        NodeAddr: string;
        LocalNodeState: string;
        ControlAvailable: boolean;
        Error: string;
        RemoteManagers: null;
    };
    LiveRestoreEnabled: boolean;
    Isolation: string;
    InitBinary: string;
    ContainerdCommit: {
        ID: string;
        Expected: string;
    };
    RuncCommit: {
        ID: string;
        Expected: string;
    };
    InitCommit: {
        ID: string;
        Expected: string;
    };
    SecurityOptions: string[];
    ProductLicense: string;
    Warnings: string[];
}