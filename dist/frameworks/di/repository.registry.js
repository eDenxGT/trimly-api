//* ====== Module Imports ====== *//
import { container } from "tsyringe";
import { ClientRepository } from "../../interfaceAdapters/repositories/users/client.repository.js";
import { BarberRepository } from "../../interfaceAdapters/repositories/users/barber.repository.js";
import { AdminRepository } from "../../interfaceAdapters/repositories/users/admin.repository.js";
import { OtpRepository } from "../../interfaceAdapters/repositories/auth/otp.repository.js";
import { RefreshTokenRepository } from "../../interfaceAdapters/repositories/auth/refresh-token.repository.js";
import { RedisTokenRepository } from "../../interfaceAdapters/repositories/redis/redis-token.repository.js";
import { ServiceRepository } from "../../interfaceAdapters/repositories/service/service.repository.js";
import { BookingRepository } from "../../interfaceAdapters/repositories/booking/booking.repository.js";
import { WalletRepository } from "../../interfaceAdapters/repositories/finance/wallet.repository.js";
import { TransactionRepository } from "../../interfaceAdapters/repositories/finance/transaction.repository.js";
import { WithdrawalRepository } from "../../interfaceAdapters/repositories/finance/withdrawal.repository.js";
import { ReviewRepository } from "../../interfaceAdapters/repositories/review/review.repository.js";
import { PostRepository } from "../../interfaceAdapters/repositories/feed/post.repository.js";
import { CommentRepository } from "../../interfaceAdapters/repositories/feed/comment.repository.js";
import { ChatRoomRepository } from "../../interfaceAdapters/repositories/chat/direct-chat/chat-room.repository.js";
import { DirectMessageRepository } from "../../interfaceAdapters/repositories/chat/direct-chat/direct-message.repository.js";
import { CommunityRepository } from "../../interfaceAdapters/repositories/chat/community/community.repository.js";
import { CommunityMessageRepository } from "../../interfaceAdapters/repositories/chat/community/community-message.repository.js";
import { MeetingRoomRepository } from "../../interfaceAdapters/repositories/chat/meeting-room.repository.js";
import { HairstyleRepository } from "../../interfaceAdapters/repositories/hairstyle/hairstyle.repository.js";
import { NotificationRepository } from "../../interfaceAdapters/repositories/notification/notification.repository.js";
export class RepositoryRegistry {
    static registerRepositories() {
        //* ====== Register Repositories ====== *//
        container.register("IClientRepository", {
            useClass: ClientRepository,
        });
        container.register("IBarberRepository", {
            useClass: BarberRepository,
        });
        container.register("IAdminRepository", {
            useClass: AdminRepository,
        });
        container.register("IOtpRepository", {
            useClass: OtpRepository,
        });
        container.register("IRefreshTokenRepository", {
            useClass: RefreshTokenRepository,
        });
        container.register("IRedisTokenRepository", {
            useClass: RedisTokenRepository,
        });
        container.register("IServiceRepository", {
            useClass: ServiceRepository,
        });
        container.register("IBookingRepository", {
            useClass: BookingRepository,
        });
        container.register("IWalletRepository", {
            useClass: WalletRepository,
        });
        container.register("ITransactionRepository", {
            useClass: TransactionRepository,
        });
        container.register("IWithdrawalRepository", {
            useClass: WithdrawalRepository,
        });
        container.register("IReviewRepository", {
            useClass: ReviewRepository,
        });
        container.register("IPostRepository", {
            useClass: PostRepository,
        });
        container.register("ICommentRepository", {
            useClass: CommentRepository,
        });
        container.register("IChatRoomRepository", {
            useClass: ChatRoomRepository,
        });
        container.register("IDirectMessageRepository", {
            useClass: DirectMessageRepository,
        });
        container.register("ICommunityRepository", {
            useClass: CommunityRepository,
        });
        container.register("ICommunityMessageRepository", {
            useClass: CommunityMessageRepository,
        });
        container.register("IMeetingRoomRepository", {
            useClass: MeetingRoomRepository,
        });
        container.register("IHairstyleRepository", {
            useClass: HairstyleRepository,
        });
        container.register("INotificationRepository", {
            useClass: NotificationRepository,
        });
    }
}
