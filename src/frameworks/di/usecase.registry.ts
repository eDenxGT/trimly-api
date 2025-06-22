//* ====== Module Imports ====== *//
import { container } from "tsyringe";

//* ====== Bcrypt Imports ====== *//
import { IBcrypt } from "../security/bcrypt.interface";
import { PasswordBcrypt } from "../security/password.bcrypt";

//* ====== Service Imports ====== *//
import { IUserExistenceService } from "../../entities/serviceInterfaces/user-existence-service.interface";
import { UserExistenceService } from "../../interfaceAdapters/services/user-existence.service";
import { IOtpService } from "../../entities/serviceInterfaces/otp-service.interface";
import { OtpService } from "../../interfaceAdapters/services/otp.service";
import { OtpBcrypt } from "../security/otp.bcrypt";
import { IEmailService } from "../../entities/serviceInterfaces/email-service.interface";
import { EmailService } from "../../interfaceAdapters/services/email.service";
import { ITokenService } from "../../entities/serviceInterfaces/token-service.interface";
import { JWTService } from "../../interfaceAdapters/services/jwt.service";
import { S3Service } from "../../interfaceAdapters/services/s3.service";
import { IS3Service } from "../../entities/serviceInterfaces/s3-service.interface";
import { IGoogleCalendarService } from "../../entities/serviceInterfaces/google-calendar-service.interface";
import { GoogleCalendarService } from "../../interfaceAdapters/services/google-calendar.service";
import { SocketService } from "../../interfaceAdapters/services/socket.service";
import { ISocketService } from "../../entities/serviceInterfaces/socket-service.interface";

//* ====== Socket Handler Imports ====== *//
import { NotificationSocketHandler } from "../../interfaceAdapters/websockets/handlers/notification.handler";
import { INotificationSocketHandler } from "../../entities/socketHandlerInterfaces/notification-handler.interface";

