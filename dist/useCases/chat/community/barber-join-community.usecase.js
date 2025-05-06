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
import { CustomError } from "../../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants.js";
let BarberJoinCommunityUseCase = class BarberJoinCommunityUseCase {
    _communityRepository;
    constructor(_communityRepository) {
        this._communityRepository = _communityRepository;
    }
    async execute({ communityId, userId, }) {
        const community = await this._communityRepository.findOne({
            communityId,
            status: "active",
        });
        if (!community) {
            throw new CustomError(ERROR_MESSAGES.COMMUNITY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }
        if (community.members.includes(userId)) {
            throw new CustomError(ERROR_MESSAGES.ALREADY_JOINED_IN_COMMUNITY, HTTP_STATUS.BAD_REQUEST);
        }
        await this._communityRepository.update({ communityId }, {
            $addToSet: {
                members: userId
            }
        });
    }
};
BarberJoinCommunityUseCase = __decorate([
    injectable(),
    __param(0, inject("ICommunityRepository")),
    __metadata("design:paramtypes", [Object])
], BarberJoinCommunityUseCase);
export { BarberJoinCommunityUseCase };
