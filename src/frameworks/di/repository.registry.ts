//* ====== Module Imports ====== *//
import { container } from "tsyringe";

//* ====== Repository Imports ====== *//
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface";
import { ClientRepository } from "../../interfaceAdapters/repositories/users/client.repository";
import { BarberRepository } from "../../interfaceAdapters/repositories/users/barber.repository";
import { IBarberRepository } from "../../entities/repositoryInterfaces/users/barber-repository.interface";
import { AdminRepository } from "../../interfaceAdapters/repositories/users/admin.repository";
import { IAdminRepository } from "../../entities/repositoryInterfaces/users/admin-repository.interface";
import { IOtpRepository } from "../../entities/repositoryInterfaces/auth/otp-repository.interface";
import { OtpRepository } from "../../interfaceAdapters/repositories/auth/otp.repository";
import { IRefreshTokenRepository } from "../../entities/repositoryInterfaces/auth/refresh-token-repository.interface";
import { RefreshTokenRepository } from "../../interfaceAdapters/repositories/auth/refresh-token.repository";
import { IRedisTokenRepository } from "../../entities/repositoryInterfaces/redis/redis-token-repository.interface";
import { RedisTokenRepository } from "../../interfaceAdapters/repositories/redis/redis-token.repository";
import { IServiceRepository } from "../../entities/repositoryInterfaces/service/service-repository.interface";
import { ServiceRepository } from "../../interfaceAdapters/repositories/service/service.repository";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { BookingRepository } from "../../interfaceAdapters/repositories/booking/booking.repository";
import { IWalletRepository } from "../../entities/repositoryInterfaces/finance/wallet-repository.interface";
import { WalletRepository } from "../../interfaceAdapters/repositories/finance/wallet.repository";
import { ITransactionRepository } from "../../entities/repositoryInterfaces/finance/transaction-repository.interface";
import { TransactionRepository } from "../../interfaceAdapters/repositories/finance/transaction.repository";
import { IWithdrawalRepository } from "../../entities/repositoryInterfaces/finance/withdrawal-repository.interface";
import { WithdrawalRepository } from "../../interfaceAdapters/repositories/finance/withdrawal.repository";
import { IReviewRepository } from "../../entities/repositoryInterfaces/review/review-repository.interface";
import { ReviewRepository } from "../../interfaceAdapters/repositories/review/review.repository";
import { IPostRepository } from "../../entities/repositoryInterfaces/feed/post-repository.interface";
import { PostRepository } from "../../interfaceAdapters/repositories/feed/post.repository";
import { ICommentRepository } from "../../entities/repositoryInterfaces/feed/comment-repository.interface";
import { CommentRepository } from "../../interfaceAdapters/repositories/feed/comment.repository";
import { IChatRoomRepository } from "../../entities/repositoryInterfaces/chat/direct-chat/chat-room-repository.interface";
import { ChatRoomRepository } from "../../interfaceAdapters/repositories/chat/direct-chat/chat-room.repository";
import { IDirectMessageRepository } from "../../entities/repositoryInterfaces/chat/direct-chat/direct-message.repository";
import { DirectMessageRepository } from "../../interfaceAdapters/repositories/chat/direct-chat/direct-message.repository";
import { ICommunityRepository } from "../../entities/repositoryInterfaces/chat/community/community-respository.interface";
import { CommunityRepository } from "../../interfaceAdapters/repositories/chat/community/community.repository";
import { ICommunityMessageRepository } from "../../entities/repositoryInterfaces/chat/community/community-message-respository.interface";
import { CommunityMessageRepository } from "../../interfaceAdapters/repositories/chat/community/community-message.repository";
import { IMeetingRoomRepository } from "../../entities/repositoryInterfaces/chat/meeting-room-repository.interface";
import { MeetingRoomRepository } from "../../interfaceAdapters/repositories/chat/meeting-room.repository";
import { IHairstyleRepository } from "../../entities/repositoryInterfaces/hairstyle/hairstyle-repository.interface";
import { HairstyleRepository } from "../../interfaceAdapters/repositories/hairstyle/hairstyle.repository";
import { NotificationRepository } from "../../interfaceAdapters/repositories/notification/notification.repository";
import { INotificationRepository } from "../../entities/repositoryInterfaces/notification/notification-repository.interface";

export class RepositoryRegistry {
  static registerRepositories(): void {
    //* ====== Register Repositories ====== *//
    container.register<IClientRepository>("IClientRepository", {
      useClass: ClientRepository,
    });

    container.register<IBarberRepository>("IBarberRepository", {
      useClass: BarberRepository,
    });

    container.register<IAdminRepository>("IAdminRepository", {
      useClass: AdminRepository,
    });

    container.register<IOtpRepository>("IOtpRepository", {
      useClass: OtpRepository,
    });

    container.register<IRefreshTokenRepository>("IRefreshTokenRepository", {
      useClass: RefreshTokenRepository,
    });

    container.register<IRedisTokenRepository>("IRedisTokenRepository", {
      useClass: RedisTokenRepository,
    });

    container.register<IServiceRepository>("IServiceRepository", {
      useClass: ServiceRepository,
    });

    container.register<IBookingRepository>("IBookingRepository", {
      useClass: BookingRepository,
    });

    container.register<IWalletRepository>("IWalletRepository", {
      useClass: WalletRepository,
    });

    container.register<ITransactionRepository>("ITransactionRepository", {
      useClass: TransactionRepository,
    });

    container.register<IWithdrawalRepository>("IWithdrawalRepository", {
      useClass: WithdrawalRepository,
    });

    container.register<IReviewRepository>("IReviewRepository", {
      useClass: ReviewRepository,
    });

    container.register<IPostRepository>("IPostRepository", {
      useClass: PostRepository,
    });

    container.register<ICommentRepository>("ICommentRepository", {
      useClass: CommentRepository,
    });

    container.register<IChatRoomRepository>("IChatRoomRepository", {
      useClass: ChatRoomRepository,
    });

    container.register<IDirectMessageRepository>("IDirectMessageRepository", {
      useClass: DirectMessageRepository,
    });

    container.register<ICommunityRepository>("ICommunityRepository", {
      useClass: CommunityRepository,
    });

    container.register<ICommunityMessageRepository>(
      "ICommunityMessageRepository",
      {
        useClass: CommunityMessageRepository,
      }
    );

    container.register<IMeetingRoomRepository>("IMeetingRoomRepository", {
      useClass: MeetingRoomRepository,
    });

    container.register<IHairstyleRepository>("IHairstyleRepository", {
      useClass: HairstyleRepository,
    });

    container.register<INotificationRepository>("INotificationRepository", {
      useClass: NotificationRepository,
    });
  }
}
