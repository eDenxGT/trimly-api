"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketServer = void 0;
const socket_io_1 = require("socket.io");
const config_1 = require("../../shared/config");
const direct_chat_events_1 = require("../../interfaceAdapters/websockets/events/direct-chat.events");
const community_chat_events_1 = require("../../interfaceAdapters/websockets/events/community-chat.events");
const notification_events_1 = require("../../interfaceAdapters/websockets/events/notification.events");
const socket_service_1 = require("../../interfaceAdapters/services/socket.service");
class SocketServer {
    constructor(httpServer) {
        this._io = new socket_io_1.Server(httpServer, {
            cors: { origin: config_1.config.cors.ALLOWED_ORIGIN },
        });
        socket_service_1.SocketService.setIO(this._io);
    }
    getIO() {
        return this._io;
    }
    onConnection(callback) {
        this._io.on("connection", (socket) => {
            callback(socket);
            const directChatEvents = new direct_chat_events_1.DirectChatEvents(socket, this._io);
            directChatEvents.register();
            const communityChatEvents = new community_chat_events_1.CommunityChatEvents(socket, this._io);
            communityChatEvents.register();
            const notificationEvents = new notification_events_1.NotificationEvents(socket, this._io);
            notificationEvents.register();
        });
    }
}
exports.SocketServer = SocketServer;
