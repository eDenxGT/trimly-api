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
exports.MeetingController = void 0;
const tsyringe_1 = require("tsyringe");
const error_handler_1 = require("../../shared/utils/error.handler");
const constants_1 = require("../../shared/constants");
const custom_error_1 = require("../../entities/utils/custom.error");
let MeetingController = class MeetingController {
    constructor(_scheduleMeetingUseCase, _getMeetingByCommunityIdUseCase, _getAllMeetingsForListingUseCase, _updateMeetingDetailsUseCase, _cancelMeetingUseCase, _completeMeetingUseCase) {
        this._scheduleMeetingUseCase = _scheduleMeetingUseCase;
        this._getMeetingByCommunityIdUseCase = _getMeetingByCommunityIdUseCase;
        this._getAllMeetingsForListingUseCase = _getAllMeetingsForListingUseCase;
        this._updateMeetingDetailsUseCase = _updateMeetingDetailsUseCase;
        this._cancelMeetingUseCase = _cancelMeetingUseCase;
        this._completeMeetingUseCase = _completeMeetingUseCase;
    }
    //* ─────────────────────────────────────────────────────────────
    //*                    🛠️  Schedule Meeting
    //* ─────────────────────────────────────────────────────────────
    scheduleMeet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, description, startTime, endTime, communityId, meetLink } = req.body;
                const { userId } = req.user;
                if (!title || !communityId || !meetLink || !startTime || !endTime) {
                    throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.MISSING_PARAMETERS, constants_1.HTTP_STATUS.BAD_REQUEST);
                }
                yield this._scheduleMeetingUseCase.execute({
                    title,
                    description,
                    startTime,
                    endTime,
                    communityId,
                    userId,
                    meetLink,
                });
                res.status(constants_1.HTTP_STATUS.CREATED).json({
                    message: constants_1.SUCCESS_MESSAGES.MEETING_CREATED,
                    success: true,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                🛠️  Get Meeting By Community Id
    //* ─────────────────────────────────────────────────────────────
    getMeetingByCommunityId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { communityId } = req.query;
                if (!communityId) {
                    throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.MISSING_PARAMETERS, constants_1.HTTP_STATUS.BAD_REQUEST);
                }
                const meetingRoom = yield this._getMeetingByCommunityIdUseCase.execute(String(communityId));
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    meeting: meetingRoom,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                🛠️  Get All Meetings For Listing
    //* ─────────────────────────────────────────────────────────────
    getAllMeetingsForListing(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { search, status, date, page, limit } = req.query;
                const { meetings, totalPages } = yield this._getAllMeetingsForListingUseCase.execute({
                    search: String(search),
                    status: String(status),
                    date: String(date),
                    page: Number(page),
                    limit: Number(limit),
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    meetings,
                    totalPages,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                🛠️  Update Meeting Details
    //* ─────────────────────────────────────────────────────────────
    updateMeetingDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, description, startTime, endTime, communityId, meetLink, meetingId, } = req.body;
                yield this._updateMeetingDetailsUseCase.execute({
                    title,
                    description,
                    startTime,
                    endTime,
                    communityId,
                    meetLink,
                    meetingId,
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.UPDATE_SUCCESS,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                   🛠️  Complete Meeting
    //* ─────────────────────────────────────────────────────────────
    completeMeeting(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { meetingId } = req.body;
                if (!meetingId) {
                    throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.MISSING_PARAMETERS, constants_1.HTTP_STATUS.BAD_REQUEST);
                }
                yield this._completeMeetingUseCase.execute({
                    meetingId: String(meetingId),
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.UPDATE_SUCCESS,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                   🛠️  Cancel Meeting
    //* ─────────────────────────────────────────────────────────────
    cancelMeeting(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { meetingId } = req.query;
                if (!meetingId) {
                    throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.MISSING_PARAMETERS, constants_1.HTTP_STATUS.BAD_REQUEST);
                }
                yield this._cancelMeetingUseCase.execute({
                    meetingId: String(meetingId),
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.CANCEL_SUCCESS,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
};
exports.MeetingController = MeetingController;
exports.MeetingController = MeetingController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IScheduleMeetingUseCase")),
    __param(1, (0, tsyringe_1.inject)("IGetMeetingByCommunityIdUseCase")),
    __param(2, (0, tsyringe_1.inject)("IGetAllMeetingsForListingUseCase")),
    __param(3, (0, tsyringe_1.inject)("IUpdateMeetingDetailsUseCase")),
    __param(4, (0, tsyringe_1.inject)("ICancelMeetingUseCase")),
    __param(5, (0, tsyringe_1.inject)("ICompleteMeetingUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], MeetingController);
