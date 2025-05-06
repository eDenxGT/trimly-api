import { Server } from "socket.io";
import { config } from "../../shared/config.js";
import { DirectChatEvents } from "../../interfaceAdapters/websockets/events/direct-chat.events.js";
import { CommunityChatEvents } from "../../interfaceAdapters/websockets/events/community-chat.events.js";
export class SocketServer {
    _io;
    constructor(httpServer) {
        this._io = new Server(httpServer, {
            cors: {
                origin: config.cors.ALLOWED_ORIGIN,
            },
        });
    }
    getIO() {
        return this._io;
    }
    onConnection(callback) {
        this._io.on("connection", (socket) => {
            callback(socket);
            const directChatEvents = new DirectChatEvents(socket, this._io);
            directChatEvents.register();
            const communityChatEvents = new CommunityChatEvents(socket, this._io);
            communityChatEvents.register();
        });
    }
}
