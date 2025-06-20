"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseCaseRegistry = void 0;
//* ====== Module Imports ====== *//
const tsyringe_1 = require("tsyringe");
const password_bcrypt_1 = require("../security/password.bcrypt");
const user_existence_service_1 = require("../../interfaceAdapters/services/user-existence.service");
const otp_service_1 = require("../../interfaceAdapters/services/otp.service");
const otp_bcrypt_1 = require("../security/otp.bcrypt");
const email_service_1 = require("../../interfaceAdapters/services/email.service");
const jwt_service_1 = require("../../interfaceAdapters/services/jwt.service");
const s3_service_1 = require("../../interfaceAdapters/services/s3.service");
const google_calendar_service_1 = require("../../interfaceAdapters/services/google-calendar.service");
//* ====== Socket Handler Imports ====== *//
const notification_handler_1 = require("../../interfaceAdapters/websockets/handlers/notification.handler");
const register_user_usecase_1 = require("../../useCases/auth/register-user.usecase");
const send_otp_email_usecase_1 = require("../../useCases/auth/send-otp-email.usecase");
const verify_otp_usecase_1 = require("../../useCases/auth/verify-otp.usecase");
const login_user_usecase_1 = require("../../useCases/auth/login-user.usecase");
const refresh_token_usecase_1 = require("../../useCases/auth/refresh-token.usecase");
const generate_token_usecase_1 = require("../../useCases/auth/generate-token.usecase");
const revoke_refresh_token_usecase_1 = require("../../useCases/auth/revoke-refresh-token.usecase");
const blacklist_token_usecase_1 = require("../../useCases/auth/blacklist-token.usecase");
const forgot_password_usecase_1 = require("../../useCases/auth/forgot-password.usecase");
const reset_password_usecase_1 = require("../../useCases/auth/reset-password.usecase");
const google_usecase_1 = require("../../useCases/auth/google.usecase");
const send_email_usecase_1 = require("../../useCases/common/send-email.usecase");
const update_user_details_usecase_1 = require("../../useCases/users/update-user-details.usecase");
const change_user_password_usecase_1 = require("../../useCases/users/change-user-password.usecase");
const add_service_usecase_1 = require("../../useCases/shop/service/add-service.usecase");
const get_all_services_usecase_1 = require("../../useCases/shop/service/get-all-services.usecase");
const update_service_usecase_1 = require("../../useCases/shop/service/update-service.usecase");
const delete_service_usecase_1 = require("../../useCases/shop/service/delete-service.usecase");
const get_all_shops_usecase_1 = require("../../useCases/shop/get-all-shops.usecase");
const update_shop_status_usecase_1 = require("../../useCases/shop/update-shop-status.usecase");
const get_all_users_usecase_1 = require("../../useCases/users/get-all-users.usecase");
const update_user_status_usecase_1 = require("../../useCases/users/update-user-status.usecase");
const get_user_details_usecase_1 = require("../../useCases/users/get-user-details.usecase");
const get_all_nearest_shops_usecase_1 = require("../../useCases/shop/get-all-nearest-shops.usecase");
const get_shop_details_by_shopid_usecase_1 = require("../../useCases/shop/get-shop-details-by-shopid.usecase");
const create_booking_usecase_1 = require("../../useCases/booking/create-booking.usecase");
const verify_payment_usecase_1 = require("../../useCases/booking/verify-payment.usecase");
const handle_failure_payment_usecase_1 = require("../../useCases/booking/handle-failure-payment.usecase");
const get_all_bookings_by_shopid_usecase_1 = require("../../useCases/booking/get-all-bookings-by-shopid.usecase");
const get_all_bookings_by_user_usecase_1 = require("../../useCases/booking/get-all-bookings-by-user.usecase");
const cancel_booking_usecase_1 = require("../../useCases/booking/cancel-booking.usecase");
const get_wallet_overview_usecase_1 = require("../../useCases/finance/get-wallet-overview.usecase");
const get_wallet_by_user_usecase_1 = require("../../useCases/finance/wallet/get-wallet-by-user.usecase");
const get_transaction_by_user_usecase_1 = require("../../useCases/finance/transaction/get-transaction-by-user.usecase");
const get_withdrawal_by_user_usecase_1 = require("../../useCases/finance/withdrawal/get-withdrawal-by-user-usecase");
const topup_wallet_usecase_1 = require("../../useCases/finance/wallet/topup-wallet.usecase");
const razorpay_service_1 = require("../../interfaceAdapters/services/razorpay.service");
const verify_topup_payment_usecase_1 = require("../../useCases/finance/wallet/verify-topup-payment.usecase");
const update_wallet_balance_usecase_1 = require("../../useCases/finance/wallet/update-wallet-balance.usecase");
const withdraw_from_wallet_usecase_1 = require("../../useCases/finance/withdrawal/withdraw-from-wallet.usecase");
const handle_topup_failure_payment_usecase_1 = require("../../useCases/finance/wallet/handle-topup-failure-payment.usecase");
const add_shop_review_usecase_1 = require("../../useCases/review/add-shop-review.usecase");
const add_post_usecase_1 = require("../../useCases/feed/post/add-post.usecase");
const get_all_posts_by_barber_usecase_1 = require("../../useCases/feed/post/get-all-posts-by-barber.usecase");
const get_single_post_by_postid_usecase_1 = require("../../useCases/feed/post/get-single-post-by-postid.usecase");
const update_post_usecase_1 = require("../../useCases/feed/post/update-post.usecase");
const delete_post_usecase_1 = require("../../useCases/feed/post/delete-post.usecase");
const update_post_status_usecase_1 = require("../../useCases/feed/post/update-post-status.usecase");
const toggle_like_post_usecase_1 = require("../../useCases/feed/post/toggle-like-post.usecase");
const add_comment_usecase_1 = require("../../useCases/feed/comment/add-comment.usecase");
const toggle_comment_like_usecase_1 = require("../../useCases/feed/comment/toggle-comment-like.usecase");
const get_all_posts_for_client_usecase_1 = require("../../useCases/feed/post/get-all-posts-for-client.usecase");
const create_wallet_usecase_1 = require("../../useCases/finance/wallet/create-wallet-usecase");
const complete_booking_usecase_1 = require("../../useCases/booking/complete-booking.usecase");
const increment_wallet_balance_usecase_1 = require("./../../useCases/finance/wallet/increment-wallet-balance.usecase");
const decrement_wallet_balance_usecase_1 = require("../../useCases/finance/wallet/decrement-wallet-balance.usecase");
const get_all_user_withdrawals_usecase_1 = require("../../useCases/finance/withdrawal/get-all-user-withdrawals.usecase");
const approve_withdrawal_usecase_1 = require("../../useCases/finance/withdrawal/approve-withdrawal.usecase");
const reject_withdrawal_usecase_1 = require("../../useCases/finance/withdrawal/reject-withdrawal.usecase");
const book_with_wallet_usecase_1 = require("../../useCases/booking/book-with-wallet.usecase");
const get_chat_by_user_usecase_1 = require("../../useCases/chat/direct-chat/get-chat-by-user.usecase");
const create_chat_room_usecase_1 = require("../../useCases/chat/direct-chat/create-chat-room.usecase");
const get_all_chats_by_user_usecase_1 = require("../../useCases/chat/direct-chat/get-all-chats-by-user.usecase");
const get_chat_by_chatid_usecase_1 = require("../../useCases/chat/direct-chat/get-chat-by-chatid.usecase");
const send_direct_messsage_usecase_1 = require("../../useCases/chat/direct-chat/send-direct-messsage.usecase");
const create_community_usecase_1 = require("../../useCases/chat/community/create-community.usecase");
const get_all_communities_for_admin_usecase_1 = require("../../useCases/chat/community/get-all-communities-for-admin.usecase");
const get_community_for_edit_usecase_1 = require("../../useCases/chat/community/get-community-for-edit.usecase");
const edit_community_usecase_1 = require("../../useCases/chat/community/edit-community.usecase");
const update_community_status_usecase_1 = require("../../useCases/chat/community/update-community-status.usecase");
const delete_community_usecase_1 = require("../../useCases/chat/community/delete-community.usecase");
const get_all_communities_for_barber_usecase_1 = require("../../useCases/chat/community/get-all-communities-for-barber.usecase");
const barber_join_community_usecase_1 = require("../../useCases/chat/community/barber-join-community.usecase");
const get_all_community_chats_by_user_usecase_1 = require("../../useCases/chat/community/get-all-community-chats-by-user.usecase");
const get_community_chat_by_user_usecase_1 = require("../../useCases/chat/community/get-community-chat-by-user.usecase");
const send_community_message_usecase_1 = require("../../useCases/chat/community/send-community-message.usecase");
const get_community_by_communityid_usecase_1 = require("../../useCases/chat/community/get-community-by-communityid.usecase");
const read_direct_message_usecase_1 = require("../../useCases/chat/direct-chat/read-direct-message.usecase");
const generate_presigned_url_usecase_1 = require("../../useCases/s3/generate-presigned-url.usecase");
const schedule_meeting_usecase_1 = require("../../useCases/chat/meeting/schedule-meeting.usecase");
const get_meeting_by_communityid_usecase_1 = require("../../useCases/chat/meeting/get-meeting-by-communityid.usecase");
const get_all_meetings_for_listing_usecase_1 = require("../../useCases/chat/meeting/get-all-meetings-for-listing.usecase");
const update_meeting_details_usecase_1 = require("../../useCases/chat/meeting/update-meeting-details.usecase");
const cancel_meeting_usecase_1 = require("../../useCases/chat/meeting/cancel-meeting.usecase");
const complete_meeting_usecase_1 = require("../../useCases/chat/meeting/complete-meeting.usecase");
const get_nearest_3_shops_for_client_usecase_1 = require("../../useCases/shop/get-nearest-3-shops-for-client.usecase");
const get_last_booking_by_user_usecase_1 = require("../../useCases/booking/get-last-booking-by-user.usecase");
const get_barber_dashboard_data_usecase_1 = require("../../useCases/dashboard/get-barber-dashboard-data.usecase");
const get_admin_dashboard_data_usecase_1 = require("../../useCases/dashboard/get-admin-dashboard-data.usecase");
const get_hairstyles_by_face_shape_usecase_1 = require("../../useCases/hairstyle-detector/get-hairstyles-by-face-shape.usecase");
const add_hairstyle_usecase_1 = require("../../useCases/hairstyle-detector/add-hairstyle.usecase");
const get_all_hairstyles_usecase_1 = require("../../useCases/hairstyle-detector/get-all-hairstyles.usecase");
const update_hairstyle_usecase_1 = require("../../useCases/hairstyle-detector/update-hairstyle.usecase");
const delete_hairstyle_usecase_1 = require("../../useCases/hairstyle-detector/delete-hairstyle.usecase");
const get_post_liked_users_usecase_1 = require("../../useCases/feed/post/get-post-liked-users.usecase");
const get_notifications_by_user_usecase_1 = require("../../useCases/notification/get-notifications-by-user.usecase");
const send_notification_by_user_usecase_1 = require("../../useCases/notification/send-notification-by-user.usecase");
const socket_service_1 = require("../../interfaceAdapters/services/socket.service");
const mark_single_notification_as_read_by_user_usecase_1 = require("../../useCases/notification/mark-single-notification-as-read-by-user.usecase");
const mark_all_notifications_as_read_by_user_usecase_1 = require("../../useCases/notification/mark-all-notifications-as-read-by-user.usecase");
class UseCaseRegistry {
    static registerUseCases() {
        //* ====== Register UseCases ====== *//
        tsyringe_1.container.register("IRegisterUserUseCase", {
            useClass: register_user_usecase_1.RegisterUserUseCase,
        });
        tsyringe_1.container.register("ISendOtpEmailUseCase", {
            useClass: send_otp_email_usecase_1.SendOtpEmailUseCase,
        });
        tsyringe_1.container.register("IVerifyOtpUseCase", {
            useClass: verify_otp_usecase_1.VerifyOtpUseCase,
        });
        tsyringe_1.container.register("ILoginUserUseCase", {
            useClass: login_user_usecase_1.LoginUserUseCase,
        });
        tsyringe_1.container.register("IRefreshTokenUseCase", {
            useClass: refresh_token_usecase_1.RefreshTokenUseCase,
        });
        tsyringe_1.container.register("IGenerateTokenUseCase", {
            useClass: generate_token_usecase_1.GenerateTokenUseCase,
        });
        tsyringe_1.container.register("IRevokeRefreshTokenUseCase", {
            useClass: revoke_refresh_token_usecase_1.RevokeRefreshTokenUseCase,
        });
        tsyringe_1.container.register("IBlackListTokenUseCase", {
            useClass: blacklist_token_usecase_1.BlackListTokenUseCase,
        });
        tsyringe_1.container.register("IForgotPasswordUseCase", {
            useClass: forgot_password_usecase_1.ForgotPasswordUseCase,
        });
        tsyringe_1.container.register("IResetPasswordUseCase", {
            useClass: reset_password_usecase_1.ResetPasswordUseCase,
        });
        tsyringe_1.container.register("IGoogleUseCase", {
            useClass: google_usecase_1.GoogleUseCase,
        });
        tsyringe_1.container.register("ISendEmailUseCase", {
            useClass: send_email_usecase_1.SendEmailUseCase,
        });
        tsyringe_1.container.register("IUpdateUserDetailsUseCase", {
            useClass: update_user_details_usecase_1.UpdateUserDetailsUseCase,
        });
        tsyringe_1.container.register("IChangeUserPasswordUseCase", {
            useClass: change_user_password_usecase_1.ChangeUserPasswordUseCase,
        });
        tsyringe_1.container.register("IAddServiceUseCase", {
            useClass: add_service_usecase_1.AddServiceUseCase,
        });
        tsyringe_1.container.register("IGetAllServicesUseCase", {
            useClass: get_all_services_usecase_1.GetAllServicesUseCase,
        });
        tsyringe_1.container.register("IUpdateServiceUseCase", {
            useClass: update_service_usecase_1.UpdateServiceUseCase,
        });
        tsyringe_1.container.register("IDeleteServiceUseCase", {
            useClass: delete_service_usecase_1.DeleteServiceUseCase,
        });
        tsyringe_1.container.register("IGetAllShopsUseCase", {
            useClass: get_all_shops_usecase_1.GetAllShopsUseCase,
        });
        tsyringe_1.container.register("IUpdateShopStatusUseCase", {
            useClass: update_shop_status_usecase_1.UpdateShopStatusUseCase,
        });
        tsyringe_1.container.register("IGetAllUsersUseCase", {
            useClass: get_all_users_usecase_1.GetAllUsersUseCase,
        });
        tsyringe_1.container.register("IUpdateUserStatusUseCase", {
            useClass: update_user_status_usecase_1.UpdateUserStatusUseCase,
        });
        tsyringe_1.container.register("IGetUserDetailsUseCase", {
            useClass: get_user_details_usecase_1.GetUserDetailsUseCase,
        });
        tsyringe_1.container.register("IGetAllNearestShopsUseCase", {
            useClass: get_all_nearest_shops_usecase_1.GetAllNearestShopsUseCase,
        });
        tsyringe_1.container.register("IGetShopDetailsByShopIdUseCase", {
            useClass: get_shop_details_by_shopid_usecase_1.GetShopDetailsByShopIdUseCase,
        });
        tsyringe_1.container.register("IGetAllBookingsByShopIdUseCase", {
            useClass: get_all_bookings_by_shopid_usecase_1.GetAllBookingsByShopIdUseCase,
        });
        tsyringe_1.container.register("ICreateBookingUseCase", {
            useClass: create_booking_usecase_1.CreateBookingUseCase,
        });
        tsyringe_1.container.register("IVerifyPaymentUseCase", {
            useClass: verify_payment_usecase_1.VerifyPaymentUseCase,
        });
        tsyringe_1.container.register("IHandleFailurePaymentUseCase", {
            useClass: handle_failure_payment_usecase_1.HandleFailurePaymentUseCase,
        });
        tsyringe_1.container.register("IGetAllBookingsByUserUseCase", { useClass: get_all_bookings_by_user_usecase_1.GetAllBookingsByUserUseCase });
        tsyringe_1.container.register("ICancelBookingUseCase", {
            useClass: cancel_booking_usecase_1.CancelBookingUseCase,
        });
        tsyringe_1.container.register("ICompleteBookingUseCase", {
            useClass: complete_booking_usecase_1.CompleteBookingUseCase,
        });
        tsyringe_1.container.register("IGetWalletOverviewUseCase", {
            useClass: get_wallet_overview_usecase_1.GetWalletOverviewUseCase,
        });
        tsyringe_1.container.register("IGetWalletByUserUseCase", {
            useClass: get_wallet_by_user_usecase_1.GetWalletByUserUseCase,
        });
        tsyringe_1.container.register("IGetTransactionByUserUseCase", {
            useClass: get_transaction_by_user_usecase_1.GetTransactionByUserUseCase,
        });
        tsyringe_1.container.register("IGetWithdrawalByUserUseCase", {
            useClass: get_withdrawal_by_user_usecase_1.GetWithdrawalByUserUseCase,
        });
        tsyringe_1.container.register("ITopUpWalletUseCase", {
            useClass: topup_wallet_usecase_1.TopUpWalletUseCase,
        });
        tsyringe_1.container.register("IVerifyTopUpPaymentUseCase", {
            useClass: verify_topup_payment_usecase_1.VerifyTopUpPaymentUseCase,
        });
        tsyringe_1.container.register("IUpdateWalletBalanceUseCase", {
            useClass: update_wallet_balance_usecase_1.UpdateWalletBalanceUseCase,
        });
        tsyringe_1.container.register("IWithdrawFromWalletUseCase", {
            useClass: withdraw_from_wallet_usecase_1.WithdrawFromWalletUseCase,
        });
        tsyringe_1.container.register("IHandleTopUpPaymentFailureUseCase", {
            useClass: handle_topup_failure_payment_usecase_1.HandleTopUpPaymentFailureUseCase,
        });
        tsyringe_1.container.register("IAddShopReviewUseCase", {
            useClass: add_shop_review_usecase_1.AddShopReviewUseCase,
        });
        tsyringe_1.container.register("IAddPostUseCase", {
            useClass: add_post_usecase_1.AddPostUseCase,
        });
        tsyringe_1.container.register("IGetAllPostsByBarberUseCase", {
            useClass: get_all_posts_by_barber_usecase_1.GetAllPostsByBarberUseCase,
        });
        tsyringe_1.container.register("IGetSinglePostByPostIdUseCase", {
            useClass: get_single_post_by_postid_usecase_1.GetSinglePostByPostIdUseCase,
        });
        tsyringe_1.container.register("IUpdatePostUseCase", {
            useClass: update_post_usecase_1.UpdatePostUseCase,
        });
        tsyringe_1.container.register("IDeletePostUseCase", {
            useClass: delete_post_usecase_1.DeletePostUseCase,
        });
        tsyringe_1.container.register("IUpdatePostStatusUseCase", {
            useClass: update_post_status_usecase_1.UpdatePostStatusUseCase,
        });
        tsyringe_1.container.register("IToggleLikePostUseCase", {
            useClass: toggle_like_post_usecase_1.ToggleLikePostUseCase,
        });
        tsyringe_1.container.register("IAddCommentUseCase", {
            useClass: add_comment_usecase_1.AddCommentUseCase,
        });
        tsyringe_1.container.register("IToggleCommentLikeUseCase", {
            useClass: toggle_comment_like_usecase_1.ToggleCommentLikeUseCase,
        });
        tsyringe_1.container.register("IGetAllPostsForClientUseCase", {
            useClass: get_all_posts_for_client_usecase_1.GetAllPostsForClientUseCase,
        });
        tsyringe_1.container.register("ICreateWalletUseCase", {
            useClass: create_wallet_usecase_1.CreateWalletUseCase,
        });
        tsyringe_1.container.register("IIncrementWalletBalanceUseCase", {
            useClass: increment_wallet_balance_usecase_1.IncrementWalletBalanceUseCase,
        });
        tsyringe_1.container.register("IDecrementWalletBalanceUseCase", {
            useClass: decrement_wallet_balance_usecase_1.DecrementWalletBalanceUseCase,
        });
        tsyringe_1.container.register("IGetAllUserWithdrawalsUseCase", {
            useClass: get_all_user_withdrawals_usecase_1.GetAllUserWithdrawalsUseCase,
        });
        tsyringe_1.container.register("IApproveWithdrawalUseCase", {
            useClass: approve_withdrawal_usecase_1.ApproveWithdrawalUseCase,
        });
        tsyringe_1.container.register("IRejectWithdrawalUseCase", {
            useClass: reject_withdrawal_usecase_1.RejectWithdrawalUseCase,
        });
        tsyringe_1.container.register("IBookWithWalletUseCase", {
            useClass: book_with_wallet_usecase_1.BookWithWalletUseCase,
        });
        tsyringe_1.container.register("IGetChatByUserUseCase", {
            useClass: get_chat_by_user_usecase_1.GetChatByUserUseCase,
        });
        tsyringe_1.container.register("ICreateChatRoomUseCase", {
            useClass: create_chat_room_usecase_1.CreateChatRoomUseCase,
        });
        tsyringe_1.container.register("IGetAllChatsByUserUseCase", {
            useClass: get_all_chats_by_user_usecase_1.GetAllChatsByUserUseCase,
        });
        tsyringe_1.container.register("IGetChatByChatIdUseCase", {
            useClass: get_chat_by_chatid_usecase_1.GetChatByChatIdUseCase,
        });
        tsyringe_1.container.register("ISendDirectMessageUseCase", {
            useClass: send_direct_messsage_usecase_1.SendDirectMessageUseCase,
        });
        tsyringe_1.container.register("ICreateCommunityUseCase", {
            useClass: create_community_usecase_1.CreateCommunityUseCase,
        });
        tsyringe_1.container.register("IGetAllCommunitiesForAdminUseCase", {
            useClass: get_all_communities_for_admin_usecase_1.GetAllCommunitiesForAdminUseCase,
        });
        tsyringe_1.container.register("IGetCommunityForEditUseCase", {
            useClass: get_community_for_edit_usecase_1.GetCommunityForEditUseCase,
        });
        tsyringe_1.container.register("IEditCommunityUseCase", {
            useClass: edit_community_usecase_1.EditCommunityUseCase,
        });
        tsyringe_1.container.register("IUpdateCommunityStatusUseCase", {
            useClass: update_community_status_usecase_1.UpdateCommunityStatusUseCase,
        });
        tsyringe_1.container.register("IDeleteCommunityUseCase", {
            useClass: delete_community_usecase_1.DeleteCommunityUseCase,
        });
        tsyringe_1.container.register("IGetAllCommunitiesForBarberUseCase", {
            useClass: get_all_communities_for_barber_usecase_1.GetAllCommunitiesForBarberUseCase,
        });
        tsyringe_1.container.register("IBarberJoinCommunityUseCase", {
            useClass: barber_join_community_usecase_1.BarberJoinCommunityUseCase,
        });
        tsyringe_1.container.register("IGetAllCommunityChatsByUserUseCase", {
            useClass: get_all_community_chats_by_user_usecase_1.GetAllCommunityChatsByUserUseCase,
        });
        tsyringe_1.container.register("IGetCommunityChatUseCase", {
            useClass: get_community_chat_by_user_usecase_1.GetCommunityChatUseCase,
        });
        tsyringe_1.container.register("ISendCommunityMessageUseCase", {
            useClass: send_community_message_usecase_1.SendCommunityMessageUseCase,
        });
        tsyringe_1.container.register("IGetCommunityByCommunityIdUseCase", {
            useClass: get_community_by_communityid_usecase_1.GetCommunityByCommunityIdUseCase,
        });
        tsyringe_1.container.register("IReadDirectMessageUseCase", {
            useClass: read_direct_message_usecase_1.ReadDirectMessageUseCase,
        });
        tsyringe_1.container.register("IGeneratePresignedUrlUseCase", {
            useClass: generate_presigned_url_usecase_1.GeneratePresignedUrlUseCase,
        });
        tsyringe_1.container.register("IScheduleMeetingUseCase", {
            useClass: schedule_meeting_usecase_1.ScheduleMeetingUseCase,
        });
        tsyringe_1.container.register("IGetMeetingByCommunityIdUseCase", {
            useClass: get_meeting_by_communityid_usecase_1.GetMeetingByCommunityIdUseCase,
        });
        tsyringe_1.container.register("IGetAllMeetingsForListingUseCase", {
            useClass: get_all_meetings_for_listing_usecase_1.GetAllMeetingsForListingUseCase,
        });
        tsyringe_1.container.register("IUpdateMeetingDetailsUseCase", {
            useClass: update_meeting_details_usecase_1.UpdateMeetingDetailsUseCase,
        });
        tsyringe_1.container.register("ICancelMeetingUseCase", {
            useClass: cancel_meeting_usecase_1.CancelMeetingUseCase,
        });
        tsyringe_1.container.register("ICompleteMeetingUseCase", {
            useClass: complete_meeting_usecase_1.CompleteMeetingUseCase,
        });
        tsyringe_1.container.register("IGetNearest3ShopsForClientUseCase", {
            useClass: get_nearest_3_shops_for_client_usecase_1.GetNearest3ShopsForClientUseCase,
        });
        tsyringe_1.container.register("IGetLastBookingByUserUseCase", {
            useClass: get_last_booking_by_user_usecase_1.GetLastBookingByUserUseCase,
        });
        tsyringe_1.container.register("IGetBarberDashboardDataUseCase", {
            useClass: get_barber_dashboard_data_usecase_1.GetBarberDashboardDataUseCase,
        });
        tsyringe_1.container.register("IGetAdminDashboardDataUseCase", {
            useClass: get_admin_dashboard_data_usecase_1.GetAdminDashboardDataUseCase,
        });
        tsyringe_1.container.register("IGetHairstylesByFaceShapeUseCase", {
            useClass: get_hairstyles_by_face_shape_usecase_1.GetHairstylesByFaceShapeUseCase,
        });
        tsyringe_1.container.register("IAddHairstyleUseCase", {
            useClass: add_hairstyle_usecase_1.AddHairstyleUseCase,
        });
        tsyringe_1.container.register("IGetAllHairstylesUseCase", {
            useClass: get_all_hairstyles_usecase_1.GetAllHairstylesUseCase,
        });
        tsyringe_1.container.register("IUpdateHairstyleUseCase", {
            useClass: update_hairstyle_usecase_1.UpdateHairstyleUseCase,
        });
        tsyringe_1.container.register("IDeleteHairstyleUseCase", {
            useClass: delete_hairstyle_usecase_1.DeleteHairstyleUseCase,
        });
        tsyringe_1.container.register("IGetPostLikedUsersUseCase", {
            useClass: get_post_liked_users_usecase_1.GetPostLikedUsersUseCase,
        });
        tsyringe_1.container.register("IGetNotificationsByUserUseCase", {
            useClass: get_notifications_by_user_usecase_1.GetNotificationsByUserUseCase,
        });
        tsyringe_1.container.register("ISendNotificationByUserUseCase", {
            useClass: send_notification_by_user_usecase_1.SendNotificationByUserUseCase,
        });
        tsyringe_1.container.register("IMarkAllNotificationsAsReadByUserUseCase", {
            useClass: mark_all_notifications_as_read_by_user_usecase_1.MarkAllNotificationsAsReadByUserUseCase,
        });
        tsyringe_1.container.register("IMarkSingleNotificationAsReadByUserUseCase", {
            useClass: mark_single_notification_as_read_by_user_usecase_1.MarkSingleNotificationAsReadByUserUseCase,
        });
        //* ====== Register Bcrypts ====== *//
        tsyringe_1.container.register("IPasswordBcrypt", {
            useClass: password_bcrypt_1.PasswordBcrypt,
        });
        tsyringe_1.container.register("IOtpBcrypt", {
            useClass: otp_bcrypt_1.OtpBcrypt,
        });
        //* ====== Register Services ====== *//
        tsyringe_1.container.register("IUserExistenceService", {
            useClass: user_existence_service_1.UserExistenceService,
        });
        tsyringe_1.container.register("IOtpService", {
            useClass: otp_service_1.OtpService,
        });
        tsyringe_1.container.register("IEmailService", {
            useClass: email_service_1.EmailService,
        });
        tsyringe_1.container.register("ITokenService", {
            useClass: jwt_service_1.JWTService,
        });
        tsyringe_1.container.register("IRazorpayService", {
            useClass: razorpay_service_1.RazorpayService,
        });
        tsyringe_1.container.register("IS3Service", {
            useClass: s3_service_1.S3Service,
        });
        tsyringe_1.container.register("IGoogleCalendarService", {
            useClass: google_calendar_service_1.GoogleCalendarService,
        });
        tsyringe_1.container.register("ISocketService", {
            useClass: socket_service_1.SocketService,
        });
        //* ====== Register Socket Handlers ====== *//
        tsyringe_1.container.register("INotificationSocketHandler", {
            useClass: notification_handler_1.NotificationSocketHandler,
        });
    }
}
exports.UseCaseRegistry = UseCaseRegistry;
