export class Database {
    constructor(chanels, messages) {
        this.chanels = {};

        for (let chanelId in chanels) {
            let chanel = {
                name: chanels[chanelId]
            }
            this.chanels[chanelId] = chanel;
        }
        
        for (let chanelId in messages) {
            this.chanels[chanelId].messages = messages[chanelId];
        }
    }

    getAllChanelMessages(chanel) {
        return this.chanels[chanel].messages;
    }

    addMessage(chanel, message) {
        this.chanels[chanel].messages.push(message);
    }

    deleteMessage(chanel, messageId) {
        delete this.chanels[chanel].messages[messageId];
    }
}