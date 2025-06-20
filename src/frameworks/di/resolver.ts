//* ====== Module Imports ====== *//
import { container } from "tsyringe";

import { DependencyInjection } from "./index";

//* ====== Middleware Imports ====== *//
import { BlockStatusMiddleware } from "../../interfaceAdapters/middlewares/block-status.middleware";

//* ====== Controller Imports ====== *//
import { AuthController } from "../../interfaceAdapters/controllers/auth/auth.controller";
import { IAuthController } from "../../entities/controllerInterfaces/users/auth-controller.interface";
import { UserController } from "../../interfaceAdapters/controllers/user.controller";
import { IUserController } from "../../entities/controllerInterfaces/users/user-controller.interface";
import { IServiceController } from "../../entities/controllerInterfaces/service/service-controller.interface";
import { ServiceController } from "../../interfaceAdapters/controllers/service.controller";
import { ShopController } from "../../interfaceAdapters/controllers/shop.controller";
import { IShopController } from "../../entities/controllerInterfaces/shop/shop-controller.interface";
import { IBookingController } from "../../entities/controllerInterfaces/booking/booking-controller.interface";
import { BookingController } from "../../interfaceAdapters/controllers/booking.controller";
import { ReviewController } from "../../interfaceAdapters/controllers/review.controller";
import { IReviewController } from "../../entities/controllerInterfaces/review/review-controller.interface";
import { IFeedController } from "../../entities/controllerInterfaces/feed/feed-controller.interface";
import { FeedController } from "../../interfaceAdapters/controllers/feed.controller";
import { FinanceController } from "../../interfaceAdapters/controllers/finance.controller";
import { IFinanceController } from "../../entities/controllerInterfaces/finance/finance-controller.interface";
import { IChatController } from "../../entities/controllerInterfaces/chat/chat-controller.interface";
import { ChatController } from "../../interfaceAdapters/controllers/chat.controller";
import { DirectChatSocketHandler } from "../../interfaceAdapters/websockets/handlers/direct-chat.handler";
import { IDirectChatSocketHandler } from "../../entities/socketHandlerInterfaces/direct-chat-handler.interface";
import { CommunityChatSocketHandler } from "../../interfaceAdapters/websockets/handlers/community-chat.handler";
import { ICommunityChatSocketHandler } from "../../entities/socketHandlerInterfaces/community-chat-handler.interface";
import { S3Controller } from "../../interfaceAdapters/controllers/s3.controller";
import { IS3Controller } from "../../entities/controllerInterfaces/s3/s3-controller.interface";
import { MeetingController } from "../../interfaceAdapters/controllers/meeting.controller";
import { IMeetingController } from "../../entities/controllerInterfaces/meeting/meeting-controller.interface";
import { DashboardController } from "../../interfaceAdapters/controllers/dashboard.controller";
import { IDashboardController } from "../../entities/controllerInterfaces/dashboard/dashboard-controller.interface";
import { HairstyleDetectorController } from "../../interfaceAdapters/controllers/hairstyle-detector.controller";
import { IHairstyleDetectorController } from "../../entities/controllerInterfaces/hairstyle-detector/hairstyle-detector-controller.interface";
import { NotificationController } from "../../interfaceAdapters/controllers/notification.controller";
import { INotificationController } from "../../entities/controllerInterfaces/notifications/notification-controller.interface";
import { NotificationSocketHandler } from "../../interfaceAdapters/websockets/handlers/notification.handler";
import { INotificationSocketHandler } from "../../entities/socketHandlerInterfaces/notification-handler.interface";

// Registering all registries using a single class
DependencyInjection.registerAll();

//* ====== Middleware Resolving ====== *//
export const blockStatusMiddleware = container.resolve(BlockStatusMiddleware);

//* ====== Controller Resolving ====== *//
export const userController =
  container.resolve<IUserController>(UserController);

export const authController =
  container.resolve<IAuthController>(AuthController);

export const serviceController =
  container.resolve<IServiceController>(ServiceController);

export const shopController =
  container.resolve<IShopController>(ShopController);

export const bookingController =
  container.resolve<IBookingController>(BookingController);

export const financeController =
  container.resolve<IFinanceController>(FinanceController);

export const reviewController =
  container.resolve<IReviewController>(ReviewController);

export const feedController =
  container.resolve<IFeedController>(FeedController);

export const chatController =
  container.resolve<IChatController>(ChatController);

export const meetingController =
  container.resolve<IMeetingController>(MeetingController);

export const dashboardController =
  container.resolve<IDashboardController>(DashboardController);

export const hairstyleDetectorController =
  container.resolve<IHairstyleDetectorController>(HairstyleDetectorController);

export const notificationController =
  container.resolve<INotificationController>(NotificationController);

export const s3Controller = container.resolve<IS3Controller>(S3Controller);

//* ====== Socket Handler Resolving ====== *//
export const directChatSocketHandler =
  container.resolve<IDirectChatSocketHandler>(DirectChatSocketHandler);

export const communityChatSocketHandler =
  container.resolve<ICommunityChatSocketHandler>(CommunityChatSocketHandler);