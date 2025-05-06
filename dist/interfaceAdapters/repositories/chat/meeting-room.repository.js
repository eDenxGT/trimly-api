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
import { MeetingRoomModel, } from "../../../frameworks/database/mongoDb/models/chat/meeting-room.model.js";
import { BaseRepository } from "../base.repository.js";
let MeetingRoomRepository = class MeetingRoomRepository extends BaseRepository {
    constructor() {
        super(MeetingRoomModel);
    }
    async findLastPlannedMeeting(communityId) {
        return await MeetingRoomModel.findOne({ communityId }).sort({
            createdAt: -1,
        });
    }
    async getAllMeetingsForListing({ search, status, date, page, limit, }) {
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
        const countResult = await MeetingRoomModel.aggregate([
            ...basePipeline,
            { $count: "total" },
        ]);
        const total = countResult[0]?.total || 0;
        const totalPages = Math.ceil(total / limit);
        const meetings = await MeetingRoomModel.aggregate([
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
    }
};
MeetingRoomRepository = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], MeetingRoomRepository);
export { MeetingRoomRepository };
