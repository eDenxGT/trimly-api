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
exports.CommunityChatSocketHandler = void 0;
const tsyringe_1 = require("tsyringe");
const socket_user_store_1 = require("../socket-user.store");
const socket_logger_1 = __importDefault(require("../../../shared/utils/socket.logger"));
const constants_1 = require("../../../shared/constants");
const get_active_users_helper_1 = require("../../../shared/utils/get-active-users.helper");
let CommunityChatSocketHandler = class CommunityChatSocketHandler {
    constructor(_sendCommunityMessageUseCase, _getCommunityByCommunityIdUseCase) {
        this._sendCommunityMessageUseCase = _sendCommunityMessageUseCase;
        this._getCommunityByCommunityIdUseCase = _getCommunityByCommunityIdUseCase;
        this._socketUserStore = socket_user_store_1.SocketUserStore.getInstance();
        this.handleSendMessage = (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                socket_logger_1.default.info("Community Message sent", {
                    socketId: this._socket.id,
                    userId: this._socket.data.userId,
                });
                const result = yield this._sendCommunityMessageUseCase.execute(data);
                const community = yield this._getCommunityByCommunityIdUseCase.execute(data.communityId);
                const onlineSocketIds = (0, get_active_users_helper_1.getOnlineSocketIdsForMembers)((community === null || community === void 0 ? void 0 : community.members) || []);
                onlineSocketIds.forEach((socketId) => {
                    this._io
                        .to(socketId)
                        .emit(constants_1.COMMUNITY_CHAT_EVENTS.RECEIVE_MESSAGE, result);
                });
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
exports.CommunityChatSocketHandler = CommunityChatSocketHandler;
exports.CommunityChatSocketHandler = CommunityChatSocketHandler = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("ISendCommunityMessageUseCase")),
    __param(1, (0, tsyringe_1.inject)("IGetCommunityByCommunityIdUseCase")),
    __metadata("design:paramtypes", [Object, Object])
], CommunityChatSocketHandler);
