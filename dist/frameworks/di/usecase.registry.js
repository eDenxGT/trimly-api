//* ====== Module Imports ====== *//
import { container } from "tsyringe";
import { PasswordBcrypt } from "../security/password.bcrypt.js";
import { UserExistenceService } from "../../interfaceAdapters/services/user-existence.service.js";
import { OtpService } from "../../interfaceAdapters/services/otp.service.js";
import { OtpBcrypt } from "../security/otp.bcrypt.js";
import { EmailService } from "../../interfaceAdapters/services/email.service.js";
import { JWTService } from "../../interfaceAdapters/services/jwt.service.js";
import { S3Service } from "../../interfaceAdapters/services/s3.service.js";
import { GoogleCalendarService } from "../../interfaceAdapters/services/google-calendar.service.js";
//* ====== Socket Handler Imports ====== *//
import { NotificationSocketHandler } from "../../interfaceAdapters/websockets/handlers/notification.handler.js";
import { RegisterUserUseCase } from "../../useCases/auth/register-user.usecase.js";
import { SendOtpEmailUseCase } from "../../useCases/auth/send-otp-email.usecase.js";
import { VerifyOtpUseCase } from "../../useCases/auth/verify-otp.usecase.js";
import { LoginUserUseCase } from "../../useCases/auth/login-user.usecase.js";
import { RefreshTokenUseCase } from "../../useCases/auth/refresh-token.usecase.js";
import { GenerateTokenUseCase } from "../../useCases/auth/generate-token.usecase.js";
import { RevokeRefreshTokenUseCase } from "../../useCases/auth/revoke-refresh-token.usecase.js";
import { BlackListTokenUseCase } from "../../useCases/auth/blacklist-token.usecase.js";
import { ForgotPasswordUseCase } from "../../useCases/auth/forgot-password.usecase.js";
import { ResetPasswordUseCase } from "../../useCases/auth/reset-password.usecase.js";
import { GoogleUseCase } from "../../useCases/auth/google.usecase.js";
import { SendEmailUseCase } from "../../useCases/common/send-email.usecase.js";
import { UpdateUserDetailsUseCase } from "../../useCases/users/update-user-details.usecase.js";
import { ChangeUserPasswordUseCase } from "../../useCases/users/change-user-password.usecase.js";
import { AddServiceUseCase } from "../../useCases/shop/service/add-service.usecase.js";
import { GetAllServicesUseCase } from "../../useCases/shop/service/get-all-services.usecase.js";
import { UpdateServiceUseCase } from "../../useCases/shop/service/update-service.usecase.js";
import { DeleteServiceUseCase } from "../../useCases/shop/service/delete-service.usecase.js";
import { GetAllShopsUseCase } from "../../useCases/shop/get-all-shops.usecase.js";
import { UpdateShopStatusUseCase } from "../../useCases/shop/update-shop-status.usecase.js";
import { GetAllUsersUseCase } from "../../useCases/users/get-all-users.usecase.js";
import { UpdateUserStatusUseCase } from "../../useCases/users/update-user-status.usecase.js";
import { GetUserDetailsUseCase } from "../../useCases/users/get-user-details.usecase.js";
import { GetAllNearestShopsUseCase } from "../../useCases/shop/get-all-nearest-shops.usecase.js";
import { GetShopDetailsByShopIdUseCase } from "../../useCases/shop/get-shop-details-by-shopid.usecase.js";
import { CreateBookingUseCase } from "../../useCases/booking/create-booking.usecase.js";
import { VerifyPaymentUseCase } from "../../useCases/booking/verify-payment.usecase.js";
import { HandleFailurePaymentUseCase } from "../../useCases/booking/handle-failure-payment.usecase.js";
import { GetAllBookingsByShopIdUseCase } from "../../useCases/booking/get-all-bookings-by-shopid.usecase.js";
import { GetAllBookingsByUserUseCase } from "../../useCases/booking/get-all-bookings-by-user.usecase.js";
import { CancelBookingUseCase } from "../../useCases/booking/cancel-booking.usecase.js";
import { GetWalletOverviewUseCase } from "../../useCases/finance/get-wallet-overview.usecase.js";
import { GetWalletByUserUseCase } from "../../useCases/finance/wallet/get-wallet-by-user.usecase.js";
import { GetTransactionByUserUseCase } from "../../useCases/finance/transaction/get-transaction-by-user.usecase.js";
import { GetWithdrawalByUserUseCase } from "../../useCases/finance/withdrawal/get-withdrawal-by-user-usecase.js";
import { TopUpWalletUseCase } from "../../useCases/finance/wallet/topup-wallet.usecase.js";
import { RazorpayService } from "../../interfaceAdapters/services/razorpay.service.js";
import { VerifyTopUpPaymentUseCase } from "../../useCases/finance/wallet/verify-topup-payment.usecase.js";
import { UpdateWalletBalanceUseCase } from "../../useCases/finance/wallet/update-wallet-balance.usecase.js";
import { WithdrawFromWalletUseCase } from "../../useCases/finance/withdrawal/withdraw-from-wallet.usecase.js";
import { HandleTopUpPaymentFailureUseCase } from "../../useCases/finance/wallet/handle-topup-failure-payment.usecase.js";
import { AddShopReviewUseCase } from "../../useCases/review/add-shop-review.usecase.js";
import { AddPostUseCase } from "../../useCases/feed/post/add-post.usecase.js";
import { GetAllPostsByBarberUseCase } from "../../useCases/feed/post/get-all-posts-by-barber.usecase.js";
import { GetSinglePostByPostIdUseCase } from "../../useCases/feed/post/get-single-post-by-postid.usecase.js";
import { UpdatePostUseCase } from "../../useCases/feed/post/update-post.usecase.js";
import { DeletePostUseCase } from "../../useCases/feed/post/delete-post.usecase.js";
import { UpdatePostStatusUseCase } from "../../useCases/feed/post/update-post-status.usecase.js";
import { ToggleLikePostUseCase } from "../../useCases/feed/post/toggle-like-post.usecase.js";
import { AddCommentUseCase } from "../../useCases/feed/comment/add-comment.usecase.js";
import { ToggleCommentLikeUseCase } from "../../useCases/feed/comment/toggle-comment-like.usecase.js";
import { GetAllPostsForClientUseCase } from "../../useCases/feed/post/get-all-posts-for-client.usecase.js";
import { CreateWalletUseCase } from "../../useCases/finance/wallet/create-wallet-usecase.js";
import { CompleteBookingUseCase } from "../../useCases/booking/complete-booking.usecase.js";
import { IncrementWalletBalanceUseCase } from "./../../useCases/finance/wallet/increment-wallet-balance.usecase.js";
import { DecrementWalletBalanceUseCase } from "../../useCases/finance/wallet/decrement-wallet-balance.usecase.js";
import { GetAllUserWithdrawalsUseCase } from "../../useCases/finance/withdrawal/get-all-user-withdrawals.usecase.js";
import { ApproveWithdrawalUseCase } from "../../useCases/finance/withdrawal/approve-withdrawal.usecase.js";
import { RejectWithdrawalUseCase } from "../../useCases/finance/withdrawal/reject-withdrawal.usecase.js";
import { BookWithWalletUseCase } from "../../useCases/booking/book-with-wallet.usecase.js";
import { GetChatByUserUseCase } from "../../useCases/chat/direct-chat/get-chat-by-user.usecase.js";
import { CreateChatRoomUseCase } from "../../useCases/chat/direct-chat/create-chat-room.usecase.js";
import { GetAllChatsByUserUseCase } from "../../useCases/chat/direct-chat/get-all-chats-by-user.usecase.js";
import { GetChatByChatIdUseCase } from "../../useCases/chat/direct-chat/get-chat-by-chatid.usecase.js";
import { SendDirectMessageUseCase } from "../../useCases/chat/direct-chat/send-direct-messsage.usecase.js";
import { CreateCommunityUseCase } from "../../useCases/chat/community/create-community.usecase.js";
import { GetAllCommunitiesForAdminUseCase } from "../../useCases/chat/community/get-all-communities-for-admin.usecase.js";
import { GetCommunityForEditUseCase } from "../../useCases/chat/community/get-community-for-edit.usecase.js";
import { EditCommunityUseCase } from "../../useCases/chat/community/edit-community.usecase.js";
import { UpdateCommunityStatusUseCase } from "../../useCases/chat/community/update-community-status.usecase.js";
import { DeleteCommunityUseCase } from "../../useCases/chat/community/delete-community.usecase.js";
import { GetAllCommunitiesForBarberUseCase } from "../../useCases/chat/community/get-all-communities-for-barber.usecase.js";
import { BarberJoinCommunityUseCase } from "../../useCases/chat/community/barber-join-community.usecase.js";
import { GetAllCommunityChatsByUserUseCase } from "../../useCases/chat/community/get-all-community-chats-by-user.usecase.js";
import { GetCommunityChatUseCase } from "../../useCases/chat/community/get-community-chat-by-user.usecase.js";
import { SendCommunityMessageUseCase } from "../../useCases/chat/community/send-community-message.usecase.js";
import { GetCommunityByCommunityIdUseCase } from "../../useCases/chat/community/get-community-by-communityid.usecase.js";
import { ReadDirectMessageUseCase } from "../../useCases/chat/direct-chat/read-direct-message.usecase.js";
import { GeneratePresignedUrlUseCase } from "../../useCases/s3/generate-presigned-url.usecase.js";
import { ScheduleMeetingUseCase } from "../../useCases/chat/meeting/schedule-meeting.usecase.js";
import { GetMeetingByCommunityIdUseCase } from "../../useCases/chat/meeting/get-meeting-by-communityid.usecase.js";
import { GetAllMeetingsForListingUseCase } from "../../useCases/chat/meeting/get-all-meetings-for-listing.usecase.js";
import { UpdateMeetingDetailsUseCase } from "../../useCases/chat/meeting/update-meeting-details.usecase.js";
import { CancelMeetingUseCase } from "../../useCases/chat/meeting/cancel-meeting.usecase.js";
import { CompleteMeetingUseCase } from "../../useCases/chat/meeting/complete-meeting.usecase.js";
import { GetNearest3ShopsForClientUseCase } from "../../useCases/shop/get-nearest-3-shops-for-client.usecase.js";
import { GetLastBookingByUserUseCase } from "../../useCases/booking/get-last-booking-by-user.usecase.js";
import { GetBarberDashboardDataUseCase } from "../../useCases/dashboard/get-barber-dashboard-data.usecase.js";
import { GetAdminDashboardDataUseCase } from "../../useCases/dashboard/get-admin-dashboard-data.usecase.js";
import { GetHairstylesByFaceShapeUseCase } from "../../useCases/hairstyle-detector/get-hairstyles-by-face-shape.usecase.js";
import { AddHairstyleUseCase } from "../../useCases/hairstyle-detector/add-hairstyle.usecase.js";
import { GetAllHairstylesUseCase } from "../../useCases/hairstyle-detector/get-all-hairstyles.usecase.js";
import { UpdateHairstyleUseCase } from "../../useCases/hairstyle-detector/update-hairstyle.usecase.js";
import { DeleteHairstyleUseCase } from "../../useCases/hairstyle-detector/delete-hairstyle.usecase.js";
import { GetPostLikedUsersUseCase } from "../../useCases/feed/post/get-post-liked-users.usecase.js";
import { GetNotificationsByUserUseCase } from "../../useCases/notification/get-notifications-by-user.usecase.js";
import { SendNotificationByUserUseCase } from "../../useCases/notification/send-notification-by-user.usecase.js";
import { SocketService } from "../../interfaceAdapters/services/socket.service.js";
import { MarkSingleNotificationAsReadByUserUseCase } from "../../useCases/notification/mark-single-notification-as-read-by-user.usecase.js";
import { MarkAllNotificationsAsReadByUserUseCase } from "../../useCases/notification/mark-all-notifications-as-read-by-user.usecase.js";
export class UseCaseRegistry {
    static registerUseCases() {
        //* ====== Register UseCases ====== *//
        container.register("IRegisterUserUseCase", {
            useClass: RegisterUserUseCase,
        });
        container.register("ISendOtpEmailUseCase", {
            useClass: SendOtpEmailUseCase,
        });
        container.register("IVerifyOtpUseCase", {
            useClass: VerifyOtpUseCase,
        });
        container.register("ILoginUserUseCase", {
            useClass: LoginUserUseCase,
        });
        container.register("IRefreshTokenUseCase", {
            useClass: RefreshTokenUseCase,
        });
        container.register("IGenerateTokenUseCase", {
            useClass: GenerateTokenUseCase,
        });
        container.register("IRevokeRefreshTokenUseCase", {
            useClass: RevokeRefreshTokenUseCase,
        });
        container.register("IBlackListTokenUseCase", {
            useClass: BlackListTokenUseCase,
        });
        container.register("IForgotPasswordUseCase", {
            useClass: ForgotPasswordUseCase,
        });
        container.register("IResetPasswordUseCase", {
            useClass: ResetPasswordUseCase,
        });
        container.register("IGoogleUseCase", {
            useClass: GoogleUseCase,
        });
        container.register("ISendEmailUseCase", {
            useClass: SendEmailUseCase,
        });
        container.register("IUpdateUserDetailsUseCase", {
            useClass: UpdateUserDetailsUseCase,
        });
        container.register("IChangeUserPasswordUseCase", {
            useClass: ChangeUserPasswordUseCase,
        });
        container.register("IAddServiceUseCase", {
            useClass: AddServiceUseCase,
        });
        container.register("IGetAllServicesUseCase", {
            useClass: GetAllServicesUseCase,
        });
        container.register("IUpdateServiceUseCase", {
            useClass: UpdateServiceUseCase,
        });
        container.register("IDeleteServiceUseCase", {
            useClass: DeleteServiceUseCase,
        });
        container.register("IGetAllShopsUseCase", {
            useClass: GetAllShopsUseCase,
        });
        container.register("IUpdateShopStatusUseCase", {
            useClass: UpdateShopStatusUseCase,
        });
        container.register("IGetAllUsersUseCase", {
            useClass: GetAllUsersUseCase,
        });
        container.register("IUpdateUserStatusUseCase", {
            useClass: UpdateUserStatusUseCase,
        });
        container.register("IGetUserDetailsUseCase", {
            useClass: GetUserDetailsUseCase,
        });
        container.register("IGetAllNearestShopsUseCase", {
            useClass: GetAllNearestShopsUseCase,
        });
        container.register("IGetShopDetailsByShopIdUseCase", {
            useClass: GetShopDetailsByShopIdUseCase,
        });
        container.register("IGetAllBookingsByShopIdUseCase", {
            useClass: GetAllBookingsByShopIdUseCase,
        });
        container.register("ICreateBookingUseCase", {
            useClass: CreateBookingUseCase,
        });
        container.register("IVerifyPaymentUseCase", {
            useClass: VerifyPaymentUseCase,
        });
        container.register("IHandleFailurePaymentUseCase", {
            useClass: HandleFailurePaymentUseCase,
        });
        container.register("IGetAllBookingsByUserUseCase", { useClass: GetAllBookingsByUserUseCase });
        container.register("ICancelBookingUseCase", {
            useClass: CancelBookingUseCase,
        });
        container.register("ICompleteBookingUseCase", {
            useClass: CompleteBookingUseCase,
        });
        container.register("IGetWalletOverviewUseCase", {
            useClass: GetWalletOverviewUseCase,
        });
        container.register("IGetWalletByUserUseCase", {
            useClass: GetWalletByUserUseCase,
        });
        container.register("IGetTransactionByUserUseCase", {
            useClass: GetTransactionByUserUseCase,
        });
        container.register("IGetWithdrawalByUserUseCase", {
            useClass: GetWithdrawalByUserUseCase,
        });
        container.register("ITopUpWalletUseCase", {
            useClass: TopUpWalletUseCase,
        });
        container.register("IVerifyTopUpPaymentUseCase", {
            useClass: VerifyTopUpPaymentUseCase,
        });
        container.register("IUpdateWalletBalanceUseCase", {
            useClass: UpdateWalletBalanceUseCase,
        });
        container.register("IWithdrawFromWalletUseCase", {
            useClass: WithdrawFromWalletUseCase,
        });
        container.register("IHandleTopUpPaymentFailureUseCase", {
            useClass: HandleTopUpPaymentFailureUseCase,
        });
        container.register("IAddShopReviewUseCase", {
            useClass: AddShopReviewUseCase,
        });
        container.register("IAddPostUseCase", {
            useClass: AddPostUseCase,
        });
        container.register("IGetAllPostsByBarberUseCase", {
            useClass: GetAllPostsByBarberUseCase,
        });
        container.register("IGetSinglePostByPostIdUseCase", {
            useClass: GetSinglePostByPostIdUseCase,
        });
        container.register("IUpdatePostUseCase", {
            useClass: UpdatePostUseCase,
        });
        container.register("IDeletePostUseCase", {
            useClass: DeletePostUseCase,
        });
        container.register("IUpdatePostStatusUseCase", {
            useClass: UpdatePostStatusUseCase,
        });
        container.register("IToggleLikePostUseCase", {
            useClass: ToggleLikePostUseCase,
        });
        container.register("IAddCommentUseCase", {
            useClass: AddCommentUseCase,
        });
        container.register("IToggleCommentLikeUseCase", {
            useClass: ToggleCommentLikeUseCase,
        });
        container.register("IGetAllPostsForClientUseCase", {
            useClass: GetAllPostsForClientUseCase,
        });
        container.register("ICreateWalletUseCase", {
            useClass: CreateWalletUseCase,
        });
        container.register("IIncrementWalletBalanceUseCase", {
            useClass: IncrementWalletBalanceUseCase,
        });
        container.register("IDecrementWalletBalanceUseCase", {
            useClass: DecrementWalletBalanceUseCase,
        });
        container.register("IGetAllUserWithdrawalsUseCase", {
            useClass: GetAllUserWithdrawalsUseCase,
        });
        container.register("IApproveWithdrawalUseCase", {
            useClass: ApproveWithdrawalUseCase,
        });
        container.register("IRejectWithdrawalUseCase", {
            useClass: RejectWithdrawalUseCase,
        });
        container.register("IBookWithWalletUseCase", {
            useClass: BookWithWalletUseCase,
        });
        container.register("IGetChatByUserUseCase", {
            useClass: GetChatByUserUseCase,
        });
        container.register("ICreateChatRoomUseCase", {
            useClass: CreateChatRoomUseCase,
        });
        container.register("IGetAllChatsByUserUseCase", {
            useClass: GetAllChatsByUserUseCase,
        });
        container.register("IGetChatByChatIdUseCase", {
            useClass: GetChatByChatIdUseCase,
        });
        container.register("ISendDirectMessageUseCase", {
            useClass: SendDirectMessageUseCase,
        });
        container.register("ICreateCommunityUseCase", {
            useClass: CreateCommunityUseCase,
        });
        container.register("IGetAllCommunitiesForAdminUseCase", {
            useClass: GetAllCommunitiesForAdminUseCase,
        });
        container.register("IGetCommunityForEditUseCase", {
            useClass: GetCommunityForEditUseCase,
        });
        container.register("IEditCommunityUseCase", {
            useClass: EditCommunityUseCase,
        });
        container.register("IUpdateCommunityStatusUseCase", {
            useClass: UpdateCommunityStatusUseCase,
        });
        container.register("IDeleteCommunityUseCase", {
            useClass: DeleteCommunityUseCase,
        });
        container.register("IGetAllCommunitiesForBarberUseCase", {
            useClass: GetAllCommunitiesForBarberUseCase,
        });
        container.register("IBarberJoinCommunityUseCase", {
            useClass: BarberJoinCommunityUseCase,
        });
        container.register("IGetAllCommunityChatsByUserUseCase", {
            useClass: GetAllCommunityChatsByUserUseCase,
        });
        container.register("IGetCommunityChatUseCase", {
            useClass: GetCommunityChatUseCase,
        });
        container.register("ISendCommunityMessageUseCase", {
            useClass: SendCommunityMessageUseCase,
        });
        container.register("IGetCommunityByCommunityIdUseCase", {
            useClass: GetCommunityByCommunityIdUseCase,
        });
        container.register("IReadDirectMessageUseCase", {
            useClass: ReadDirectMessageUseCase,
        });
        container.register("IGeneratePresignedUrlUseCase", {
            useClass: GeneratePresignedUrlUseCase,
        });
        container.register("IScheduleMeetingUseCase", {
            useClass: ScheduleMeetingUseCase,
        });
        container.register("IGetMeetingByCommunityIdUseCase", {
            useClass: GetMeetingByCommunityIdUseCase,
        });
        container.register("IGetAllMeetingsForListingUseCase", {
            useClass: GetAllMeetingsForListingUseCase,
        });
        container.register("IUpdateMeetingDetailsUseCase", {
            useClass: UpdateMeetingDetailsUseCase,
        });
        container.register("ICancelMeetingUseCase", {
            useClass: CancelMeetingUseCase,
        });
        container.register("ICompleteMeetingUseCase", {
            useClass: CompleteMeetingUseCase,
        });
        container.register("IGetNearest3ShopsForClientUseCase", {
            useClass: GetNearest3ShopsForClientUseCase,
        });
        container.register("IGetLastBookingByUserUseCase", {
            useClass: GetLastBookingByUserUseCase,
        });
        container.register("IGetBarberDashboardDataUseCase", {
            useClass: GetBarberDashboardDataUseCase,
        });
        container.register("IGetAdminDashboardDataUseCase", {
            useClass: GetAdminDashboardDataUseCase,
        });
        container.register("IGetHairstylesByFaceShapeUseCase", {
            useClass: GetHairstylesByFaceShapeUseCase,
        });
        container.register("IAddHairstyleUseCase", {
            useClass: AddHairstyleUseCase,
        });
        container.register("IGetAllHairstylesUseCase", {
            useClass: GetAllHairstylesUseCase,
        });
        container.register("IUpdateHairstyleUseCase", {
            useClass: UpdateHairstyleUseCase,
        });
        container.register("IDeleteHairstyleUseCase", {
            useClass: DeleteHairstyleUseCase,
        });
        container.register("IGetPostLikedUsersUseCase", {
            useClass: GetPostLikedUsersUseCase,
        });
        container.register("IGetNotificationsByUserUseCase", {
            useClass: GetNotificationsByUserUseCase,
        });
        container.register("ISendNotificationByUserUseCase", {
            useClass: SendNotificationByUserUseCase,
        });
        container.register("IMarkAllNotificationsAsReadByUserUseCase", {
            useClass: MarkAllNotificationsAsReadByUserUseCase,
        });
        container.register("IMarkSingleNotificationAsReadByUserUseCase", {
            useClass: MarkSingleNotificationAsReadByUserUseCase,
        });
        //* ====== Register Bcrypts ====== *//
        container.register("IPasswordBcrypt", {
            useClass: PasswordBcrypt,
        });
        container.register("IOtpBcrypt", {
            useClass: OtpBcrypt,
        });
        //* ====== Register Services ====== *//
        container.register("IUserExistenceService", {
            useClass: UserExistenceService,
        });
        container.register("IOtpService", {
            useClass: OtpService,
        });
        container.register("IEmailService", {
            useClass: EmailService,
        });
        container.register("ITokenService", {
            useClass: JWTService,
        });
        container.register("IRazorpayService", {
            useClass: RazorpayService,
        });
        container.register("IS3Service", {
            useClass: S3Service,
        });
        container.register("IGoogleCalendarService", {
            useClass: GoogleCalendarService,
        });
        container.register("ISocketService", {
            useClass: SocketService,
        });
        //* ====== Register Socket Handlers ====== *//
        container.register("INotificationSocketHandler", {
            useClass: NotificationSocketHandler,
        });
    }
}
