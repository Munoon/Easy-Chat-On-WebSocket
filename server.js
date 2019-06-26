let WebSocketServer = new require('ws');
let clients = {};
let id = 0;

const PORT = 8081;

console.log('Aplication Started');

let socketServer = new WebSocketServer.Server({
    port: PORT
});
console.log(`Listening on port ${PORT}`);

socketServer.on('connection', connection => {
    let clientId = ++id;
    let clientNickname = connection.protocol;
    clients[clientId] = connection;
    console.log(`${clientNickname} connected and get ID ${clientId}`);

    let connectMessage = JSON.stringify({
        type: 'connect',
        userNickname: clientNickname,
        userId: clientId
    })

    sendAll(connectMessage);

    connection.on('message', message => {
        console.log(`Received message from ${clientNickname}: ${message}`);

        let jsonMessage = JSON.stringify({
            type: 'message',
            data: message,
            author: clientNickname,
            authorId: clientId,
            date: new Date()
        });

        sendAll(jsonMessage);
    });


    connection.on('close', () => {
        console.log(`User ${clientNickname} with id ${clientId} went offline`);
        delete clients[clientId];

        let closeMessage = JSON.stringify({
            type: 'disconnect',
            userId: clientId,
            userNickname: clientNickname
        });

        sendAll(closeMessage);        
    });
});

function sendAll(message) {
    for (let id in clients) {
        clients[id].send(message);
    }
}