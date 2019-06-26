let WebSocketServer = new require('ws');

class SocketServer {
    constructor({ port, onConnection }) {
        this.port = port;
        this.id = 0;
        this.clients = {};

        this.WebSocketServer = new WebSocketServer.Server({ port });
        console.log(`Listening on port ${port}`);

        this.WebSocketServer.on('connection', onConnection);
    }

    sendAll(message) {
        for (let id in this.clients) {
            this.clients[id].send(message);
        }
    }
}

exports.socketServer = SocketServer;