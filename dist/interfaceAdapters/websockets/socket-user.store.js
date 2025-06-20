"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketUserStore = void 0;
class SocketUserStore {
    constructor() {
        this.connectedUsers = new Map();
    }
    static getInstance() {
        if (!SocketUserStore.instance) {
            SocketUserStore.instance = new SocketUserStore();
        }
        return SocketUserStore.instance;
    }
    addUser(userId, socketId) {
        this.connectedUsers.set(userId, socketId);
    }
    removeUser(userId) {
        this.connectedUsers.delete(userId);
    }
    getSocketId(userId) {
        return this.connectedUsers.get(userId);
    }
    getAllUsers() {
        return Array.from(this.connectedUsers.entries());
    }
}
exports.SocketUserStore = SocketUserStore;
