import { DIRECT_CHAT_EVENTS } from "../../../shared/constants.js";
import { directChatSocketHandler } from "../../../frameworks/di/resolver.js";
export class DirectChatEvents {
    socket;
    io;
    _handler;
    constructor(socket, io) {
        this.socket = socket;
        this.io = io;
        this._handler = directChatSocketHandler;
        this._handler.setSocket(this.socket, this.io);
    }
    register() {
        this.socket.on(DIRECT_CHAT_EVENTS.SEND_MESSAGE, this._handler.handleSendMessage);
        this.socket.on(DIRECT_CHAT_EVENTS.READ_MESSAGE, this._handler.handleReadMessage);
    }
}
