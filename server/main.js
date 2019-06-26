let socket = require('./socketServer.js');

const PORT = 8081;

console.log('Aplication Started');

let socketServer = new socket.socketServer({
    port: PORT,
    onConnection: socketConnection
});

function socketConnection(connection) {
    let clientId = ++socketServer.userId;
    let clientNickname = connection.protocol;
    console.log(`${clientNickname} connected and get ID ${clientId}`);
    socketServer.messages[clientId] = [];

    let messages = [];
    for (let user in socketServer.messages) {
        let list = socketServer.messages[user];
        if (list.length === 0) continue;
        
        list.forEach(message => messages.push(JSON.parse(message)));        
    }

    let messageForConnected = JSON.stringify({
        type: 'connected',
        userNickname: clientNickname,
        userId: clientId,
        messages
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
        let jsonMessage = JSON.parse(message);
        
        switch (jsonMessage.type) {
            case 'sendMessage':
                console.log(`Received message from ${clientNickname}: ${jsonMessage.data}`);

                let messageData = JSON.stringify({
                    type: 'newMessage',
                    data: jsonMessage.data,
                    author: clientNickname,
                    authorId: clientId,
                    id: ++socketServer.messageId,
                    date: new Date()
                });

                socketServer.messages[clientId].push(messageData);
                socketServer.sendAll(messageData);
                break;
            case 'deleteMessage':
                let messageId = jsonMessage.data;

                if (socketServer.messages[clientId].some(message => JSON.parse(message).id != messageId)) {
                    return;
                }
                
                socketServer.messages[clientId].filter(message => message.id != messageId);
                console.log('Deleted message with id ' + messageId);

                let deleteMessageData = JSON.stringify({
                    type: 'deleteMessage',
                    data: messageId
                });
                socketServer.sendAll(deleteMessageData);
        }
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