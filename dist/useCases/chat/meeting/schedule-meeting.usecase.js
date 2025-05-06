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
import { generateUniqueId } from "../../../shared/utils/unique-uuid.helper.js";
import { CustomError } from "../../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants.js";
let ScheduleMeetingUseCase = class ScheduleMeetingUseCase {
    _meetingRoomRepository;
    constructor(_meetingRoomRepository) {
        this._meetingRoomRepository = _meetingRoomRepository;
    }
    async execute(input) {
        // ? Previous implementation
        // const meetLink = await this._calendarService.createMeeting({
        //   summary: input.title,
        //   description: input.description,
        //   start: input.startTime,
        //   end: input.endTime,
        // });
        const startTime = new Date(input.startTime);
        const endTime = new Date(input.endTime);
        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
            throw new CustomError(ERROR_MESSAGES.INVALID_DATES_FOR_MEETING, HTTP_STATUS.BAD_REQUEST);
        }
        const now = new Date();
        if (startTime <= now) {
            throw new CustomError(ERROR_MESSAGES.MEETING_CANNOT_SCHEDULE_IN_PAST, HTTP_STATUS.BAD_REQUEST);
        }
        if (startTime >= endTime) {
            throw new CustomError(ERROR_MESSAGES.START_TIME_MUST_BE_BEFORE_END_TIME, HTTP_STATUS.BAD_REQUEST);
        }
        const isMeetingExistsForThisCommunity = await this._meetingRoomRepository.findOne({
            communityId: input.communityId,
            status: "scheduled",
        });
        if (isMeetingExistsForThisCommunity) {
            throw new CustomError(ERROR_MESSAGES.MEETING_ALREADY_EXISTS, HTTP_STATUS.BAD_REQUEST);
        }
        await this._meetingRoomRepository.save({
            meetingId: generateUniqueId("meeting-room"),
            title: input.title,
            description: input.description,
            communityId: input.communityId,
            scheduledBy: input.userId,
            startTime: input.startTime,
            endTime: input.endTime,
            meetLink: input.meetLink,
        });
    }
};
ScheduleMeetingUseCase = __decorate([
    injectable(),
    __param(0, inject("IMeetingRoomRepository")),
    __metadata("design:paramtypes", [Object])
], ScheduleMeetingUseCase);
export { ScheduleMeetingUseCase };
