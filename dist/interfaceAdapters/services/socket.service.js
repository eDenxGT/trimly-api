export class SocketService {
    static _io;
    static setIO(io) {
        this._io = io;
    }
    static getIO() {
        if (!this._io)
            throw new Error("Socket.io instance not set.");
        return this._io;
    }
}
