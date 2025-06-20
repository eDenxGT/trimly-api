"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.communityChatSocketHandler = exports.directChatSocketHandler = exports.s3Controller = exports.notificationController = exports.hairstyleDetectorController = exports.dashboardController = exports.meetingController = exports.chatController = exports.feedController = exports.reviewController = exports.financeController = exports.bookingController = exports.shopController = exports.serviceController = exports.authController = exports.userController = exports.blockStatusMiddleware = void 0;
//* ====== Module Imports ====== *//
const tsyringe_1 = require("tsyringe");
const index_1 = require("./index");
//* ====== Middleware Imports ====== *//
const block_status_middleware_1 = require("../../interfaceAdapters/middlewares/block-status.middleware");
//* ====== Controller Imports ====== *//
const auth_controller_1 = require("../../interfaceAdapters/controllers/auth/auth.controller");
const user_controller_1 = require("../../interfaceAdapters/controllers/user.controller");
const service_controller_1 = require("../../interfaceAdapters/controllers/service.controller");
const shop_controller_1 = require("../../interfaceAdapters/controllers/shop.controller");
const booking_controller_1 = require("../../interfaceAdapters/controllers/booking.controller");
const review_controller_1 = require("../../interfaceAdapters/controllers/review.controller");
const feed_controller_1 = require("../../interfaceAdapters/controllers/feed.controller");
const finance_controller_1 = require("../../interfaceAdapters/controllers/finance.controller");
const chat_controller_1 = require("../../interfaceAdapters/controllers/chat.controller");
const direct_chat_handler_1 = require("../../interfaceAdapters/websockets/handlers/direct-chat.handler");
const community_chat_handler_1 = require("../../interfaceAdapters/websockets/handlers/community-chat.handler");
const s3_controller_1 = require("../../interfaceAdapters/controllers/s3.controller");
const meeting_controller_1 = require("../../interfaceAdapters/controllers/meeting.controller");
const dashboard_controller_1 = require("../../interfaceAdapters/controllers/dashboard.controller");
const hairstyle_detector_controller_1 = require("../../interfaceAdapters/controllers/hairstyle-detector.controller");
const notification_controller_1 = require("../../interfaceAdapters/controllers/notification.controller");
// Registering all registries using a single class
index_1.DependencyInjection.registerAll();
//* ====== Middleware Resolving ====== *//
exports.blockStatusMiddleware = tsyringe_1.container.resolve(block_status_middleware_1.BlockStatusMiddleware);
//* ====== Controller Resolving ====== *//
exports.userController = tsyringe_1.container.resolve(user_controller_1.UserController);
exports.authController = tsyringe_1.container.resolve(auth_controller_1.AuthController);
exports.serviceController = tsyringe_1.container.resolve(service_controller_1.ServiceController);
exports.shopController = tsyringe_1.container.resolve(shop_controller_1.ShopController);
exports.bookingController = tsyringe_1.container.resolve(booking_controller_1.BookingController);
exports.financeController = tsyringe_1.container.resolve(finance_controller_1.FinanceController);
exports.reviewController = tsyringe_1.container.resolve(review_controller_1.ReviewController);
exports.feedController = tsyringe_1.container.resolve(feed_controller_1.FeedController);
exports.chatController = tsyringe_1.container.resolve(chat_controller_1.ChatController);
exports.meetingController = tsyringe_1.container.resolve(meeting_controller_1.MeetingController);
exports.dashboardController = tsyringe_1.container.resolve(dashboard_controller_1.DashboardController);
exports.hairstyleDetectorController = tsyringe_1.container.resolve(hairstyle_detector_controller_1.HairstyleDetectorController);
exports.notificationController = tsyringe_1.container.resolve(notification_controller_1.NotificationController);
exports.s3Controller = tsyringe_1.container.resolve(s3_controller_1.S3Controller);
//* ====== Socket Handler Resolving ====== *//
exports.directChatSocketHandler = tsyringe_1.container.resolve(direct_chat_handler_1.DirectChatSocketHandler);
exports.communityChatSocketHandler = tsyringe_1.container.resolve(community_chat_handler_1.CommunityChatSocketHandler);