//* ====== UseCase Imports ====== *//
import { IRegisterUserUseCase } from "../../entities/useCaseInterfaces/auth/register-usecase.interface";
import { RegisterUserUseCase } from "../../useCases/auth/register-user.usecase";
import { ISendOtpEmailUseCase } from "../../entities/useCaseInterfaces/auth/sent-otp-usecase.interface";
import { SendOtpEmailUseCase } from "../../useCases/auth/send-otp-email.usecase";
import { IVerifyOtpUseCase } from "../../entities/useCaseInterfaces/auth/verify-otp-usecase.interface";
import { VerifyOtpUseCase } from "../../useCases/auth/verify-otp.usecase";
import { ILoginUserUseCase } from "../../entities/useCaseInterfaces/auth/login-usecase.interface";
import { LoginUserUseCase } from "../../useCases/auth/login-user.usecase";
import { IRefreshTokenUseCase } from "../../entities/useCaseInterfaces/auth/refresh-token-usecase.interface";
import { RefreshTokenUseCase } from "../../useCases/auth/refresh-token.usecase";
import { IGenerateTokenUseCase } from "../../entities/useCaseInterfaces/auth/generate-token-usecase.interface";
import { GenerateTokenUseCase } from "../../useCases/auth/generate-token.usecase";
import { IRevokeRefreshTokenUseCase } from "../../entities/useCaseInterfaces/auth/revoke-refresh-token-usecase.interface";
import { RevokeRefreshTokenUseCase } from "../../useCases/auth/revoke-refresh-token.usecase";
import { IBlackListTokenUseCase } from "../../entities/useCaseInterfaces/auth/blacklist-token-usecase.interface";
import { BlackListTokenUseCase } from "../../useCases/auth/blacklist-token.usecase";
import { IForgotPasswordUseCase } from "../../entities/useCaseInterfaces/auth/forgot-password-usecase.interface";
import { ForgotPasswordUseCase } from "../../useCases/auth/forgot-password.usecase";
import { IResetPasswordUseCase } from "../../entities/useCaseInterfaces/auth/reset-password-usecase.interface";
import { ResetPasswordUseCase } from "../../useCases/auth/reset-password.usecase";
import { IGoogleUseCase } from "../../entities/useCaseInterfaces/auth/google-usecase";
import { GoogleUseCase } from "../../useCases/auth/google.usecase";
import { ISendEmailUseCase } from "../../entities/useCaseInterfaces/common/send-email-usecase.interface";
import { SendEmailUseCase } from "../../useCases/common/send-email.usecase";
import { IUpdateUserDetailsUseCase } from "../../entities/useCaseInterfaces/users/update-user-details-usecase.interface";
import { UpdateUserDetailsUseCase } from "../../useCases/users/update-user-details.usecase";
import { IChangeUserPasswordUseCase } from "../../entities/useCaseInterfaces/users/change-user-password-usecase.interface";
import { ChangeUserPasswordUseCase } from "../../useCases/users/change-user-password.usecase";
import { AddServiceUseCase } from "../../useCases/shop/service/add-service.usecase";
import { GetAllServicesUseCase } from "../../useCases/shop/service/get-all-services.usecase";
import { UpdateServiceUseCase } from "../../useCases/shop/service/update-service.usecase";
import { DeleteServiceUseCase } from "../../useCases/shop/service/delete-service.usecase";
import { IGetAllShopsUseCase } from "../../entities/useCaseInterfaces/shop/get-all-shops-usecase.interface";
import { GetAllShopsUseCase } from "../../useCases/shop/get-all-shops.usecase";
import { IAddServiceUseCase } from "../../entities/useCaseInterfaces/shop/service/add-service-usecase.interface";
import { IGetAllServicesUseCase } from "../../entities/useCaseInterfaces/shop/service/get-all-services-usecase.interface";
import { IUpdateServiceUseCase } from "../../entities/useCaseInterfaces/shop/service/update-service-usecase.interface";
import { IDeleteServiceUseCase } from "../../entities/useCaseInterfaces/shop/service/delete-service-usecase.interface";
import { IUpdateShopStatusUseCase } from "../../entities/useCaseInterfaces/shop/update-shop-status-usecase.interface";
import { UpdateShopStatusUseCase } from "../../useCases/shop/update-shop-status.usecase";
import { IGetAllUsersUseCase } from "../../entities/useCaseInterfaces/users/get-all-users-usecase.interface";
import { GetAllUsersUseCase } from "../../useCases/users/get-all-users.usecase";
import { IUpdateUserStatusUseCase } from "../../entities/useCaseInterfaces/users/update-user-status-usecase.interface";
import { UpdateUserStatusUseCase } from "../../useCases/users/update-user-status.usecase";
import { IGetUserDetailsUseCase } from "../../entities/useCaseInterfaces/users/get-user-details-usecase.interface";
import { GetUserDetailsUseCase } from "../../useCases/users/get-user-details.usecase";
import { IGetAllNearestShopsUseCase } from "../../entities/useCaseInterfaces/shop/get-all-nearest-shops-usecase.interface";
import { GetAllNearestShopsUseCase } from "../../useCases/shop/get-all-nearest-shops.usecase";
import { IGetShopDetailsByShopIdUseCase } from "../../entities/useCaseInterfaces/shop/get-shop-details-by-shopid-usecase.interface";
import { GetShopDetailsByShopIdUseCase } from "../../useCases/shop/get-shop-details-by-shopid.usecase";
import { ICreateBookingUseCase } from "../../entities/useCaseInterfaces/booking/create-booking-usecase.interface";
import { CreateBookingUseCase } from "../../useCases/booking/create-booking.usecase";
import { IVerifyPaymentUseCase } from "../../entities/useCaseInterfaces/booking/verify-payment-usecase.interface";
import { VerifyPaymentUseCase } from "../../useCases/booking/verify-payment.usecase";
import { IHandleFailurePaymentUseCase } from "../../entities/useCaseInterfaces/booking/handle-failure-payment-usecase.interface";
import { HandleFailurePaymentUseCase } from "../../useCases/booking/handle-failure-payment.usecase";
import { GetAllBookingsByShopIdUseCase } from "../../useCases/booking/get-all-bookings-by-shopid.usecase";
import { IGetAllBookingsByShopIdUseCase } from "../../entities/useCaseInterfaces/booking/get-all-bookings-by-shopid-usecase.interface";
import { IGetAllBookingsByUserUseCase } from "../../entities/useCaseInterfaces/booking/get-all-bookings-by-user-usecase.interface";
import { GetAllBookingsByUserUseCase } from "../../useCases/booking/get-all-bookings-by-user.usecase";
import { ICancelBookingUseCase } from "../../entities/useCaseInterfaces/booking/cancel-booking-usecase.interface";
import { CancelBookingUseCase } from "../../useCases/booking/cancel-booking.usecase";
import { IGetWalletOverviewUseCase } from "../../entities/useCaseInterfaces/finance/wallet/get-wallet-overview-usecase.interface";
import { GetWalletOverviewUseCase } from "../../useCases/finance/get-wallet-overview.usecase";
import { IGetWalletByUserUseCase } from "../../entities/useCaseInterfaces/finance/wallet/get-wallet-by-user-usecase.interface";
import { GetWalletByUserUseCase } from "../../useCases/finance/wallet/get-wallet-by-user.usecase";
import { GetTransactionByUserUseCase } from "../../useCases/finance/transaction/get-transaction-by-user.usecase";
import { IGetTransactionByUserUseCase } from "../../entities/useCaseInterfaces/finance/transaction/get-transaction-by-user-usecase.interface";
import { IGetWithdrawalByUserUseCase } from "../../entities/useCaseInterfaces/finance/withdrawal/get-withdrawal-by-user-usecase.interface";
import { GetWithdrawalByUserUseCase } from "../../useCases/finance/withdrawal/get-withdrawal-by-user-usecase";
import { TopUpWalletUseCase } from "../../useCases/finance/wallet/topup-wallet.usecase";
import { ITopUpWalletUseCase } from "../../entities/useCaseInterfaces/finance/wallet/topup-wallet-usecase.interface";
import { IRazorpayService } from "../../entities/serviceInterfaces/razorpay-service.interface";
import { RazorpayService } from "../../interfaceAdapters/services/razorpay.service";
import { IVerifyTopUpPaymentUseCase } from "../../entities/useCaseInterfaces/finance/wallet/verify-topup-payment-usecase.interface";
import { VerifyTopUpPaymentUseCase } from "../../useCases/finance/wallet/verify-topup-payment.usecase";
import { IUpdateWalletBalanceUseCase } from "../../entities/useCaseInterfaces/finance/wallet/update-wallet-balance-usecase.interface";
import { UpdateWalletBalanceUseCase } from "../../useCases/finance/wallet/update-wallet-balance.usecase";
import { WithdrawFromWalletUseCase } from "../../useCases/finance/withdrawal/withdraw-from-wallet.usecase";
import { IHandleTopUpPaymentFailureUseCase } from "../../entities/useCaseInterfaces/finance/wallet/handle-topup-failure-payment-usecase.interface";
import { HandleTopUpPaymentFailureUseCase } from "../../useCases/finance/wallet/handle-topup-failure-payment.usecase";
import { IAddShopReviewUseCase } from "../../entities/useCaseInterfaces/review/add-shop-review-usecase.interface";
import { AddShopReviewUseCase } from "../../useCases/review/add-shop-review.usecase";
import { IAddPostUseCase } from "../../entities/useCaseInterfaces/feed/post/add-post-usecase.interface";
import { AddPostUseCase } from "../../useCases/feed/post/add-post.usecase";
import { IGetAllPostsByBarberUseCase } from "../../entities/useCaseInterfaces/feed/post/get-all-posts-by-barber-usecase.interface";
import { GetAllPostsByBarberUseCase } from "../../useCases/feed/post/get-all-posts-by-barber.usecase";
import { GetSinglePostByPostIdUseCase } from "../../useCases/feed/post/get-single-post-by-postid.usecase";
import { IGetSinglePostByPostIdUseCase } from "../../entities/useCaseInterfaces/feed/post/get-single-post-by-postid-usecase.interface";
import { IUpdatePostUseCase } from "../../entities/useCaseInterfaces/feed/post/update-post-usecase.interface";
import { UpdatePostUseCase } from "../../useCases/feed/post/update-post.usecase";
import { IDeletePostUseCase } from "../../entities/useCaseInterfaces/feed/post/delete-post-usecase.interface";
import { DeletePostUseCase } from "../../useCases/feed/post/delete-post.usecase";
import { IUpdatePostStatusUseCase } from "../../entities/useCaseInterfaces/feed/post/update-post-status-usecase.interface";
import { UpdatePostStatusUseCase } from "../../useCases/feed/post/update-post-status.usecase";
import { IToggleLikePostUseCase } from "../../entities/useCaseInterfaces/feed/post/toggle-like-post-usecase.interface";
import { ToggleLikePostUseCase } from "../../useCases/feed/post/toggle-like-post.usecase";
import { IAddCommentUseCase } from "../../entities/useCaseInterfaces/feed/comment/add-comment-usecase.interface";
import { AddCommentUseCase } from "../../useCases/feed/comment/add-comment.usecase";
import { ToggleCommentLikeUseCase } from "../../useCases/feed/comment/toggle-comment-like.usecase";
import { IToggleCommentLikeUseCase } from "../../entities/useCaseInterfaces/feed/comment/toggle-comment-like-usecase.interface";
import { GetAllPostsForClientUseCase } from "../../useCases/feed/post/get-all-posts-for-client.usecase";
import { IGetAllPostsForClientUseCase } from "../../entities/useCaseInterfaces/feed/post/get-all-posts-for-client-usecase.interface";
import { ICreateWalletUseCase } from "../../entities/useCaseInterfaces/finance/wallet/create-wallet-usecase.interface";
import { CreateWalletUseCase } from "../../useCases/finance/wallet/create-wallet-usecase";
import { CompleteBookingUseCase } from "../../useCases/booking/complete-booking.usecase";
import { ICompleteBookingUseCase } from "../../entities/useCaseInterfaces/booking/complete-booking-usecase.interface";
import { IIncrementWalletBalanceUseCase } from "../../entities/useCaseInterfaces/finance/wallet/increment-wallet-balance-usecase.interface";
import { IncrementWalletBalanceUseCase } from "./../../useCases/finance/wallet/increment-wallet-balance.usecase";
import { IDecrementWalletBalanceUseCase } from "../../entities/useCaseInterfaces/finance/wallet/decrement-wallet-balance-usecase.interface";
import { DecrementWalletBalanceUseCase } from "../../useCases/finance/wallet/decrement-wallet-balance.usecase";
import { IWithdrawFromWalletUseCase } from "../../entities/useCaseInterfaces/finance/withdrawal/withdraw-from-wallet-usecase.interface";
import { IGetAllUserWithdrawalsUseCase } from "../../entities/useCaseInterfaces/finance/withdrawal/get-all-user-withdrawals-usecase.interface";
import { GetAllUserWithdrawalsUseCase } from "../../useCases/finance/withdrawal/get-all-user-withdrawals.usecase";
import { IApproveWithdrawalUseCase } from "../../entities/useCaseInterfaces/finance/withdrawal/approve-withdrawal-usecase.interface";
import { ApproveWithdrawalUseCase } from "../../useCases/finance/withdrawal/approve-withdrawal.usecase";
import { IRejectWithdrawalUseCase } from "../../entities/useCaseInterfaces/finance/withdrawal/reject-withdrawal-usecase.interface";
import { RejectWithdrawalUseCase } from "../../useCases/finance/withdrawal/reject-withdrawal.usecase";
import { IBookWithWalletUseCase } from "../../entities/useCaseInterfaces/booking/book-with-wallet-usecase.interface";
import { BookWithWalletUseCase } from "../../useCases/booking/book-with-wallet.usecase";
import { IGetChatByUserUseCase } from "../../entities/useCaseInterfaces/chat/direct-chat/get-chat-by-user-usecase.interface";
import { GetChatByUserUseCase } from "../../useCases/chat/direct-chat/get-chat-by-user.usecase";
import { CreateChatRoomUseCase } from "../../useCases/chat/direct-chat/create-chat-room.usecase";
import { ICreateChatRoomUseCase } from "../../entities/useCaseInterfaces/chat/direct-chat/create-chat-room-usecase.interface";
import { IGetAllChatsByUserUseCase } from "../../entities/useCaseInterfaces/chat/direct-chat/get-all-chats-by-user.usecase.interface";
import { GetAllChatsByUserUseCase } from "../../useCases/chat/direct-chat/get-all-chats-by-user.usecase";
import { GetChatByChatIdUseCase } from "../../useCases/chat/direct-chat/get-chat-by-chatid.usecase";
import { IGetChatByChatIdUseCase } from "../../entities/useCaseInterfaces/chat/direct-chat/get-chat-by-chatid.usecase";
import { SendDirectMessageUseCase } from "../../useCases/chat/direct-chat/send-direct-messsage.usecase";
import { ISendDirectMessageUseCase } from "../../entities/useCaseInterfaces/chat/direct-chat/send-direct-messsage-usecase.interface";
import { ICreateCommunityUseCase } from "../../entities/useCaseInterfaces/chat/community/create-community-usecase.interface";
import { CreateCommunityUseCase } from "../../useCases/chat/community/create-community.usecase";
import { IGetAllCommunitiesForAdminUseCase } from "../../entities/useCaseInterfaces/chat/community/get-all-communities-for-admin-usecase.interface";
import { GetAllCommunitiesForAdminUseCase } from "../../useCases/chat/community/get-all-communities-for-admin.usecase";
import { GetCommunityForEditUseCase } from "../../useCases/chat/community/get-community-for-edit.usecase";
import { IGetCommunityForEditUseCase } from "../../entities/useCaseInterfaces/chat/community/get-community-for-edit-usecase.interface";
import { IEditCommunityUseCase } from "../../entities/useCaseInterfaces/chat/community/edit-community-usecase.interface";
import { EditCommunityUseCase } from "../../useCases/chat/community/edit-community.usecase";
import { IUpdateCommunityStatusUseCase } from "../../entities/useCaseInterfaces/chat/community/update-community-status-usecase.interface";
import { UpdateCommunityStatusUseCase } from "../../useCases/chat/community/update-community-status.usecase";
import { IDeleteCommunityUseCase } from "../../entities/useCaseInterfaces/chat/community/delete-community-usecase.interface";
import { DeleteCommunityUseCase } from "../../useCases/chat/community/delete-community.usecase";
import { GetAllCommunitiesForBarberUseCase } from "../../useCases/chat/community/get-all-communities-for-barber.usecase";
import { IGetAllCommunitiesForBarberUseCase } from "../../entities/useCaseInterfaces/chat/community/get-all-communities-for-barber-usecase.interface";
import { IBarberJoinCommunityUseCase } from "../../entities/useCaseInterfaces/chat/community/barber-join-community-usecase.interface";
import { BarberJoinCommunityUseCase } from "../../useCases/chat/community/barber-join-community.usecase";
import { IGetAllCommunityChatsByUserUseCase } from "../../entities/useCaseInterfaces/chat/community/get-all-community-chats-by-user-usecase.interface";
import { GetAllCommunityChatsByUserUseCase } from "../../useCases/chat/community/get-all-community-chats-by-user.usecase";
import { IGetCommunityChatUseCase } from "../../entities/useCaseInterfaces/chat/community/get-community-chat-usecase.interface";
import { GetCommunityChatUseCase } from "../../useCases/chat/community/get-community-chat-by-user.usecase";
import { ISendCommunityMessageUseCase } from "../../entities/useCaseInterfaces/chat/community/send-community-message-usecase.interface";
import { SendCommunityMessageUseCase } from "../../useCases/chat/community/send-community-message.usecase";
import { IGetCommunityByCommunityIdUseCase } from "../../entities/useCaseInterfaces/chat/community/get-community-by-communityid-usecase.interface";
import { GetCommunityByCommunityIdUseCase } from "../../useCases/chat/community/get-community-by-communityid.usecase";
import { IReadDirectMessageUseCase } from "../../entities/useCaseInterfaces/chat/direct-chat/read-direct-message-usecase.interface";
import { ReadDirectMessageUseCase } from "../../useCases/chat/direct-chat/read-direct-message.usecase";
import { IGeneratePresignedUrlUseCase } from "../../entities/useCaseInterfaces/s3/generate-presigned-url-usecase.interface";
import { GeneratePresignedUrlUseCase } from "../../useCases/s3/generate-presigned-url.usecase";
import { IScheduleMeetingUseCase } from "../../entities/useCaseInterfaces/chat/meeting/schedule-meeting-usecase.interface";
import { ScheduleMeetingUseCase } from "../../useCases/chat/meeting/schedule-meeting.usecase";
import { IGetMeetingByCommunityIdUseCase } from "../../entities/useCaseInterfaces/chat/meeting/get-meeting-by-communityid-usecase.interface";
import { GetMeetingByCommunityIdUseCase } from "../../useCases/chat/meeting/get-meeting-by-communityid.usecase";
import { IGetAllMeetingsForListingUseCase } from "../../entities/useCaseInterfaces/chat/meeting/get-all-meetings-for-listing-usecase.interface";
import { GetAllMeetingsForListingUseCase } from "../../useCases/chat/meeting/get-all-meetings-for-listing.usecase";
import { UpdateMeetingDetailsUseCase } from "../../useCases/chat/meeting/update-meeting-details.usecase";
import { IUpdateMeetingDetailsUseCase } from "../../entities/useCaseInterfaces/chat/meeting/update-meeting-details-usecase.interface";
import { ICancelMeetingUseCase } from "../../entities/useCaseInterfaces/chat/meeting/cancel-meeting-usecase.interface";
import { CancelMeetingUseCase } from "../../useCases/chat/meeting/cancel-meeting.usecase";
import { CompleteMeetingUseCase } from "../../useCases/chat/meeting/complete-meeting.usecase";
import { ICompleteMeetingUseCase } from "../../entities/useCaseInterfaces/chat/meeting/complete-meeting-usecase.interface";
import { IGetNearest3ShopsForClientUseCase } from "../../entities/useCaseInterfaces/shop/get-nearest-3-shops-for-client-usecase.interface";
import { GetNearest3ShopsForClientUseCase } from "../../useCases/shop/get-nearest-3-shops-for-client.usecase";
import { IGetLastBookingByUserUseCase } from "../../entities/useCaseInterfaces/booking/get-last-booking-by-user-usecase.interface";
import { GetLastBookingByUserUseCase } from "../../useCases/booking/get-last-booking-by-user.usecase";
import { GetBarberDashboardDataUseCase } from "../../useCases/dashboard/get-barber-dashboard-data.usecase";
import { IGetBarberDashboardDataUseCase } from "../../entities/useCaseInterfaces/dashboard/get-barber-dashboard-data-usecase..interface";
import { GetAdminDashboardDataUseCase } from "../../useCases/dashboard/get-admin-dashboard-data.usecase";
import { IGetAdminDashboardDataUseCase } from "../../entities/useCaseInterfaces/dashboard/get-admin-dashboard-data-usecase.interface";
import { IGetHairstylesByFaceShapeUseCase } from "../../entities/useCaseInterfaces/hairstyle-detector/get-hairstyles-by-face-shape-usecase.interface";
import { GetHairstylesByFaceShapeUseCase } from "../../useCases/hairstyle-detector/get-hairstyles-by-face-shape.usecase";
import { AddHairstyleUseCase } from "../../useCases/hairstyle-detector/add-hairstyle.usecase";
import { IAddHairstyleUseCase } from "../../entities/useCaseInterfaces/hairstyle-detector/add-hairstyle-usecase.interface";
import { IGetAllHairstylesUseCase } from "../../entities/useCaseInterfaces/hairstyle-detector/get-all-hairstyles-usecase.interface";
import { GetAllHairstylesUseCase } from "../../useCases/hairstyle-detector/get-all-hairstyles.usecase";
import { IUpdateHairstyleUseCase } from "../../entities/useCaseInterfaces/hairstyle-detector/update-hairstyle-usecase.interface";
import { UpdateHairstyleUseCase } from "../../useCases/hairstyle-detector/update-hairstyle.usecase";
import { IDeleteHairstyleUseCase } from "../../entities/useCaseInterfaces/hairstyle-detector/delete-hairstyle-usecase.interface";
import { DeleteHairstyleUseCase } from "../../useCases/hairstyle-detector/delete-hairstyle.usecase";
import { GetPostLikedUsersUseCase } from "../../useCases/feed/post/get-post-liked-users.usecase";
import { IGetPostLikedUsersUseCase } from "../../entities/useCaseInterfaces/feed/post/get-post-liked-users-usecase.interface";
import { IGetNotificationsByUserUseCase } from "../../entities/useCaseInterfaces/notifications/get-notifications-by-user-usecase.interface";
import { GetNotificationsByUserUseCase } from "../../useCases/notification/get-notifications-by-user.usecase";
import { ISendNotificationByUserUseCase } from "../../entities/useCaseInterfaces/notifications/send-notification-by-user-usecase.interface";
import { SendNotificationByUserUseCase } from "../../useCases/notification/send-notification-by-user.usecase";
import { MarkSingleNotificationAsReadByUserUseCase } from "../../useCases/notification/mark-single-notification-as-read-by-user.usecase";
import { IMarkSingleNotificationAsReadByUserUseCase } from "../../entities/useCaseInterfaces/notifications/mark-single-notification-as-read-by-user-usecase.interface";
import { MarkAllNotificationsAsReadByUserUseCase } from "../../useCases/notification/mark-all-notifications-as-read-by-user.usecase";
import { IMarkAllNotificationsAsReadByUserUseCase } from "../../entities/useCaseInterfaces/notifications/mark-all-notifications-as-read-by-user-usecase.interface";
import { ICheckBookingEligibilityUseCase } from "../../entities/useCaseInterfaces/booking/checking-booking-eligibility-usecase.interface";
import { CheckBookingEligibilityUseCase } from "../../useCases/booking/checking-booking-eligibility.usecase";
import { IGetCommunityMembersUseCase } from "../../entities/useCaseInterfaces/chat/community/get-community-members-usecase.interface";
import { GetCommunityMembersUseCase } from "../../useCases/chat/community/get-community-members.usecase";
import { IRemoveCommunityMemberUseCase } from "../../entities/useCaseInterfaces/chat/community/remove-community-member-usecase.interface";
import { RemoveCommunityMemberUseCase } from "../../useCases/chat/community/remove-community-member.usecase";

