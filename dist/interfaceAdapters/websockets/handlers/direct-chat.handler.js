"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectChatSocketHandler = void 0;
const tsyringe_1 = require("tsyringe");
const constants_1 = require("../../../shared/constants");
const socket_logger_1 = __importDefault(require("../../../shared/utils/socket.logger"));
const socket_user_store_1 = require("../socket-user.store");
let DirectChatSocketHandler = class DirectChatSocketHandler {
    constructor(_sendDirectMessageUseCase, _readDirectMessageUseCase) {
        this._sendDirectMessageUseCase = _sendDirectMessageUseCase;
        this._readDirectMessageUseCase = _readDirectMessageUseCase;
        this._socketUserStore = socket_user_store_1.SocketUserStore.getInstance();
        this.handleSendMessage = (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                socket_logger_1.default.info("Message sent", {
                    socketId: this._socket.id,
                    userId: this._socket.data.userId,
                });
                const receiverSocketId = this._socketUserStore.getSocketId(data.receiverId);
                const result = yield this._sendDirectMessageUseCase.execute(data);
                if (receiverSocketId) {
                    this._io
                        .to(receiverSocketId)
                        .emit(constants_1.DIRECT_CHAT_EVENTS.RECEIVE_MESSAGE, result);
                }
                // this._socket.emit(DIRECT_CHAT_EVENTS.RECEIVE_MESSAGE, result);
            }
            catch (err) {
                this._socket.emit("error", { message: err.message });
            }
        });
        this.handleReadMessage = (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = this._socket.data.userId;
                socket_logger_1.default.info("Message read", {
                    socketId: this._socket.id,
                    userId,
                });
                const chatRoomId = data.chatRoomId;
                yield this._readDirectMessageUseCase.execute({
                    chatRoomId,
                    userId,
                });
                this._socket.emit(constants_1.DIRECT_CHAT_EVENTS.MARK_AS_READ, chatRoomId);
            }
            catch (err) {
                this._socket.emit("error", { message: err.message });
            }
        });
    }
    setSocket(socket, io) {
        this._socket = socket;
        this._io = io;
    }
};
exports.DirectChatSocketHandler = DirectChatSocketHandler;
exports.DirectChatSocketHandler = DirectChatSocketHandler = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("ISendDirectMessageUseCase")),
    __param(1, (0, tsyringe_1.inject)("IReadDirectMessageUseCase")),
    __metadata("design:paramtypes", [Object, Object])
], DirectChatSocketHandler);
