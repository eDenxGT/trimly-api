"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSocketHandler = void 0;
const socket_user_store_1 = require("../socket-user.store");
const socket_service_1 = require("../../services/socket.service");
class NotificationSocketHandler {
    constructor() {
        this._socketUserStore = socket_user_store_1.SocketUserStore.getInstance();
    }
    handleSendNotificationByUserId(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const io = socket_service_1.SocketService.getIO();
            const receiverSocketId = this._socketUserStore.getSocketId(data.receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receive-notification", data.payload);
            }
        });
    }
}
exports.NotificationSocketHandler = NotificationSocketHandler;
