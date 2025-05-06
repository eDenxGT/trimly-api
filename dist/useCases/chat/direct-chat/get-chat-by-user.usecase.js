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
let GetChatByUserUseCase = class GetChatByUserUseCase {
    _chatRoomRepository;
    _createChatRoomUseCase;
    constructor(_chatRoomRepository, _createChatRoomUseCase) {
        this._chatRoomRepository = _chatRoomRepository;
        this._createChatRoomUseCase = _createChatRoomUseCase;
    }
    async execute(opponentUserId, currentUserId, currentUserRole) {
        const isClient = currentUserRole === "client";
        const isChatRoomExists = await this._chatRoomRepository.findOne({
            clientId: isClient ? currentUserId : opponentUserId,
            barberId: isClient ? opponentUserId : currentUserId,
        });
        if (!isChatRoomExists) {
            await this._createChatRoomUseCase.execute({
                clientId: isClient ? currentUserId : opponentUserId,
                barberId: isClient ? opponentUserId : currentUserId,
            });
        }
        const chat = await this._chatRoomRepository.getChatRoomByUserId(currentUserId, opponentUserId, currentUserRole);
        return chat;
    }
};
GetChatByUserUseCase = __decorate([
    injectable(),
    __param(0, inject("IChatRoomRepository")),
    __param(1, inject("ICreateChatRoomUseCase")),
    __metadata("design:paramtypes", [Object, Object])
], GetChatByUserUseCase);
export { GetChatByUserUseCase };
