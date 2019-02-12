const fs = require('fs-extra');

Promise.all([
    fs.readFile('./package.json'),
    fs.readFile('./server/package.json')
]).then((buffers) => {
    const contentApp = JSON.parse(buffers[0].toString());
    const contentServer = JSON.parse(buffers[1].toString());
    delete contentApp.devDependencies;
    contentApp.scripts = {
        start: "node lib-server/webserver/server.js"
    };
    for (let key in contentServer.dependencies) {
        contentApp.dependencies[key] = contentServer.dependencies[key];
    }

    return fs.writeFile('./dist/package.json', JSON.stringify(contentApp, null, 4));
});