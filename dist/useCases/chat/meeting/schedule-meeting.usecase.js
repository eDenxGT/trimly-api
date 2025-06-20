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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleMeetingUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const unique_uuid_helper_1 = require("../../../shared/utils/unique-uuid.helper");
const custom_error_1 = require("../../../entities/utils/custom.error");
const constants_1 = require("../../../shared/constants");
let ScheduleMeetingUseCase = class ScheduleMeetingUseCase {
    constructor(_meetingRoomRepository) {
        this._meetingRoomRepository = _meetingRoomRepository;
    }
    execute(input) {
        return __awaiter(this, void 0, void 0, function* () {
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
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.INVALID_DATES_FOR_MEETING, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            const now = new Date();
            if (startTime <= now) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.MEETING_CANNOT_SCHEDULE_IN_PAST, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            if (startTime >= endTime) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.START_TIME_MUST_BE_BEFORE_END_TIME, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            const isMeetingExistsForThisCommunity = yield this._meetingRoomRepository.findOne({
                communityId: input.communityId,
                status: "scheduled",
            });
            if (isMeetingExistsForThisCommunity) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.MEETING_ALREADY_EXISTS, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            yield this._meetingRoomRepository.save({
                meetingId: (0, unique_uuid_helper_1.generateUniqueId)("meeting-room"),
                title: input.title,
                description: input.description,
                communityId: input.communityId,
                scheduledBy: input.userId,
                startTime: input.startTime,
                endTime: input.endTime,
                meetLink: input.meetLink,
            });
        });
    }
};
exports.ScheduleMeetingUseCase = ScheduleMeetingUseCase;
exports.ScheduleMeetingUseCase = ScheduleMeetingUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IMeetingRoomRepository")),
    __metadata("design:paramtypes", [Object])
], ScheduleMeetingUseCase);
