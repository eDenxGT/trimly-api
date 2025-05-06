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
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES, } from "../../shared/constants.js";
import { CustomError } from "../../entities/utils/custom.error.js";
let MeetingController = class MeetingController {
    _scheduleMeetingUseCase;
    _getMeetingByCommunityIdUseCase;
    _getAllMeetingsForListingUseCase;
    _updateMeetingDetailsUseCase;
    _cancelMeetingUseCase;
    _completeMeetingUseCase;
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
    async scheduleMeet(req, res) {
        try {
            const { title, description, startTime, endTime, communityId, meetLink } = req.body;
            const { userId } = req.user;
            if (!title || !communityId || !meetLink || !startTime || !endTime) {
                throw new CustomError(ERROR_MESSAGES.MISSING_PARAMETERS, HTTP_STATUS.BAD_REQUEST);
            }
            await this._scheduleMeetingUseCase.execute({
                title,
                description,
                startTime,
                endTime,
                communityId,
                userId,
                meetLink,
            });
            res.status(HTTP_STATUS.CREATED).json({
                message: SUCCESS_MESSAGES.MEETING_CREATED,
                success: true,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                🛠️  Get Meeting By Community Id
    //* ─────────────────────────────────────────────────────────────
    async getMeetingByCommunityId(req, res) {
        try {
            const { communityId } = req.query;
            if (!communityId) {
                throw new CustomError(ERROR_MESSAGES.MISSING_PARAMETERS, HTTP_STATUS.BAD_REQUEST);
            }
            const meetingRoom = await this._getMeetingByCommunityIdUseCase.execute(String(communityId));
            res.status(HTTP_STATUS.OK).json({
                success: true,
                meeting: meetingRoom,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                🛠️  Get All Meetings For Listing
    //* ─────────────────────────────────────────────────────────────
    async getAllMeetingsForListing(req, res) {
        try {
            const { search, status, date, page, limit } = req.query;
            const { meetings, totalPages } = await this._getAllMeetingsForListingUseCase.execute({
                search: String(search),
                status: String(status),
                date: String(date),
                page: Number(page),
                limit: Number(limit),
            });
            res.status(HTTP_STATUS.OK).json({
                success: true,
                meetings,
                totalPages,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                🛠️  Update Meeting Details
    //* ─────────────────────────────────────────────────────────────
    async updateMeetingDetails(req, res) {
        try {
            const { title, description, startTime, endTime, communityId, meetLink, meetingId, } = req.body;
            await this._updateMeetingDetailsUseCase.execute({
                title,
                description,
                startTime,
                endTime,
                communityId,
                meetLink,
                meetingId,
            });
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                   🛠️  Complete Meeting
    //* ─────────────────────────────────────────────────────────────
    async completeMeeting(req, res) {
        try {
            const { meetingId } = req.body;
            if (!meetingId) {
                throw new CustomError(ERROR_MESSAGES.MISSING_PARAMETERS, HTTP_STATUS.BAD_REQUEST);
            }
            await this._completeMeetingUseCase.execute({
                meetingId: String(meetingId),
            });
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                   🛠️  Cancel Meeting
    //* ─────────────────────────────────────────────────────────────
    async cancelMeeting(req, res) {
        try {
            const { meetingId } = req.query;
            if (!meetingId) {
                throw new CustomError(ERROR_MESSAGES.MISSING_PARAMETERS, HTTP_STATUS.BAD_REQUEST);
            }
            await this._cancelMeetingUseCase.execute({
                meetingId: String(meetingId),
            });
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.CANCEL_SUCCESS,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
};
MeetingController = __decorate([
    injectable(),
    __param(0, inject("IScheduleMeetingUseCase")),
    __param(1, inject("IGetMeetingByCommunityIdUseCase")),
    __param(2, inject("IGetAllMeetingsForListingUseCase")),
    __param(3, inject("IUpdateMeetingDetailsUseCase")),
    __param(4, inject("ICancelMeetingUseCase")),
    __param(5, inject("ICompleteMeetingUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], MeetingController);
export { MeetingController };
