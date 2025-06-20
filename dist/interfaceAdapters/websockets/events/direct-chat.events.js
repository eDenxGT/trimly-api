"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectChatEvents = void 0;
const constants_1 = require("../../../shared/constants");
const resolver_1 = require("../../../frameworks/di/resolver");
class DirectChatEvents {
    constructor(socket, io) {
        this.socket = socket;
        this.io = io;
        this._handler = resolver_1.directChatSocketHandler;
        this._handler.setSocket(this.socket, this.io);
    }
    register() {
        this.socket.on(constants_1.DIRECT_CHAT_EVENTS.SEND_MESSAGE, this._handler.handleSendMessage);
        this.socket.on(constants_1.DIRECT_CHAT_EVENTS.READ_MESSAGE, this._handler.handleReadMessage);
    }
}
exports.DirectChatEvents = DirectChatEvents;
