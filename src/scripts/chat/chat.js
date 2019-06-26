import { WebSocketChat } from "./websocket.js";
import { formatDate } from "../dateUtil.js";
import { Database } from "./localDatabase.js";
import { throws } from "assert";

export class Chat {
    constructor({ chat, chanelsMenu, url, nickname }) {
        this.chat = chat;
        this.chanelsMenu = chanelsMenu;
        this.url = url;
        this.chanel = 1;
        this._nickname = nickname;
        this._database = undefined;
        this._userId = undefined;
        this._activeChanel = undefined;
        this._websocket = new WebSocketChat(this.url);

        this._createConnection();
    }

    _initChat() {
        this.chat.innerHTML = `
                                    <div class="container">
                                        <ul id="messages" class="collection" hidden></ul>

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

    _initChanels(chanels) {
        for (let id in chanels) {
            let name = chanels[id];
            let element = document.createElement('a');
            element.classList.add('collection-item', 'chanels-group');
            element.textContent = name;
            element.dataset.id = id;
            this.chanelsMenu.append(element);
        }

        document.querySelectorAll('.chanels-group').forEach(item => {
            item.addEventListener('click', e => {
                e.preventDefault();

                if (this._activeChanel !== undefined) {
                    this._activeChanel.classList.remove('active');
                }

                e.target.classList.add('active');
                this._activeChanel = e.target;

                let chanelId = e.target.dataset.id;
                let messages = this._database.getAllChanelMessages(chanelId);

                this._initChat();
                messages.forEach(item => {
                    switch (item.type) {
                        case 'newMessage':
                            this._newMessage(item);
                            break;
                        case 'newConnect':
                            this._newConnect(item);
                            break;
                        case 'disconnect':
                            this._disconnect(item);
                            break;
                    }
                });
                this.chanel = chanelId;
            })
        })
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
                        this._database.addMessage(this.chanel, jsonMessage);
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
            chanel: this.chanel,
            data: message
        });
        this._websocket.sendMessage(jsonMessage);
    }

    _sendDelete(id) {
        console.log('Send delete id ' + id);
        let jsonMessage = JSON.stringify({
            type: 'deleteMessage',
            chanel: this.chanel,
            data: id
        });
        this._websocket.sendMessage(jsonMessage);
    }

    _newMessage(message) {
        console.log(`Message received (${message.type}) ${message.data}`);
        this.chat.children[0].children[0].hidden = false;
        this.chat.children[0].hidden = false;
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
        this._database.deleteMessage(this.chanel, messageId);
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
        this._initChanels(message.chanels);
        document.querySelector('.row').hidden = false;
        message.messages[1].forEach(item => this._newMessage(item));
        this._userId = message.userId;
        this._database = new Database(message.chanels, message.messages);
    }

    _newConnect(message) {
        console.log(`Connected user ${message.userNickname} (${message.userId})`);
        this._database.addMessage(1, message);
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
        this._database.addMessage(1, message);
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