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
let CancelMeetingUseCase = class CancelMeetingUseCase {
    _meetingRepository;
    constructor(_meetingRepository) {
        this._meetingRepository = _meetingRepository;
    }
    async execute({ meetingId }) {
        const meeting = await this._meetingRepository.findOne({ meetingId });
        if (!meeting) {
            throw new CustomError(ERROR_MESSAGES.MEETING_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }
        if (meeting.status === "completed") {
            throw new CustomError(ERROR_MESSAGES.MEETING_ALREADY_COMPLETED, HTTP_STATUS.BAD_REQUEST);
        }
        await this._meetingRepository.update({ meetingId }, { status: "cancelled" });
    }
};
CancelMeetingUseCase = __decorate([
    injectable(),
    __param(0, inject("IMeetingRoomRepository")),
    __metadata("design:paramtypes", [Object])
], CancelMeetingUseCase);
export { CancelMeetingUseCase };
