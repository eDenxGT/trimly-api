var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { injectable } from "tsyringe";
import { DirectMessageModel, } from "../../../../frameworks/database/mongoDb/models/chat/direct-message.model.js";
import { BaseRepository } from "../../base.repository.js";
let DirectMessageRepository = class DirectMessageRepository extends BaseRepository {
    constructor() {
        super(DirectMessageModel);
    }
    async markMessagesAsRead({ chatRoomId, userId, }) {
        await this.model.updateMany({
            chatRoomId,
            receiverId: userId,
            status: "sent",
        }, {
            $set: { status: "read" },
        });
    }
};
DirectMessageRepository = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], DirectMessageRepository);
export { DirectMessageRepository };
