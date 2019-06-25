import { WebSocketChat } from "./websocket.js";

export class Chat {
    constructor({ element, url, nickname }) {
        this.element = element;
        this.url = url;
        this._nickname = nickname;
        this._websocket = new WebSocketChat(this.url);

        this._createConnection();
        this._initChat();

        document.getElementById('messageButton')
            .addEventListener('click', e => {
                let message = document.getElementById('message').value;
                this._websocket.sendMessage(message);
            });

        this._messages = document.getElementById('messages');
    }

    _initChat() {
        this.element.innerHTML = `
                                    <div>
                                        <input type="text" id="message">
                                        <button id="messageButton">Send Message</button>
                                    </div>
                                    <div id="messages"></div>
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
                let messageElement = document.createElement('div');
                messageElement.classList.add('container');
                messageElement.innerHTML = `
                                                <div class="card">
                                                    <div class="card-header">${message.author}</div>
                                                    <div class="card-body">
                                                    <blockquote class="blockquote mb-0">
                                                        <p>${message.message}</p>
                                                        <footer class="blockquote-footer" style="content: none">${message.date}</footer>
                                                    </blockquote>
                                                    </div>
                                                </div>
                                            `;
                this._messages.append(messageElement);
            }
        })
    }
}