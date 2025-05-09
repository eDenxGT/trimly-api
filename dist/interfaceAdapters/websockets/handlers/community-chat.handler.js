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
import { SocketUserStore } from "../socket-user.store.js";
import socketLogger from "../../../shared/utils/socket.logger.js";
import { COMMUNITY_CHAT_EVENTS } from "../../../shared/constants.js";
import { getOnlineSocketIdsForMembers } from "../../../shared/utils/get-active-users.helper.js";
let CommunityChatSocketHandler = class CommunityChatSocketHandler {
    _sendCommunityMessageUseCase;
    _getCommunityByCommunityIdUseCase;
    _socket;
    _io;
    _socketUserStore = SocketUserStore.getInstance();
    constructor(_sendCommunityMessageUseCase, _getCommunityByCommunityIdUseCase) {
        this._sendCommunityMessageUseCase = _sendCommunityMessageUseCase;
        this._getCommunityByCommunityIdUseCase = _getCommunityByCommunityIdUseCase;
    }
    setSocket(socket, io) {
        this._socket = socket;
        this._io = io;
    }
    handleSendMessage = async (data) => {
        try {
            socketLogger.info("Community Message sent", {
                socketId: this._socket.id,
                userId: this._socket.data.userId,
            });
            const result = await this._sendCommunityMessageUseCase.execute(data);
            const community = await this._getCommunityByCommunityIdUseCase.execute(data.communityId);
            const onlineSocketIds = getOnlineSocketIdsForMembers(community?.members || []);
            onlineSocketIds.forEach((socketId) => {
                this._io
                    .to(socketId)
                    .emit(COMMUNITY_CHAT_EVENTS.RECEIVE_MESSAGE, result);
            });
        }
        catch (err) {
            this._socket.emit("error", { message: err.message });
        }
    };
};
CommunityChatSocketHandler = __decorate([
    injectable(),
    __param(0, inject("ISendCommunityMessageUseCase")),
    __param(1, inject("IGetCommunityByCommunityIdUseCase")),
    __metadata("design:paramtypes", [Object, Object])
], CommunityChatSocketHandler);
export { CommunityChatSocketHandler };
