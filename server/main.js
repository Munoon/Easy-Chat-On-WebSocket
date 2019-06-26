let socket = require('./socketServer.js');

const PORT = 8081;

console.log('Aplication Started');

let socketServer = new socket.socketServer({
    port: PORT,
    onConnection: socketConnection
});

function socketConnection(connection) {
    let clientId = ++socketServer.id;
    let clientNickname = connection.protocol;
    console.log(`${clientNickname} connected and get ID ${clientId}`);

    let messageForConnected = JSON.stringify({
        type: 'connected',
        userNickname: clientNickname,
        userId: clientId
    });
    connection.send(messageForConnected);

    let connectMessage = JSON.stringify({
        type: 'newConnect',
        userNickname: clientNickname,
        userId: clientId
    });
    socketServer.sendAll(connectMessage);
    socketServer.clients[clientId] = connection;

    connection.on('message', message => {
        console.log(`Received message from ${clientNickname}: ${message}`);

        let jsonMessage = JSON.stringify({
            type: 'message',
            data: message,
            author: clientNickname,
            authorId: clientId,
            date: new Date()
        });

        socketServer.sendAll(jsonMessage);
    });


    connection.on('close', () => {
        console.log(`User ${clientNickname} with id ${clientId} went offline`);
        delete socketServer.clients[clientId];

        let closeMessage = JSON.stringify({
            type: 'disconnect',
            userId: clientId,
            userNickname: clientNickname
        });

        socketServer.sendAll(closeMessage);        
    });
}