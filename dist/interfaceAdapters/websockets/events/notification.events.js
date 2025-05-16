import { NotificationSocketHandler } from "../handlers/notification.handler.js";
export class NotificationEvents {
    socket;
    io;
    handler;
    constructor(socket, io) {
        this.socket = socket;
        this.io = io;
        this.handler = new NotificationSocketHandler();
    }
    register() { }
}
