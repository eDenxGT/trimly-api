import { Socket, Server } from "socket.io";
import { inject, injectable } from "tsyringe";
import { SocketUserStore } from "../socket-user.store";
import socketLogger from "../../../shared/utils/socket.logger";
import { COMMUNITY_CHAT_EVENTS } from "../../../shared/constants";
import { ICommunityChatSocketHandler } from "../../../entities/socketHandlerInterfaces/community-chat-handler.interface";
import { ISendCommunityMessageUseCase } from "../../../entities/useCaseInterfaces/chat/community/send-community-message-usecase.interface";
import { getOnlineSocketIdsForMembers } from "../../../shared/utils/get-active-users.helper";
import { IGetCommunityByCommunityIdUseCase } from "../../../entities/useCaseInterfaces/chat/community/get-community-by-communityid-usecase.interface";

@injectable()
export class CommunityChatSocketHandler implements ICommunityChatSocketHandler {
  private _socket!: Socket;
  private _io!: Server;
  private _socketUserStore = SocketUserStore.getInstance();

  constructor(
    @inject("ISendCommunityMessageUseCase")
    private _sendCommunityMessageUseCase: ISendCommunityMessageUseCase,
    @inject("IGetCommunityByCommunityIdUseCase")
    private _getCommunityByCommunityIdUseCase: IGetCommunityByCommunityIdUseCase
  ) {}

  setSocket(socket: Socket, io: Server) {
    this._socket = socket;
    this._io = io;
  }

  handleSendMessage = async (data: any) => {
    try {
      socketLogger.info("Community Message sent", {
        socketId: this._socket.id,
        userId: this._socket.data.userId,
      });

      const result = await this._sendCommunityMessageUseCase.execute(data);

      const community = await this._getCommunityByCommunityIdUseCase.execute(
        data.communityId
      );

      const onlineSocketIds = getOnlineSocketIdsForMembers(
        community?.members || []
      );

      onlineSocketIds.forEach((socketId) => {
        this._io
          .to(socketId)
          .emit(COMMUNITY_CHAT_EVENTS.RECEIVE_MESSAGE, result);
      });
    } catch (err: any) {
      this._socket.emit("error", { message: err.message });
    }
  };
}
