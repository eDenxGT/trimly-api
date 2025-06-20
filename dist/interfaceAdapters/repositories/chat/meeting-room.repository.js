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
exports.MeetingRoomRepository = void 0;
const tsyringe_1 = require("tsyringe");
const meeting_room_model_1 = require("../../../frameworks/database/mongoDb/models/chat/meeting-room.model");
const base_repository_1 = require("../base.repository");
let MeetingRoomRepository = class MeetingRoomRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(meeting_room_model_1.MeetingRoomModel);
    }
    findLastPlannedMeeting(communityId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield meeting_room_model_1.MeetingRoomModel.findOne({ communityId }).sort({
                createdAt: -1,
            });
        });
    }
    getAllMeetingsForListing(_a) {
        return __awaiter(this, arguments, void 0, function* ({ search, status, date, page, limit, }) {
            var _b;
            const matchConditions = [];
            if (search) {
                matchConditions.push({
                    $or: [
                        { title: { $regex: search, $options: "i" } },
                        { "communityDetails.name": { $regex: search, $options: "i" } },
                    ],
                });
            }
            if (status) {
                matchConditions.push({ status });
            }
            if (date) {
                const dateObj = new Date(date);
                const nextDay = new Date(dateObj);
                nextDay.setDate(dateObj.getDate() + 1);
                matchConditions.push({ startTime: { $gte: dateObj, $lt: nextDay } });
            }
            const basePipeline = [
                {
                    $lookup: {
                        from: "communities",
                        localField: "communityId",
                        foreignField: "communityId",
                        as: "communityDetails",
                    },
                },
                {
                    $unwind: {
                        path: "$communityDetails",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $match: matchConditions.length ? { $and: matchConditions } : {},
                },
            ];
            const countResult = yield meeting_room_model_1.MeetingRoomModel.aggregate([
                ...basePipeline,
                { $count: "total" },
            ]);
            const total = ((_b = countResult[0]) === null || _b === void 0 ? void 0 : _b.total) || 0;
            const totalPages = Math.ceil(total / limit);
            const meetings = yield meeting_room_model_1.MeetingRoomModel.aggregate([
                ...basePipeline,
                {
                    $project: {
                        meetingId: 1,
                        title: 1,
                        description: 1,
                        communityId: 1,
                        startTime: 1,
                        endTime: 1,
                        meetLink: 1,
                        status: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        "communityDetails.name": 1,
                        "communityDetails.imageUrl": 1,
                    },
                },
                { $skip: (page - 1) * limit },
                { $limit: limit },
                { $sort: { createdAt: -1 } },
            ]);
            return { meetings, totalPages };
        });
    }
};
exports.MeetingRoomRepository = MeetingRoomRepository;
exports.MeetingRoomRepository = MeetingRoomRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], MeetingRoomRepository);
