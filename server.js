let WebSocketServer = new require('ws');
let clients = {};
let id = 0;

let socketServer = new WebSocketServer.Server({
    port: 8081
});

socketServer.on('connection', connection => {
    let clientId = ++id;
    let clientNickname = connection.protocol;
    clients[clientId] = connection;
    console.log(`${clientNickname} connected and get ID ${clientId}`);

    connection.on('message', message => {
        let stringMessage = JSON.parse(message).message;
        console.log(`Received message: ${stringMessage}`);

        for (let id in clients) {
            clients[id].send(message);
        }
    });


    connection.on('close', () => {
        console.log(`User ${clientNickname} with id ${clientId} went offline`);
        delete clients[clientId];
    });
});