import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { config } from "../../shared/config";
import { DirectChatEvents } from "../../interfaceAdapters/websockets/events/direct-chat.events";
import { CommunityChatEvents } from "../../interfaceAdapters/websockets/events/community-chat.events";
import { NotificationEvents } from "../../interfaceAdapters/websockets/events/notification.events";
import { SocketService } from "../../interfaceAdapters/services/socket.service";

export class SocketServer {
  private _io: Server;

  constructor(httpServer: HttpServer) {
    this._io = new Server(httpServer, {
      cors: { origin: config.cors.ALLOWED_ORIGIN },
    });

    SocketService.setIO(this._io);
  }

  public getIO(): Server {
    return this._io;
  }

  public onConnection(callback: (socket: Socket) => void): void {
    this._io.on("connection", (socket) => {
      callback(socket);

      const directChatEvents = new DirectChatEvents(socket, this._io);
      directChatEvents.register();

      const communityChatEvents = new CommunityChatEvents(socket, this._io);
      communityChatEvents.register();

      const notificationEvents = new NotificationEvents(socket, this._io);
      notificationEvents.register();
    });
  }
}
