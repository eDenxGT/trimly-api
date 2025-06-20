"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
class SocketService {
    static setIO(io) {
        this._io = io;
    }
    static getIO() {
        if (!this._io)
            throw new Error("Socket.io instance not set.");
        return this._io;
    }
}
exports.SocketService = SocketService;
