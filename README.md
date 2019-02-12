# Monidocker

An application to monitore docker nodes. You give only urls of docker API, this application will use them to show you all containers.

# How to execute it

## With docker

You can use the docker image chklang/monidocker.
An example of docker-compose :

```docker-compose
version: '2'

services:
  monidocker:
    image: chklang/monidocker
    environment:
      - monidocker_port=80
      - monidocker_hosts="http://192.168.0.1:2345|http://192.168.0.2:2345|http://192.168.0.3:2345"
    ports:
      - 22080:80
```

## With npm

### Installation

```shell
npm install -g @monidocker/app
```

### Execution

```shell
monidocker
```

# What are options ?

* If you use ENV vars :
  * monidocker_port: <integer> - Port exposed by server (default is 80)
  * monidocker_hosts: <string> - Urls of docker API, separated by pipe "|"
  * monidocker_webPort: <integer> - Change port of websocket (default is same port than website)
  * monidocker_webProtocol: <string> - Change protocol of websocket (default is "ws" if website is "http", "wss" if website is "https")
* If you use parameters variables
  * port: <integer> - Port exposed by server (default is 80)
  * hosts: <string> - Urls of docker API, separated by pipe "|"
  * webPort: <integer> - Change port of websocket (default is same port than website)
  * webProtocol: <string> - Change protocol of websocket (default is "ws" if website is "http", "wss" if website is 
  * ex : (into main dist folder, after an "npm install") npm start -- --port=80 --hosts="http://192.168.0.1:2345|http://192.168.0.2:2345|http://192.168.0.3:2345"
  * /!\ In this example, "-- --port", the "--" before all options are important! see https://stackoverflow.com/questions/11580961/sending-command-line-arguments-to-npm-script
* If you use configuration file
  * Put this configuration file into your user home directory with name ".monidocker.conf.json"
  * Structure is :
```typescript
    {
      port?: number, // - Port exposed by server (default is 80)
      hosts: string, // - Urls of docker API, separated by pipe "|"
      webPort?: number, // - Change port of websocket (default is same port than website)
      webProtocol?: string, // - Change protocol of websocket (default is "ws" if website is "http", "wss" if website is 
    }
```

Priorities are :
1. parameters variables
2. ENV vars
3. configuration file

"hosts" is the only mandatory key. If it's not given you will have an exception like:

```shell
UnhandledPromiseRejectionWarning: Error: No hosts found. Please use "hosts" as argument, "monidocker_hosts" as env var, or use file C:\\[path]\\.monidocker.conf.json
```

# How to build it

Type in shell :

```shell
npm i
npm run dist
```