export class UseCaseRegistry {
  static registerUseCases(): void {
    //* ====== Register UseCases ====== *//
    container.register<IRegisterUserUseCase>("IRegisterUserUseCase", {
      useClass: RegisterUserUseCase,
    });

    container.register<ISendOtpEmailUseCase>("ISendOtpEmailUseCase", {
      useClass: SendOtpEmailUseCase,
    });

    container.register<IVerifyOtpUseCase>("IVerifyOtpUseCase", {
      useClass: VerifyOtpUseCase,
    });

    container.register<ILoginUserUseCase>("ILoginUserUseCase", {
      useClass: LoginUserUseCase,
    });

    container.register<IRefreshTokenUseCase>("IRefreshTokenUseCase", {
      useClass: RefreshTokenUseCase,
    });

    container.register<IGenerateTokenUseCase>("IGenerateTokenUseCase", {
      useClass: GenerateTokenUseCase,
    });

    container.register<IRevokeRefreshTokenUseCase>(
      "IRevokeRefreshTokenUseCase",
      {
        useClass: RevokeRefreshTokenUseCase,
      }
    );

    container.register<IBlackListTokenUseCase>("IBlackListTokenUseCase", {
      useClass: BlackListTokenUseCase,
    });

    container.register<IForgotPasswordUseCase>("IForgotPasswordUseCase", {
      useClass: ForgotPasswordUseCase,
    });

    container.register<IResetPasswordUseCase>("IResetPasswordUseCase", {
      useClass: ResetPasswordUseCase,
    });

    container.register<IGoogleUseCase>("IGoogleUseCase", {
      useClass: GoogleUseCase,
    });

    container.register<ISendEmailUseCase>("ISendEmailUseCase", {
      useClass: SendEmailUseCase,
    });

    container.register<IUpdateUserDetailsUseCase>("IUpdateUserDetailsUseCase", {
      useClass: UpdateUserDetailsUseCase,
    });

    container.register<IChangeUserPasswordUseCase>(
      "IChangeUserPasswordUseCase",
      {
        useClass: ChangeUserPasswordUseCase,
      }
    );

    container.register<IAddServiceUseCase>("IAddServiceUseCase", {
      useClass: AddServiceUseCase,
    });

    container.register<IGetAllServicesUseCase>("IGetAllServicesUseCase", {
      useClass: GetAllServicesUseCase,
    });

    container.register<IUpdateServiceUseCase>("IUpdateServiceUseCase", {
      useClass: UpdateServiceUseCase,
    });

    container.register<IDeleteServiceUseCase>("IDeleteServiceUseCase", {
      useClass: DeleteServiceUseCase,
    });

    container.register<IGetAllShopsUseCase>("IGetAllShopsUseCase", {
      useClass: GetAllShopsUseCase,
    });

    container.register<IUpdateShopStatusUseCase>("IUpdateShopStatusUseCase", {
      useClass: UpdateShopStatusUseCase,
    });

    container.register<IGetAllUsersUseCase>("IGetAllUsersUseCase", {
      useClass: GetAllUsersUseCase,
    });

    container.register<IUpdateUserStatusUseCase>("IUpdateUserStatusUseCase", {
      useClass: UpdateUserStatusUseCase,
    });

    container.register<IGetUserDetailsUseCase>("IGetUserDetailsUseCase", {
      useClass: GetUserDetailsUseCase,
    });

    container.register<IGetAllNearestShopsUseCase>(
      "IGetAllNearestShopsUseCase",
      {
        useClass: GetAllNearestShopsUseCase,
      }
    );

    container.register<IGetShopDetailsByShopIdUseCase>(
      "IGetShopDetailsByShopIdUseCase",
      {
        useClass: GetShopDetailsByShopIdUseCase,
      }
    );

    container.register<IGetAllBookingsByShopIdUseCase>(
      "IGetAllBookingsByShopIdUseCase",
      {
        useClass: GetAllBookingsByShopIdUseCase,
      }
    );

    container.register<ICreateBookingUseCase>("ICreateBookingUseCase", {
      useClass: CreateBookingUseCase,
    });

    container.register<IVerifyPaymentUseCase>("IVerifyPaymentUseCase", {
      useClass: VerifyPaymentUseCase,
    });

    container.register<IHandleFailurePaymentUseCase>(
      "IHandleFailurePaymentUseCase",
      {
        useClass: HandleFailurePaymentUseCase,
      }
    );

    container.register<IGetAllBookingsByUserUseCase>(
      "IGetAllBookingsByUserUseCase",
      { useClass: GetAllBookingsByUserUseCase }
    );

    container.register<ICancelBookingUseCase>("ICancelBookingUseCase", {
      useClass: CancelBookingUseCase,
    });

    container.register<ICompleteBookingUseCase>("ICompleteBookingUseCase", {
      useClass: CompleteBookingUseCase,
    });

    container.register<IGetWalletOverviewUseCase>("IGetWalletOverviewUseCase", {
      useClass: GetWalletOverviewUseCase,
    });

    container.register<IGetWalletByUserUseCase>("IGetWalletByUserUseCase", {
      useClass: GetWalletByUserUseCase,
    });

    container.register<IGetTransactionByUserUseCase>(
      "IGetTransactionByUserUseCase",
      {
        useClass: GetTransactionByUserUseCase,
      }
    );

    container.register<IGetWithdrawalByUserUseCase>(
      "IGetWithdrawalByUserUseCase",
      {
        useClass: GetWithdrawalByUserUseCase,
      }
    );

    container.register<ITopUpWalletUseCase>("ITopUpWalletUseCase", {
      useClass: TopUpWalletUseCase,
    });

    container.register<IVerifyTopUpPaymentUseCase>(
      "IVerifyTopUpPaymentUseCase",
      {
        useClass: VerifyTopUpPaymentUseCase,
      }
    );

    container.register<IUpdateWalletBalanceUseCase>(
      "IUpdateWalletBalanceUseCase",
      {
        useClass: UpdateWalletBalanceUseCase,
      }
    );

    container.register<IWithdrawFromWalletUseCase>(
      "IWithdrawFromWalletUseCase",
      {
        useClass: WithdrawFromWalletUseCase,
      }
    );

    container.register<IHandleTopUpPaymentFailureUseCase>(
      "IHandleTopUpPaymentFailureUseCase",
      {
        useClass: HandleTopUpPaymentFailureUseCase,
      }
    );

    container.register<IAddShopReviewUseCase>("IAddShopReviewUseCase", {
      useClass: AddShopReviewUseCase,
    });

    container.register<IAddPostUseCase>("IAddPostUseCase", {
      useClass: AddPostUseCase,
    });

    container.register<IGetAllPostsByBarberUseCase>(
      "IGetAllPostsByBarberUseCase",
      {
        useClass: GetAllPostsByBarberUseCase,
      }
    );

    container.register<IGetSinglePostByPostIdUseCase>(
      "IGetSinglePostByPostIdUseCase",
      {
        useClass: GetSinglePostByPostIdUseCase,
      }
    );

    container.register<IUpdatePostUseCase>("IUpdatePostUseCase", {
      useClass: UpdatePostUseCase,
    });

    container.register<IDeletePostUseCase>("IDeletePostUseCase", {
      useClass: DeletePostUseCase,
    });

    container.register<IUpdatePostStatusUseCase>("IUpdatePostStatusUseCase", {
      useClass: UpdatePostStatusUseCase,
    });

    container.register<IToggleLikePostUseCase>("IToggleLikePostUseCase", {
      useClass: ToggleLikePostUseCase,
    });

    container.register<IAddCommentUseCase>("IAddCommentUseCase", {
      useClass: AddCommentUseCase,
    });

    container.register<IToggleCommentLikeUseCase>("IToggleCommentLikeUseCase", {
      useClass: ToggleCommentLikeUseCase,
    });

    container.register<IGetAllPostsForClientUseCase>(
      "IGetAllPostsForClientUseCase",
      {
        useClass: GetAllPostsForClientUseCase,
      }
    );

    container.register<ICreateWalletUseCase>("ICreateWalletUseCase", {
      useClass: CreateWalletUseCase,
    });

    container.register<IIncrementWalletBalanceUseCase>(
      "IIncrementWalletBalanceUseCase",
      {
        useClass: IncrementWalletBalanceUseCase,
      }
    );

    container.register<IDecrementWalletBalanceUseCase>(
      "IDecrementWalletBalanceUseCase",
      {
        useClass: DecrementWalletBalanceUseCase,
      }
    );

    container.register<IGetAllUserWithdrawalsUseCase>(
      "IGetAllUserWithdrawalsUseCase",
      {
        useClass: GetAllUserWithdrawalsUseCase,
      }
    );

    container.register<IApproveWithdrawalUseCase>("IApproveWithdrawalUseCase", {
      useClass: ApproveWithdrawalUseCase,
    });

    container.register<IRejectWithdrawalUseCase>("IRejectWithdrawalUseCase", {
      useClass: RejectWithdrawalUseCase,
    });

    container.register<IBookWithWalletUseCase>("IBookWithWalletUseCase", {
      useClass: BookWithWalletUseCase,
    });

    container.register<IGetChatByUserUseCase>("IGetChatByUserUseCase", {
      useClass: GetChatByUserUseCase,
    });

    container.register<ICreateChatRoomUseCase>("ICreateChatRoomUseCase", {
      useClass: CreateChatRoomUseCase,
    });

    container.register<IGetAllChatsByUserUseCase>("IGetAllChatsByUserUseCase", {
      useClass: GetAllChatsByUserUseCase,
    });

    container.register<IGetChatByChatIdUseCase>("IGetChatByChatIdUseCase", {
      useClass: GetChatByChatIdUseCase,
    });

    container.register<ISendDirectMessageUseCase>("ISendDirectMessageUseCase", {
      useClass: SendDirectMessageUseCase,
    });

    container.register<ICreateCommunityUseCase>("ICreateCommunityUseCase", {
      useClass: CreateCommunityUseCase,
    });

    container.register<IGetAllCommunitiesForAdminUseCase>(
      "IGetAllCommunitiesForAdminUseCase",
      {
        useClass: GetAllCommunitiesForAdminUseCase,
      }
    );

    container.register<IGetCommunityForEditUseCase>(
      "IGetCommunityForEditUseCase",
      {
        useClass: GetCommunityForEditUseCase,
      }
    );

    container.register<IEditCommunityUseCase>("IEditCommunityUseCase", {
      useClass: EditCommunityUseCase,
    });

    container.register<IUpdateCommunityStatusUseCase>(
      "IUpdateCommunityStatusUseCase",
      {
        useClass: UpdateCommunityStatusUseCase,
      }
    );

    container.register<IDeleteCommunityUseCase>("IDeleteCommunityUseCase", {
      useClass: DeleteCommunityUseCase,
    });

    container.register<IGetAllCommunitiesForBarberUseCase>(
      "IGetAllCommunitiesForBarberUseCase",
      {
        useClass: GetAllCommunitiesForBarberUseCase,
      }
    );

    container.register<IBarberJoinCommunityUseCase>(
      "IBarberJoinCommunityUseCase",
      {
        useClass: BarberJoinCommunityUseCase,
      }
    );

    container.register<IGetAllCommunityChatsByUserUseCase>(
      "IGetAllCommunityChatsByUserUseCase",
      {
        useClass: GetAllCommunityChatsByUserUseCase,
      }
    );

    container.register<IGetCommunityChatUseCase>("IGetCommunityChatUseCase", {
      useClass: GetCommunityChatUseCase,
    });

    container.register<ISendCommunityMessageUseCase>(
      "ISendCommunityMessageUseCase",
      {
        useClass: SendCommunityMessageUseCase,
      }
    );

    container.register<IGetCommunityByCommunityIdUseCase>(
      "IGetCommunityByCommunityIdUseCase",
      {
        useClass: GetCommunityByCommunityIdUseCase,
      }
    );

    container.register<IReadDirectMessageUseCase>("IReadDirectMessageUseCase", {
      useClass: ReadDirectMessageUseCase,
    });

    container.register<IGeneratePresignedUrlUseCase>(
      "IGeneratePresignedUrlUseCase",
      {
        useClass: GeneratePresignedUrlUseCase,
      }
    );

    container.register<IScheduleMeetingUseCase>("IScheduleMeetingUseCase", {
      useClass: ScheduleMeetingUseCase,
    });

    container.register<IGetMeetingByCommunityIdUseCase>(
      "IGetMeetingByCommunityIdUseCase",
      {
        useClass: GetMeetingByCommunityIdUseCase,
      }
    );

    container.register<IGetAllMeetingsForListingUseCase>(
      "IGetAllMeetingsForListingUseCase",
      {
        useClass: GetAllMeetingsForListingUseCase,
      }
    );

    container.register<IUpdateMeetingDetailsUseCase>(
      "IUpdateMeetingDetailsUseCase",
      {
        useClass: UpdateMeetingDetailsUseCase,
      }
    );

    container.register<ICancelMeetingUseCase>("ICancelMeetingUseCase", {
      useClass: CancelMeetingUseCase,
    });

    container.register<ICompleteMeetingUseCase>("ICompleteMeetingUseCase", {
      useClass: CompleteMeetingUseCase,
    });

    container.register<IGetNearest3ShopsForClientUseCase>(
      "IGetNearest3ShopsForClientUseCase",
      {
        useClass: GetNearest3ShopsForClientUseCase,
      }
    );

    container.register<IGetLastBookingByUserUseCase>(
      "IGetLastBookingByUserUseCase",
      {
        useClass: GetLastBookingByUserUseCase,
      }
    );

    container.register<IGetBarberDashboardDataUseCase>(
      "IGetBarberDashboardDataUseCase",
      {
        useClass: GetBarberDashboardDataUseCase,
      }
    );

    container.register<IGetAdminDashboardDataUseCase>(
      "IGetAdminDashboardDataUseCase",
      {
        useClass: GetAdminDashboardDataUseCase,
      }
    );

    container.register<IGetHairstylesByFaceShapeUseCase>(
      "IGetHairstylesByFaceShapeUseCase",
      {
        useClass: GetHairstylesByFaceShapeUseCase,
      }
    );

    container.register<IAddHairstyleUseCase>("IAddHairstyleUseCase", {
      useClass: AddHairstyleUseCase,
    });

    container.register<IGetAllHairstylesUseCase>("IGetAllHairstylesUseCase", {
      useClass: GetAllHairstylesUseCase,
    });

    container.register<IUpdateHairstyleUseCase>("IUpdateHairstyleUseCase", {
      useClass: UpdateHairstyleUseCase,
    });

    container.register<IDeleteHairstyleUseCase>("IDeleteHairstyleUseCase", {
      useClass: DeleteHairstyleUseCase,
    });

    container.register<IGetPostLikedUsersUseCase>("IGetPostLikedUsersUseCase", {
      useClass: GetPostLikedUsersUseCase,
    });

    container.register<IGetNotificationsByUserUseCase>(
      "IGetNotificationsByUserUseCase",
      {
        useClass: GetNotificationsByUserUseCase,
      }
    );

    container.register<ISendNotificationByUserUseCase>(
      "ISendNotificationByUserUseCase",
      {
        useClass: SendNotificationByUserUseCase,
      }
    );

    container.register<IMarkAllNotificationsAsReadByUserUseCase>(
      "IMarkAllNotificationsAsReadByUserUseCase",
      {
        useClass: MarkAllNotificationsAsReadByUserUseCase,
      }
    );

    container.register<IMarkSingleNotificationAsReadByUserUseCase>(
      "IMarkSingleNotificationAsReadByUserUseCase",
      {
        useClass: MarkSingleNotificationAsReadByUserUseCase,
      }
    );

    container.register<ICheckBookingEligibilityUseCase>(
      "ICheckBookingEligibilityUseCase",
      {
        useClass: CheckBookingEligibilityUseCase,
      }
    );

    container.register<IGetCommunityMembersUseCase>(
      "IGetCommunityMembersUseCase",
      {
        useClass: GetCommunityMembersUseCase,
      }
    );

    container.register<IRemoveCommunityMemberUseCase>(
      "IRemoveCommunityMemberUseCase",
      {
        useClass: RemoveCommunityMemberUseCase,
      }
    );

    //* ====== Register Bcrypts ====== *//
    container.register<IBcrypt>("IPasswordBcrypt", {
      useClass: PasswordBcrypt,
    });

    container.register<IBcrypt>("IOtpBcrypt", {
      useClass: OtpBcrypt,
    });

    //* ====== Register Services ====== *//
    container.register<IUserExistenceService>("IUserExistenceService", {
      useClass: UserExistenceService,
    });

    container.register<IOtpService>("IOtpService", {
      useClass: OtpService,
    });

    container.register<IEmailService>("IEmailService", {
      useClass: EmailService,
    });

    container.register<ITokenService>("ITokenService", {
      useClass: JWTService,
    });

    container.register<IRazorpayService>("IRazorpayService", {
      useClass: RazorpayService,
    });

    container.register<IS3Service>("IS3Service", {
      useClass: S3Service,
    });

    container.register<IGoogleCalendarService>("IGoogleCalendarService", {
      useClass: GoogleCalendarService,
    });

    container.register<ISocketService>("ISocketService", {
      useClass: SocketService,
    });

    //* ====== Register Socket Handlers ====== *//
    container.register<INotificationSocketHandler>(
      "INotificationSocketHandler",
      {
        useClass: NotificationSocketHandler,
      }
    );
  }
}
