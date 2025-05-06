export class SocketUserStore {
    static instance;
    connectedUsers = new Map();
    constructor() { }
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
