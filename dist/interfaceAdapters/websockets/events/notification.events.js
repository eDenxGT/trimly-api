"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationEvents = void 0;
const notification_handler_1 = require("../handlers/notification.handler");
class NotificationEvents {
    constructor(socket, io) {
        this.socket = socket;
        this.io = io;
        this.handler = new notification_handler_1.NotificationSocketHandler();
    }
    register() { }
}
exports.NotificationEvents = NotificationEvents;
