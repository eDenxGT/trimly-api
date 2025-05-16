import { SocketUserStore } from "../socket-user.store.js";
import { SocketService } from "../../services/socket.service.js";
export class NotificationSocketHandler {
    _socketUserStore = SocketUserStore.getInstance();
    async handleSendNotificationByUserId(data) {
        const io = SocketService.getIO();
        const receiverSocketId = this._socketUserStore.getSocketId(data.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("receive-notification", data.payload);
        }
    }
}
