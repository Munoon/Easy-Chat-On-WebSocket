export class Message {
    constructor({ author, message, date = new Date() }) {
        this.author = author;
        this.message = message;
        this.date = date;
    }

    getAuthor() {
        return this.author;
    }

    getMessage() {
        return this.message;
    }

    getDate() {
        return this.date;
    }

    convertToJson() {
        return JSON.stringify(this);
    }
}