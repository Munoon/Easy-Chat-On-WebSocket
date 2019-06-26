class Database {
    constructor() {
        this.userId = 0;
        this.users = {};

        this.chanelId = 0;
        this.chanels = {};
    }

    createClient(clientId, connection) {
        this.users[clientId] = connection;
    }

    removeClient(clientId) {
        delete this.users[clientId];
    }

    createClientMessages(client) {
        for (let chanel in this.chanels) {
            this.chanels[chanel].createClientMessages(client);
        }
    }

    addChanel(chanel) {
        this.chanels[chanel.id] = chanel;
    }

    removeChanel(chanel) {
        delete this.chanels[chanel.id];
    }

    getChanelById(id) {
        return this.chanels[id];
    }

    getAllMessages() {
        let arr = {};
        for (let chanel in this.chanels) {
            arr[chanel] = this.chanels[chanel].getAllMessages();
        }
        return arr;
    }

    getAllChanels() {
        let arr = {};
        for (let chanelId in this.chanels) {
            arr[chanelId] = this.chanels[chanelId].name;
        }
        return arr;
    }
}

exports.Database = Database;