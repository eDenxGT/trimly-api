//* ====== Module Imports ====== *//
import { container } from "tsyringe";
import { DependencyInjection } from "./index.js";
//* ====== Middleware Imports ====== *//
import { BlockStatusMiddleware } from "../../interfaceAdapters/middlewares/block-status.middleware.js";
//* ====== Controller Imports ====== *//
import { AuthController } from "../../interfaceAdapters/controllers/auth/auth.controller.js";
import { UserController } from "../../interfaceAdapters/controllers/user.controller.js";
import { ServiceController } from "../../interfaceAdapters/controllers/service.controller.js";
import { ShopController } from "../../interfaceAdapters/controllers/shop.controller.js";
import { BookingController } from "../../interfaceAdapters/controllers/booking.controller.js";
import { ReviewController } from "../../interfaceAdapters/controllers/review.controller.js";
import { FeedController } from "../../interfaceAdapters/controllers/feed.controller.js";
import { FinanceController } from "../../interfaceAdapters/controllers/finance.controller.js";
import { ChatController } from "../../interfaceAdapters/controllers/chat.controller.js";
import { DirectChatSocketHandler } from "../../interfaceAdapters/websockets/handlers/direct-chat.handler.js";
import { CommunityChatSocketHandler } from "../../interfaceAdapters/websockets/handlers/community-chat.handler.js";
import { S3Controller } from "../../interfaceAdapters/controllers/s3.controller.js";
import { MeetingController } from "../../interfaceAdapters/controllers/meeting.controller.js";
import { DashboardController } from "../../interfaceAdapters/controllers/dashboard.controller.js";
import { HairstyleDetectorController } from "../../interfaceAdapters/controllers/hairstyle-detector.controller.js";
// Registering all registries using a single class
DependencyInjection.registerAll();
//* ====== Middleware Resolving ====== *//
export const blockStatusMiddleware = container.resolve(BlockStatusMiddleware);
//* ====== Controller Resolving ====== *//
export const userController = container.resolve(UserController);
export const authController = container.resolve(AuthController);
export const serviceController = container.resolve(ServiceController);
export const shopController = container.resolve(ShopController);
export const bookingController = container.resolve(BookingController);
export const financeController = container.resolve(FinanceController);
export const reviewController = container.resolve(ReviewController);
export const feedController = container.resolve(FeedController);
export const chatController = container.resolve(ChatController);
export const meetingController = container.resolve(MeetingController);
export const dashboardController = container.resolve(DashboardController);
export const hairstyleDetectorController = container.resolve(HairstyleDetectorController);
export const s3Controller = container.resolve(S3Controller);
//* ====== Socket Handler Resolving ====== *//
export const directChatSocketHandler = container.resolve(DirectChatSocketHandler);
export const communityChatSocketHandler = container.resolve(CommunityChatSocketHandler);
