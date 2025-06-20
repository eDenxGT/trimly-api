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
exports.CommunityRepository = void 0;
const tsyringe_1 = require("tsyringe");
const base_repository_1 = require("../../base.repository");
const community_chat_room_model_1 = require("../../../../frameworks/database/mongoDb/models/chat/community-chat-room.model");
const get_active_users_helper_1 = require("../../../../shared/utils/get-active-users.helper");
let CommunityRepository = class CommunityRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(community_chat_room_model_1.CommunityModel);
    }
    findAllCommunitiesForListing(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filter, userId, search, page, limit, }) {
            const skip = (page - 1) * limit;
            const pipeline = [];
            if (search.trim()) {
                pipeline.push({
                    $match: {
                        name: { $regex: search.trim(), $options: "i" },
                    },
                });
            }
            if (filter && Object.keys(filter).length > 0) {
                pipeline.push({
                    $match: filter,
                });
            }
            pipeline.push({
                $sort: { createdAt: -1 },
            });
            pipeline.push({
                $lookup: {
                    from: "admins",
                    localField: "createdBy",
                    foreignField: "userId",
                    as: "adminDetails",
                },
            });
            pipeline.push({
                $unwind: {
                    path: "$adminDetails",
                    preserveNullAndEmptyArrays: true,
                },
            });
            pipeline.push({
                $addFields: Object.assign({ membersCount: { $size: "$members" } }, (userId
                    ? {
                        isJoined: {
                            $in: [userId, "$members"],
                        },
                    }
                    : {})),
            });
            pipeline.push({
                $facet: {
                    communities: [
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $project: {
                                _id: 0,
                                communityId: 1,
                                name: 1,
                                description: 1,
                                imageUrl: 1,
                                membersCount: 1,
                                isJoined: 1,
                                status: 1,
                                createdBy: {
                                    userId: "$createdBy",
                                    name: "$adminDetails.fullName",
                                    avatar: "$adminDetails.avatar",
                                },
                                createdAt: 1,
                                updatedAt: 1,
                            },
                        },
                    ],
                    totalCount: [{ $count: "count" }],
                },
            });
            pipeline.push({
                $project: {
                    communities: 1,
                    totalCount: {
                        $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0],
                    },
                },
            });
            const result = yield community_chat_room_model_1.CommunityModel.aggregate(pipeline).exec();
            const { communities, totalCount } = result[0] || {
                communities: [],
                totalCount: 0,
            };
            const totalPages = Math.ceil(totalCount / limit);
            return {
                communities,
                totalPages,
                currentPage: page,
            };
        });
    }
    getAllCommunityChatsByUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, }) {
            const communities = yield community_chat_room_model_1.CommunityModel.aggregate([
                {
                    $match: {
                        members: userId,
                        status: "active",
                    },
                },
                {
                    $lookup: {
                        from: "communitymessages",
                        let: { communityId: "$communityId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$communityId", "$$communityId"] },
                                },
                            },
                            { $sort: { timestamp: -1 } },
                            { $limit: 1 },
                            {
                                $lookup: {
                                    from: "barbers",
                                    localField: "senderId",
                                    foreignField: "userId",
                                    as: "senderDetails",
                                },
                            },
                            {
                                $unwind: {
                                    path: "$senderDetails",
                                    preserveNullAndEmptyArrays: true,
                                },
                            },
                            {
                                $project: {
                                    _id: 0,
                                    content: 1,
                                    mediaUrl: 1,
                                    messageType: 1,
                                    timestamp: 1,
                                    senderDetails: {
                                        userId: "$senderDetails.userId",
                                        name: "$senderDetails.name",
                                        profileImageUrl: "$senderDetails.profileImageUrl",
                                        role: { $literal: "barber" },
                                    },
                                },
                            },
                        ],
                        as: "lastMessage",
                    },
                },
                {
                    $addFields: {
                        lastMessage: { $arrayElemAt: ["$lastMessage", 0] },
                        membersCount: { $size: "$members" },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        communityId: 1,
                        name: 1,
                        description: 1,
                        imageUrl: 1,
                        membersCount: 1,
                        lastMessage: 1,
                    },
                },
            ]);
            return communities.map((community) => {
                var _a;
                return (Object.assign(Object.assign({}, community), { lastMessage: (_a = community.lastMessage) !== null && _a !== void 0 ? _a : null }));
            });
        });
    }
    getCommunityChat(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, chatId, }) {
            const communities = yield community_chat_room_model_1.CommunityModel.aggregate([
                {
                    $match: {
                        communityId: chatId,
                        members: { $in: [userId] },
                        status: "active",
                    },
                },
                {
                    $lookup: {
                        from: "admins",
                        localField: "createdBy",
                        foreignField: "userId",
                        as: "createdByUser",
                    },
                },
                { $unwind: "$createdByUser" },
                {
                    $lookup: {
                        from: "barbers",
                        localField: "members",
                        foreignField: "userId",
                        as: "membersData",
                    },
                },
                {
                    $lookup: {
                        from: "communitymessages",
                        let: { communityId: "$communityId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$communityId", "$$communityId"] },
                                },
                            },
                            { $sort: { timestamp: 1 } },
                            {
                                $lookup: {
                                    from: "barbers",
                                    localField: "senderId",
                                    foreignField: "userId",
                                    as: "sender",
                                },
                            },
                            { $unwind: "$sender" },
                            {
                                $project: {
                                    _id: 0,
                                    messageId: "$messageId",
                                    communityId: "$communityId",
                                    messageType: "$messageType",
                                    content: "$content",
                                    mediaUrl: "$mediaUrl",
                                    timestamp: "$timestamp",
                                    status: "$status",
                                    readBy: "$readBy",
                                    senderId: "$sender.userId",
                                    senderName: "$sender.shopName",
                                    senderAvatar: "$sender.avatar",
                                },
                            },
                        ],
                        as: "messages",
                    },
                },
                {
                    $project: {
                        _id: 0,
                        communityId: 1,
                        name: 1,
                        description: 1,
                        imageUrl: 1,
                        status: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        membersCount: { $size: "$members" },
                        members: {
                            $map: {
                                input: "$membersData",
                                as: "member",
                                in: {
                                    userId: "$$member.userId",
                                    name: "$$member.shopName",
                                    avatar: "$$member.avatar",
                                },
                            },
                        },
                        createdBy: {
                            userId: "$createdByUser.userId",
                            name: "$createdByUser.shopName",
                            avatar: "$createdByUser.avatar",
                        },
                        messages: 1,
                    },
                },
            ]);
            const community = communities.length > 0 ? communities[0] : null;
            if (!community)
                return null;
            const activeMemberCount = (0, get_active_users_helper_1.getActiveUsersCount)(community.members);
            return Object.assign(Object.assign({}, community), { activeMembers: activeMemberCount });
        });
    }
};
exports.CommunityRepository = CommunityRepository;
exports.CommunityRepository = CommunityRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], CommunityRepository);
