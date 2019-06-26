import { WebSocketChat } from "./websocket.js";
import { formatDate } from "../dateUtil.js";

export class Chat {
    constructor({ element, url, nickname }) {
        this.element = element;
        this.url = url;
        this._nickname = nickname;
        this._userId = undefined;
        this._websocket = new WebSocketChat(this.url);

        this._createConnection();
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
        document.getElementById('messageButton')
            .addEventListener('click', e => {
                let message = document.getElementById('message').value;
                this._sendMessage({ message });
            });
        this._messages = document.getElementById('messages');
    }

    _createConnection() {
        this._websocket.connect({
            nickname: this._nickname,
            onOpen: () => {
                console.log('Connected succesfull!');
            },
            onMessage: message => {
                let jsonMessage = JSON.parse(message);

                switch (jsonMessage.type) {
                    case 'message':
                        this._newMessage(jsonMessage);
                        break;
                    case 'connect':
                        this._connected(jsonMessage);
                        break;
                    case 'disconnect':
                        this._disconnect(jsonMessage);
                        break;
                }                            
            },
            onError: this._onError
        })
    }

    _onError(error) {
        alert('Error Connection');
    }

    _sendMessage({ message }) {
        this._websocket.sendMessage(message);
    }

    _newMessage(message) {
        let messageElement = document.createElement('li');
        let assignClass = message.authorId === this._userId ? 'left-align' : 'right-align';
        messageElement.classList.add('collection-item', assignClass);
        messageElement.innerHTML = `
                                    <h5><span class="title" style="color: blue">${message.author}</span></h5>
                                    <p>${message.data}</p>
                                    ${formatDate(message.date)}
                                    `;
        this._messages.append(messageElement);
        document.getElementById('message').value = "";   
    }

    _connected(message) {
        if (message.userNickname === this._nickname && this._userId === undefined) {
            console.log('Received connection confirmation from server')
            this._initChat();
            this._userId = message.userId;
            return;
        }

        let messageElement = document.createElement('li');
        messageElement.classList.add('collection-item', 'center-align');
        messageElement.innerHTML = `
                                    <p>New connection</p>
                                    <h5><span class="title" style="color: blue">${message.userNickname}</span></h5>
                                    `;
        this._messages.append(messageElement);
    }

    _disconnect(message) {
        let messageElement = document.createElement('li');
        messageElement.classList.add('collection-item', 'center-align');
        messageElement.innerHTML = `
                                    <h5>User <span class="title" style="color: blue">${message.userNickname}</span> disconnected</h5>
                                    `;
        this._messages.append(messageElement);
    }
}