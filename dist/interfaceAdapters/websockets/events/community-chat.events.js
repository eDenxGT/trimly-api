"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityChatEvents = void 0;
const resolver_1 = require("../../../frameworks/di/resolver");
const constants_1 = require("../../../shared/constants");
class CommunityChatEvents {
    constructor(socket, io) {
        this.socket = socket;
        this.io = io;
        this._handler = resolver_1.communityChatSocketHandler;
        this._handler.setSocket(this.socket, this.io);
    }
    register() {
        this.socket.on(constants_1.COMMUNITY_CHAT_EVENTS.SEND_MESSAGE, this._handler.handleSendMessage);
    }
}
exports.CommunityChatEvents = CommunityChatEvents;
