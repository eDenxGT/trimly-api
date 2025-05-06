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
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants.js";
import { CustomError } from "../../../entities/utils/custom.error.js";
let UpdateMeetingDetailsUseCase = class UpdateMeetingDetailsUseCase {
    _meetingRoomRepository;
    constructor(_meetingRoomRepository) {
        this._meetingRoomRepository = _meetingRoomRepository;
    }
    async execute({ title, description, startTime, endTime, communityId, meetLink, meetingId, }) {
        const startMeetTime = new Date(startTime);
        const endMeetTime = new Date(endTime);
        if (isNaN(startMeetTime.getTime()) || isNaN(endMeetTime.getTime())) {
            throw new CustomError(ERROR_MESSAGES.INVALID_DATES_FOR_MEETING, HTTP_STATUS.BAD_REQUEST);
        }
        const now = new Date();
        if (startMeetTime <= now) {
            throw new CustomError(ERROR_MESSAGES.MEETING_CANNOT_SCHEDULE_IN_PAST, HTTP_STATUS.BAD_REQUEST);
        }
        if (startMeetTime >= endMeetTime) {
            throw new CustomError(ERROR_MESSAGES.START_TIME_MUST_BE_BEFORE_END_TIME, HTTP_STATUS.BAD_REQUEST);
        }
        await this._meetingRoomRepository.update({ meetingId, communityId }, {
            title,
            description,
            startTime,
            endTime,
            meetLink,
        });
    }
};
UpdateMeetingDetailsUseCase = __decorate([
    injectable(),
    __param(0, inject("IMeetingRoomRepository")),
    __metadata("design:paramtypes", [Object])
], UpdateMeetingDetailsUseCase);
export { UpdateMeetingDetailsUseCase };
