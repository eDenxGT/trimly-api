import { communityChatSocketHandler } from "../../../frameworks/di/resolver.js";
import { COMMUNITY_CHAT_EVENTS } from "../../../shared/constants.js";
export class CommunityChatEvents {
    socket;
    io;
    _handler;
    constructor(socket, io) {
        this.socket = socket;
        this.io = io;
        this._handler = communityChatSocketHandler;
        this._handler.setSocket(this.socket, this.io);
    }
    register() {
        this.socket.on(COMMUNITY_CHAT_EVENTS.SEND_MESSAGE, this._handler.handleSendMessage);
    }
}
