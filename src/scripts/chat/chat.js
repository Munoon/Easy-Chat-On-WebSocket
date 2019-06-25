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
                                    <div class="container">
                                        <ul id="messages" class="collection"></ul>

                                        <div class="row">
                                            <div class="input-field col s6">
                                                <input placeholder="Message" id="message" type="text" class="validate"><br>
                                                <a id="messageButton" class="waves-effect waves-light btn">Send</a>
                                            </div>
                                        </div>
                                    </div>
                                `;
    }

    _createConnection() {
        this._websocket.connect({
            nickname: this._nickname,
            onOpen: () => {
                console.log('Connected succesfull!');
            },
            onMessage: message => {
                let messageElement = document.createElement('li');
                let assignClass = message.author === this._nickname ? 'left-align' : 'right-align';
                messageElement.classList.add('collection-item', assignClass);
                messageElement.innerHTML = `
                                            <h5><span class="title">${message.author}</span></h5>
                                            <p>${message.message}</p>
                                            ${message.date}
                                            `;
                this._messages.append(messageElement);
                document.getElementById('message').value = "";
            }
        })
    }
}