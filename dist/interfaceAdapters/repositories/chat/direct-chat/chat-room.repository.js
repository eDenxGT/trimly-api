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
import { BaseRepository } from "../../base.repository.js";
import { ChatRoomModel, } from "../../../../frameworks/database/mongoDb/models/chat/chat-room.model.js";
let ChatRoomRepository = class ChatRoomRepository extends BaseRepository {
    constructor() {
        super(ChatRoomModel);
    }
    async getChatRoomByChatId(chatId, role) {
        const otherRole = role === "client" ? "barber" : "client";
        const participantCollection = otherRole === "barber" ? "barbers" : "clients";
        const chat = await ChatRoomModel.aggregate([
            { $match: { chatRoomId: chatId } },
            {
                $lookup: {
                    from: participantCollection,
                    localField: `${otherRole}Id`,
                    foreignField: "userId",
                    as: "participantUser",
                },
            },
            { $unwind: "$participantUser" },
            {
                $lookup: {
                    from: "directmessages",
                    localField: "chatRoomId",
                    foreignField: "chatRoomId",
                    as: "messages",
                },
            },
            {
                $addFields: {
                    messages: {
                        $sortArray: {
                            input: "$messages",
                            sortBy: { timestamp: 1 },
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    chatRoomId: 1,
                    participant: {
                        userId: "$participantUser.userId",
                        name: {
                            $ifNull: [
                                "$participantUser.fullName",
                                "$participantUser.shopName",
                            ],
                        },
                        profileImageUrl: "$participantUser.avatar",
                        role: otherRole,
                    },
                    messages: {
                        $map: {
                            input: "$messages",
                            as: "msg",
                            in: {
                                messageId: "$$msg.messageId",
                                chatRoomId: "$$msg.chatRoomId",
                                senderId: "$$msg.senderId",
                                receiverId: "$$msg.receiverId",
                                messageType: "$$msg.messageType",
                                content: "$$msg.content",
                                mediaUrl: "$$msg.mediaUrl",
                                timestamp: "$$msg.timestamp",
                                status: "$$msg.status",
                            },
                        },
                    },
                },
            },
        ]);
        return chat[0] || null;
    }
    async getChatRoomByUserId(currentUserId, opponentUserId, currentUserRole) {
        const matchQuery = currentUserRole === "client"
            ? { clientId: currentUserId, barberId: opponentUserId }
            : { clientId: opponentUserId, barberId: currentUserId };
        const otherRole = currentUserRole === "client" ? "barber" : "client";
        const participantCollection = otherRole === "barber" ? "barbers" : "clients";
        const chat = await ChatRoomModel.aggregate([
            { $match: matchQuery },
            {
                $lookup: {
                    from: participantCollection,
                    localField: `${otherRole}Id`,
                    foreignField: "userId",
                    as: "participantUser",
                },
            },
            { $unwind: "$participantUser" },
            {
                $lookup: {
                    from: "directmessages",
                    localField: "chatRoomId",
                    foreignField: "chatRoomId",
                    as: "messages",
                },
            },
            {
                $addFields: {
                    messages: {
                        $sortArray: {
                            input: "$messages",
                            sortBy: { timestamp: 1 },
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    chatRoomId: 1,
                    participant: {
                        userId: "$participantUser.userId",
                        name: {
                            $ifNull: [
                                "$participantUser.fullName",
                                "$participantUser.shopName",
                            ],
                        },
                        profileImageUrl: "$participantUser.avatar",
                        role: otherRole,
                    },
                    messages: {
                        $map: {
                            input: "$messages",
                            as: "msg",
                            in: {
                                messageId: "$$msg.messageId",
                                chatRoomId: "$$msg.chatRoomId",
                                senderId: "$$msg.senderId",
                                receiverId: "$$msg.receiverId",
                                messageType: "$$msg.messageType",
                                content: "$$msg.content",
                                mediaUrl: "$$msg.mediaUrl",
                                timestamp: "$$msg.timestamp",
                                status: "$$msg.status",
                            },
                        },
                    },
                },
            },
        ]);
        return chat[0] || null;
    }
    async getAllChatsByUserId(userId, userRole) {
        const matchField = userRole === "client" ? "clientId" : "barberId";
        const otherRole = userRole === "client" ? "barber" : "client";
        const participantCollection = otherRole === "barber" ? "barbers" : "clients";
        const chats = await ChatRoomModel.aggregate([
            {
                $match: {
                    [matchField]: userId,
                },
            },
            {
                $lookup: {
                    from: participantCollection,
                    localField: `${otherRole}Id`,
                    foreignField: "userId",
                    as: "participantUser",
                },
            },
            { $unwind: "$participantUser" },
            {
                $lookup: {
                    from: "directmessages",
                    let: { roomId: "$chatRoomId", userId: userId },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$chatRoomId", "$$roomId"] } } },
                        { $sort: { timestamp: -1 } },
                        { $limit: 1 },
                    ],
                    as: "lastMessage",
                },
            },
            {
                $lookup: {
                    from: "directmessages",
                    let: { roomId: "$chatRoomId", userId: userId },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$chatRoomId", "$$roomId"] },
                                        { $eq: ["$receiverId", "$$userId"] },
                                        { $eq: ["$status", "sent"] },
                                    ],
                                },
                            },
                        },
                    ],
                    as: "unreadMessages",
                },
            },
            {
                $project: {
                    _id: 0,
                    chatRoomId: 1,
                    user: {
                        userId: "$participantUser.userId",
                        name: {
                            $ifNull: [
                                "$participantUser.fullName",
                                "$participantUser.shopName",
                            ],
                        },
                        profileImageUrl: "$participantUser.avatar",
                        role: otherRole,
                    },
                    lastMessage: {
                        $cond: [
                            { $gt: [{ $size: "$lastMessage" }, 0] },
                            {
                                content: { $arrayElemAt: ["$lastMessage.content", 0] },
                                mediaUrl: { $arrayElemAt: ["$lastMessage.mediaUrl", 0] },
                                messageType: { $arrayElemAt: ["$lastMessage.messageType", 0] },
                                timestamp: { $arrayElemAt: ["$lastMessage.timestamp", 0] },
                                senderId: { $arrayElemAt: ["$lastMessage.senderId", 0] },
                            },
                            {
                                content: null,
                                mediaUrl: null,
                                messageType: "text",
                                timestamp: null,
                                senderId: null,
                            },
                        ],
                    },
                    unreadCount: { $size: "$unreadMessages" },
                },
            },
            { $sort: { "lastMessage.timestamp": -1 } },
        ]);
        return chats;
    }
};
ChatRoomRepository = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], ChatRoomRepository);
export { ChatRoomRepository };
