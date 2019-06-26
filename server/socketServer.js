let WebSocketServer = new require('ws');

class SocketServer {
    constructor({ port, onConnection }) {
        this.port = port;

        this.WebSocketServer = new WebSocketServer.Server({ port });
        console.log(`Listening on port ${port}`);

        this.WebSocketServer.on('connection', onConnection);
    }

    sendAll(message, clients) {
        for (let id in clients) {
            clients[id].send(message);
        }
    }
}

exports.SocketServer = SocketServer;