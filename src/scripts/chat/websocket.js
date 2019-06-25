import { Message } from "./message.js";

const GET_URL = (url) => `ws://${url}`;

export class WebSocketChat {
    constructor(url) {
        this.url = url;
    }

    connect({ nickname, onOpen, onMessage, onError }) {
        this.nickname = nickname;
        this._websocket = new WebSocket(GET_URL(this.url), [this.nickname]);

        this._websocket.onopen = () => onOpen();
        this._websocket.onmessage = event => onMessage(JSON.parse(event.data));
        this._websocket.onerror = error => onError(error);
    }

    sendMessage(messageData) {
        let message = new Message({
            author: this.nickname,
            message: messageData
        });
        let json = message.convertToJson();
        this._websocket.send(json);
    }
}