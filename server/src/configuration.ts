import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import * as minimist from 'minimist';
import { IConfiguration } from "./model/i-configuration";

export class Configuration {
    public static get INSTANCE(): Configuration {
        if (!Configuration._INSTANCE) {
            Configuration._INSTANCE = new Configuration();
        }
        return Configuration._INSTANCE;
    }
    private static _INSTANCE: Configuration = null;

    private promiseConfiguration: Promise<IConfiguration> = null;

    private constructor() { }

    public get(): Promise<IConfiguration> {
        if (this.promiseConfiguration) {
            return this.promiseConfiguration;
        }
        this.promiseConfiguration = Promise.resolve().then(() => {
            const args = minimist.default(process.argv);
            return Promise.all([
                this.getPort(args),
                this.getHosts(args),
                this.getWebPort(args),
                this.getWebProtocol(args)
            ]).then(([port, hosts, webPort, webProtocol]) => {
                const parsedHosts = hosts.split('|').map((e: string) => {
                    return { url: e };
                });
                return <IConfiguration>{
                    nodes: parsedHosts,
                    port: port,
                    web_port: webPort,
                    web_protocol: webProtocol
                };
            })
        }).then((conf: IConfiguration) => {
            if (!conf.port) {
                conf.port = 9876;
            }
            return conf;
        })
        return this.promiseConfiguration;
    }

    private getPort(minimistArgs: minimist.ParsedArgs): Promise<number> {
        if (minimistArgs.port) {
            return Promise.resolve(minimistArgs.port);
        }
        if (process.env['monidocker_port']) {
            return Promise.resolve(Number(process.env['monidocker_port']));
        }
        return this.getConfFile().then((content) => {
            if (!content) {
                return 80;
            }
            return content.hosts;
        });
    }

    private getHosts(minimistArgs: minimist.ParsedArgs): Promise<string> {
        if (minimistArgs.hosts) {
            return Promise.resolve(minimistArgs.hosts);
        }
        if (process.env['monidocker_hosts']) {
            return Promise.resolve(process.env['monidocker_hosts']);
        }
        return this.getConfFile().then((content) => {
            if (!content) {
                const homedir = os.homedir();
                const pathConf = path.normalize(homedir + path.sep + '.monidocker.conf.json');
                throw new Error('No hosts found. Please use "hosts" as argument, "monidocker_hosts" as env var, or use file ' + pathConf);
            }
            return content.hosts;
        });
    }

    private getWebPort(minimistArgs: minimist.ParsedArgs): Promise<number> {
        if (minimistArgs.webPort) {
            return Promise.resolve(minimistArgs.webPort);
        }
        if (process.env['monidocker_webPort']) {
            return Promise.resolve(Number(process.env['monidocker_webPort']));
        }
        return this.getConfFile().then((content) => {
            if (!content) {
                return null;
            }
            return content.hosts;
        });
    }

    private getWebProtocol(minimistArgs: minimist.ParsedArgs): Promise<string> {
        if (minimistArgs.webProtocol) {
            return Promise.resolve(minimistArgs.webProtocol);
        }
        if (process.env['monidocker_webProtocol']) {
            return Promise.resolve(process.env['monidocker_webProtocol']);
        }
        return this.getConfFile().then((content) => {
            if (!content) {
                return null;
            }
            return content.hosts;
        });
    }

    private _promiseConfFile: Promise<any> = null;
    private getConfFile(): Promise<any> {
        if (this._promiseConfFile) {
            return this._promiseConfFile;
        }
        const homedir = os.homedir();
        const pathConf = path.normalize(homedir + path.sep + '.monidocker.conf.json');
        this._promiseConfFile = fs.pathExists(pathConf).then((exists) => {
            if (exists) {
                return fs.readFile(pathConf).then(e => JSON.parse(e.toString()));
            }
            return null;
        });
        return this._promiseConfFile;
    }
}