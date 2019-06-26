class Chanel {
    constructor(name, id) {
        this.name = name;
        this.id = id;

        this._messages = {};
        this.messageId = 0;
    }

    createClientMessages(client) {
        this._messages[client] = [];
    }

    getAllMessagesFromClient(client) {
        return this._messages[client];
    }

    getAllMessages() {
        let arr = [];
        for (let user in this._messages) {
            arr.push(this._messages[user]);
        }
        arr = arr.reduce((acc, val) => acc.concat(val), []);
        arr = arr.filter(item => item !== null)
        return arr.map(str => JSON.parse(str));
    }

    addMessage(client, message) {
        this._messages[client].push(message);
    }

    checkForClientMessage(clientId, message) {
        this._messages[clientId].some(msg => JSON.parse(msg).id == message.data);
    }

    removeClientMessage(client, messageId) {
        this._messages[client].forEach((item, index) => {
            if (JSON.parse(item).id == messageId)
                delete this._messages[client][index];
        })
    }
}

exports.Chanel = Chanel;