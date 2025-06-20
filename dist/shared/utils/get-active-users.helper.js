"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveUsersCount = getActiveUsersCount;
exports.getOnlineSocketIdsForMembers = getOnlineSocketIdsForMembers;
const socket_user_store_1 = require("../../interfaceAdapters/websockets/socket-user.store");
function getActiveUsersCount(members) {
    const socketUserStore = socket_user_store_1.SocketUserStore.getInstance();
    const activeUsers = socketUserStore.getAllUsers().map(([userId]) => userId);
    const activeCount = members.filter((member) => activeUsers.includes(member.userId)).length;
    return activeCount;
}
function getOnlineSocketIdsForMembers(memberUserIds) {
    const socketUserStore = socket_user_store_1.SocketUserStore.getInstance();
    const allConnectedUsers = socketUserStore.getAllUsers();
    const onlineSocketIds = [];
    for (const [userId, socketId] of allConnectedUsers) {
        if (memberUserIds.includes(userId)) {
            onlineSocketIds.push(socketId);
        }
    }
    return onlineSocketIds;
}
