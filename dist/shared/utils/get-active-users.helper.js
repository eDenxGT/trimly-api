import { SocketUserStore } from "../../interfaceAdapters/websockets/socket-user.store.js";
export function getActiveUsersCount(members) {
    const socketUserStore = SocketUserStore.getInstance();
    const activeUsers = socketUserStore.getAllUsers().map(([userId]) => userId);
    const activeCount = members.filter((member) => activeUsers.includes(member.userId)).length;
    return activeCount;
}
export function getOnlineSocketIdsForMembers(memberUserIds) {
    const socketUserStore = SocketUserStore.getInstance();
    const allConnectedUsers = socketUserStore.getAllUsers();
    const onlineSocketIds = [];
    for (const [userId, socketId] of allConnectedUsers) {
        if (memberUserIds.includes(userId)) {
            onlineSocketIds.push(socketId);
        }
    }
    return onlineSocketIds;
}
