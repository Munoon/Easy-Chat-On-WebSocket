let WebSocketServer = new require('ws');

// подключенные клиенты
let clients = {};

// WebSocket-сервер на порту 8081
let webSocketServer = new WebSocketServer.Server({
  port: 8081
});

webSocketServer.on('connection', function(ws) {
  let nickname = ws.protocol;
  clients[ws.protocol] = ws;
  console.log("новое соединение " + ws.protocol);

  ws.on('message', function(message) {
    console.log('получено сообщение ' + message);

    for (var key in clients) {
      clients[key].send(message);
    }
  });

  ws.on('close', function() {
    console.log('соединение закрыто ' + nickname);
    delete clients[nickname];
  });

});