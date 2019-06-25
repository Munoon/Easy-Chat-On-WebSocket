export class Message {
    constructor({ author, message, date = new Date() }) {
        this.author = author;
        this.message = message;
        this.date = date;
    }

    convertToJson() {
        return JSON.stringify(this);
    }
}