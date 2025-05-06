var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { inject, injectable } from "tsyringe";
import { DIRECT_CHAT_EVENTS } from "../../../shared/constants.js";
import socketLogger from "../../../shared/utils/socket.logger.js";
import { SocketUserStore } from "../socket-user.store.js";
let DirectChatSocketHandler = class DirectChatSocketHandler {
    _sendDirectMessageUseCase;
    _readDirectMessageUseCase;
    _socket;
    _io;
    _socketUserStore = SocketUserStore.getInstance();
    constructor(_sendDirectMessageUseCase, _readDirectMessageUseCase) {
        this._sendDirectMessageUseCase = _sendDirectMessageUseCase;
        this._readDirectMessageUseCase = _readDirectMessageUseCase;
    }
    setSocket(socket, io) {
        this._socket = socket;
        this._io = io;
    }
    handleSendMessage = async (data) => {
        try {
            console.log(data);
            socketLogger.info("Message sent", {
                socketId: this._socket.id,
                userId: this._socket.data.userId,
            });
            const receiverSocketId = this._socketUserStore.getSocketId(data.receiverId);
            const result = await this._sendDirectMessageUseCase.execute(data);
            if (receiverSocketId) {
                this._io
                    .to(receiverSocketId)
                    .emit(DIRECT_CHAT_EVENTS.RECEIVE_MESSAGE, result);
            }
            // this._socket.emit(DIRECT_CHAT_EVENTS.RECEIVE_MESSAGE, result);
        }
        catch (err) {
            this._socket.emit("error", { message: err.message });
        }
    };
    handleReadMessage = async (data) => {
        try {
            const userId = this._socket.data.userId;
            socketLogger.info("Message read", {
                socketId: this._socket.id,
                userId,
            });
            const chatRoomId = data.chatRoomId;
            await this._readDirectMessageUseCase.execute({
                chatRoomId,
                userId,
            });
            this._io.emit(DIRECT_CHAT_EVENTS.READ_MESSAGE, {
                chatRoomId,
                success: true,
            });
        }
        catch (err) {
            this._socket.emit("error", { message: err.message });
        }
    };
};
DirectChatSocketHandler = __decorate([
    injectable(),
    __param(0, inject("ISendDirectMessageUseCase")),
    __param(1, inject("IReadDirectMessageUseCase")),
    __metadata("design:paramtypes", [Object, Object])
], DirectChatSocketHandler);
export { DirectChatSocketHandler };
