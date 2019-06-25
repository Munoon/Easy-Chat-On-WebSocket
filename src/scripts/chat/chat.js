import { WebSocketChat } from "./websocket.js";

export class Chat {
    constructor({ element, url }) {
        this.element = element;
        this.url = url;
        this.nickname = undefined;
        this._websocket = new WebSocketChat(this.url);

        this._initChat();

        document.getElementById('connectButton')
            .addEventListener('click', e => {
                this.nickname = document.getElementById('nickname').value;
                this._createConnection();
            });

        document.getElementById('messageButton')
            .addEventListener('click', e => {
                let message = document.getElementById('message').value;
                this._websocket.sendMessage(message);
            })
    }

    _initChat() {
        this.element.innerHTML = `
                                    <div>
                                        <input type="text" id="nickname">
                                        <button id="connectButton">Connect</button>
                                    </div>
                                    <div>
                                        <input type="text" id="message">
                                        <button id="messageButton">Send Message</button>
                                    </div>
                                `;
    }

    _createConnection() {
        this._websocket.connect({
            nickname: this.nickname,
            onOpen: () => {
                console.log('Connected succesfull!');
            },
            onMessage: message => {
                console.log(message);
            }
        })
    }
}