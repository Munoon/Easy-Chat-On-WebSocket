const GET_URL = (url) => `ws://${url}`;

export class WebSocketChat {
    constructor(url) {
        this.url = url;
    }

    connect({ nickname, onOpen, onMessage, onError }) {
        this.nickname = nickname;
        this._websocket = new WebSocket(GET_URL(this.url), [this.nickname]);

        this._websocket.onopen = () => onOpen();
        this._websocket.onmessage = event => onMessage(event.data); //onMessage(JSON.parse(event.data))
        this._websocket.onerror = error => onError(error);
    }

    sendMessage(message) {
        this._websocket.send(message);
    }
}