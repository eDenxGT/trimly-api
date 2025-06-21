import {Server, Socket} from "socket.io";
import {SocketUserStore} from "../socket-user.store";
import {INotificationSocketHandler} from "../../../entities/socketHandlerInterfaces/notification-handler.interface";
import {SocketService} from "../../services/socket.service";

export class NotificationSocketHandler implements INotificationSocketHandler {
   private _socketUserStore = SocketUserStore.getInstance();

   async handleSendNotificationByUserId(data: any): Promise<void> {
      const io = SocketService.getIO();

      const receiverSocketId = this._socketUserStore.getSocketId(data.receiverId);

      if (receiverSocketId) {
         io.to(receiverSocketId).emit("receive-notification", data.payload);
      }
   }
}
