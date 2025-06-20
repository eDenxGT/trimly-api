"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryRegistry = void 0;
//* ====== Module Imports ====== *//
const tsyringe_1 = require("tsyringe");
const client_repository_1 = require("../../interfaceAdapters/repositories/users/client.repository");
const barber_repository_1 = require("../../interfaceAdapters/repositories/users/barber.repository");
const admin_repository_1 = require("../../interfaceAdapters/repositories/users/admin.repository");
const otp_repository_1 = require("../../interfaceAdapters/repositories/auth/otp.repository");
const refresh_token_repository_1 = require("../../interfaceAdapters/repositories/auth/refresh-token.repository");
const redis_token_repository_1 = require("../../interfaceAdapters/repositories/redis/redis-token.repository");
const service_repository_1 = require("../../interfaceAdapters/repositories/service/service.repository");
const booking_repository_1 = require("../../interfaceAdapters/repositories/booking/booking.repository");
const wallet_repository_1 = require("../../interfaceAdapters/repositories/finance/wallet.repository");
const transaction_repository_1 = require("../../interfaceAdapters/repositories/finance/transaction.repository");
const withdrawal_repository_1 = require("../../interfaceAdapters/repositories/finance/withdrawal.repository");
const review_repository_1 = require("../../interfaceAdapters/repositories/review/review.repository");
const post_repository_1 = require("../../interfaceAdapters/repositories/feed/post.repository");
const comment_repository_1 = require("../../interfaceAdapters/repositories/feed/comment.repository");
const chat_room_repository_1 = require("../../interfaceAdapters/repositories/chat/direct-chat/chat-room.repository");
const direct_message_repository_1 = require("../../interfaceAdapters/repositories/chat/direct-chat/direct-message.repository");
const community_repository_1 = require("../../interfaceAdapters/repositories/chat/community/community.repository");
const community_message_repository_1 = require("../../interfaceAdapters/repositories/chat/community/community-message.repository");
const meeting_room_repository_1 = require("../../interfaceAdapters/repositories/chat/meeting-room.repository");
const hairstyle_repository_1 = require("../../interfaceAdapters/repositories/hairstyle/hairstyle.repository");
const notification_repository_1 = require("../../interfaceAdapters/repositories/notification/notification.repository");
class RepositoryRegistry {
    static registerRepositories() {
        //* ====== Register Repositories ====== *//
        tsyringe_1.container.register("IClientRepository", {
            useClass: client_repository_1.ClientRepository,
        });
        tsyringe_1.container.register("IBarberRepository", {
            useClass: barber_repository_1.BarberRepository,
        });
        tsyringe_1.container.register("IAdminRepository", {
            useClass: admin_repository_1.AdminRepository,
        });
        tsyringe_1.container.register("IOtpRepository", {
            useClass: otp_repository_1.OtpRepository,
        });
        tsyringe_1.container.register("IRefreshTokenRepository", {
            useClass: refresh_token_repository_1.RefreshTokenRepository,
        });
        tsyringe_1.container.register("IRedisTokenRepository", {
            useClass: redis_token_repository_1.RedisTokenRepository,
        });
        tsyringe_1.container.register("IServiceRepository", {
            useClass: service_repository_1.ServiceRepository,
        });
        tsyringe_1.container.register("IBookingRepository", {
            useClass: booking_repository_1.BookingRepository,
        });
        tsyringe_1.container.register("IWalletRepository", {
            useClass: wallet_repository_1.WalletRepository,
        });
        tsyringe_1.container.register("ITransactionRepository", {
            useClass: transaction_repository_1.TransactionRepository,
        });
        tsyringe_1.container.register("IWithdrawalRepository", {
            useClass: withdrawal_repository_1.WithdrawalRepository,
        });
        tsyringe_1.container.register("IReviewRepository", {
            useClass: review_repository_1.ReviewRepository,
        });
        tsyringe_1.container.register("IPostRepository", {
            useClass: post_repository_1.PostRepository,
        });
        tsyringe_1.container.register("ICommentRepository", {
            useClass: comment_repository_1.CommentRepository,
        });
        tsyringe_1.container.register("IChatRoomRepository", {
            useClass: chat_room_repository_1.ChatRoomRepository,
        });
        tsyringe_1.container.register("IDirectMessageRepository", {
            useClass: direct_message_repository_1.DirectMessageRepository,
        });
        tsyringe_1.container.register("ICommunityRepository", {
            useClass: community_repository_1.CommunityRepository,
        });
        tsyringe_1.container.register("ICommunityMessageRepository", {
            useClass: community_message_repository_1.CommunityMessageRepository,
        });
        tsyringe_1.container.register("IMeetingRoomRepository", {
            useClass: meeting_room_repository_1.MeetingRoomRepository,
        });
        tsyringe_1.container.register("IHairstyleRepository", {
            useClass: hairstyle_repository_1.HairstyleRepository,
        });
        tsyringe_1.container.register("INotificationRepository", {
            useClass: notification_repository_1.NotificationRepository,
        });
    }
}
exports.RepositoryRegistry = RepositoryRegistry;
