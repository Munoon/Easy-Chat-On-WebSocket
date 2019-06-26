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
                    case 'newMessage':
                        this._newMessage(jsonMessage);
                        break;
                    case 'newConnect':
                        this._newConnect(jsonMessage);
                        break;
                    case 'disconnect':
                        this._disconnect(jsonMessage);
                        break;
                    case 'connected':
                        this._connected(jsonMessage);
                        break;
                    case 'deleteMessage':
                        this._deleteMessage(jsonMessage.data);
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
        console.log('Message sended ' + message);
        let jsonMessage = JSON.stringify({
            type: 'sendMessage',
            data: message
        });
        this._websocket.sendMessage(jsonMessage);
    }

    _sendDelete(id) {
        console.log('Delete id ' + id);
        let jsonMessage = JSON.stringify({
            type: 'deleteMessage',
            data: id
        });
        this._websocket.sendMessage(jsonMessage);
    }

    _newMessage(message) {
        console.log('Message received ' + message.data);
        let messageElement = document.createElement('li');
        messageElement.id = 'message-' + message.id;
        let assignClass = message.authorId === this._userId ? 'left-align' : 'right-align';
        messageElement.classList.add('collection-item', assignClass);
        messageElement.innerHTML = `
                                    <h5><span class="title" style="color: blue">${message.author}</span></h5>
                                    <p>${message.data}</p>
                                    ${formatDate(message.date)}
                                    ${message.authorId === this._userId ? `<a data-id="${message.id}" class="waves-effect waves-light btn delete-message">Delete</a>` : ""}
                                    `;
        this._messages.append(messageElement);
        if (message.authorId === this._userId) this._refreshDeleteButtons();
        document.getElementById('message').value = "";   
    }

    _deleteMessage(messageId) {
        let childrens = this._messages.children;
        for (let i = 0; i < childrens.length; i++) {
            let message = childrens[i];
            if (message.id == 'message-' + messageId) {
                this._messages.removeChild(message);
                console.log('Deleted message with id '+ messageId);
            }
        }
    }

    _connected(message) {
        console.log('Received connection confirmation from server');
        this._initChat();
        message.messages.forEach(item => this._newMessage(item));
        this._userId = message.userId;
    }

    _newConnect(message) {
        console.log(`Connected user ${message.userNickname} (${message.userId})`);
        let messageElement = document.createElement('li');
        messageElement.classList.add('collection-item', 'center-align');
        messageElement.innerHTML = `
                                    <p>New connection</p>
                                    <h5><span class="title" style="color: blue">${message.userNickname}</span></h5>
                                    `;
        this._messages.append(messageElement);
    }

    _disconnect(message) {
        console.log(`Disconnected user ${message.userNickname} (${message.userId})`);
        let messageElement = document.createElement('li');
        messageElement.classList.add('collection-item', 'center-align');
        messageElement.innerHTML = `
                                    <h5>User <span class="title" style="color: blue">${message.userNickname}</span> disconnected</h5>
                                    `;
        this._messages.append(messageElement);
    }

    _refreshDeleteButtons() {
        document.querySelectorAll('.delete-message').forEach(item => {
            item.addEventListener('click', e => {
                let id = e.target.dataset.id;
                this._sendDelete(id);
            })
        })
    }
}