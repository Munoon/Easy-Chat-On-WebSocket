let socket = require('./socketServer.js');
let db = require('./database');

const PORT = 8081;

console.log('Aplication Started');

let socketServer = new socket.SocketServer({
    port: PORT,
    onConnection: socketConnection
});

let database = new db.Database();

function socketConnection(connection) {
    let clientId = ++database.userId;
    let clientNickname = connection.protocol;
    console.log(`${clientNickname} connected and get ID ${clientId}`);
    database.createClientMessages(clientId);

    let messageForConnected = JSON.stringify({
        type: 'connected',
        userNickname: clientNickname,
        userId: clientId,
        messages: database.getAllMessages()
    });
    connection.send(messageForConnected, database.users);

    let connectMessage = JSON.stringify({
        type: 'newConnect',
        userNickname: clientNickname,
        userId: clientId
    });
    socketServer.sendAll(connectMessage, database.users);
    database.createClient(clientId, connection);

    connection.on('message', message => {
        let jsonMessage = JSON.parse(message);
        
        switch (jsonMessage.type) {
            case 'sendMessage':
                console.log(`Received message from ${clientNickname}: ${jsonMessage.data}`);

                let messageData = JSON.stringify({
                    type: 'newMessage',
                    data: jsonMessage.data,
                    author: clientNickname,
                    authorId: clientId,
                    id: ++database.messageId,
                    date: new Date()
                });

                database.addMessage(clientId, messageData);
                socketServer.sendAll(messageData, database.users);
                break;
            case 'deleteMessage':
                let messageId = jsonMessage.data;

                if (database.checkForClientMessage(clientId, jsonMessage)) {
                    console.log('Hacking attempt');
                    return;
                }
                
                database.removeClientMessage(clientId, messageId);
                console.log('Deleted message with id ' + messageId);

                let deleteMessageData = JSON.stringify({
                    type: 'deleteMessage',
                    data: messageId
                });
                socketServer.sendAll(deleteMessageData, database.users);
        }
    });


    connection.on('close', () => {
        console.log(`User ${clientNickname} with id ${clientId} went offline`);
        database.removeClient(clientId);

        let closeMessage = JSON.stringify({
            type: 'disconnect',
            userId: clientId,
            userNickname: clientNickname
        });

        socketServer.sendAll(closeMessage, database.users);        
    });
}