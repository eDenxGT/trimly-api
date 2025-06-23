"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRepository = void 0;
const tsyringe_1 = require("tsyringe");
const booking_model_1 = require("../../../frameworks/database/mongoDb/models/booking.model");
const base_repository_1 = require("../base.repository");
const group_data_by_week_helper_1 = require("../../../shared/utils/group-data-by-week.helper");
let BookingRepository = class BookingRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(booking_model_1.BookingModel);
    }
    findBookingsWithDetailsForBarber(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const pipeline = [
                {
                    $match: { shopId: userId },
                },
                {
                    $lookup: {
                        from: "services",
                        localField: "services",
                        foreignField: "serviceId",
                        as: "servicesDetails",
                    },
                },
                {
                    $lookup: {
                        from: "clients",
                        localField: "clientId",
                        foreignField: "userId",
                        as: "clientDetails",
                    },
                },
                {
                    $unwind: {
                        path: "$clientDetails",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $sort: {
                        // date: -1,
                        // startTime: -1,
                        createdAt: -1,
                    },
                },
                {
                    $project: {
                        _id: 0,
                        bookingId: 1,
                        date: 1,
                        startTime: 1,
                        status: 1,
                        duration: 1,
                        total: 1,
                        servicesDetails: {
                            $map: {
                                input: "$servicesDetails",
                                as: "service",
                                in: {
                                    serviceId: "$$service.serviceId",
                                    name: "$$service.name",
                                    price: "$$service.price",
                                },
                            },
                        },
                        clientDetails: {
                            fullName: "$clientDetails.fullName",
                            userId: "$clientDetails.userId",
                            avatar: "$clientDetails.avatar",
                            phoneNumber: "$clientDetails.phoneNumber",
                        },
                    },
                },
            ];
            return booking_model_1.BookingModel.aggregate(pipeline).exec();
        });
    }
    findBookingsWithDetailsForClient(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const pipeline = [
                {
                    $match: { clientId: userId },
                },
                {
                    $lookup: {
                        from: "services",
                        localField: "services",
                        foreignField: "serviceId",
                        as: "servicesDetails",
                    },
                },
                {
                    $lookup: {
                        from: "barbers",
                        localField: "shopId",
                        foreignField: "userId",
                        as: "shopDetails",
                    },
                },
                {
                    $unwind: {
                        path: "$shopDetails",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $sort: {
                        // date: -1,
                        // startTime: -1,
                        createdAt: -1,
                    },
                },
                {
                    $project: {
                        _id: 0,
                        bookingId: 1,
                        date: 1,
                        startTime: 1,
                        status: 1,
                        total: 1,
                        servicesDetails: {
                            $map: {
                                input: "$servicesDetails",
                                as: "service",
                                in: {
                                    name: "$$service.name",
                                    price: "$$service.price",
                                },
                            },
                        },
                        shopDetails: {
                            userId: "$shopDetails.userId",
                            shopName: "$shopDetails.shopName",
                            avatar: "$shopDetails.avatar",
                            location: "$shopDetails.location",
                            geoLocation: "$shopDetails.geoLocation",
                        },
                    },
                },
            ];
            return booking_model_1.BookingModel.aggregate(pipeline).exec();
        });
    }
    findLastBookingByUserId(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, }) {
            const pipeline = [
                {
                    $match: { clientId: userId },
                },
                {
                    $lookup: {
                        from: "services",
                        localField: "services",
                        foreignField: "serviceId",
                        as: "servicesDetails",
                    },
                },
                {
                    $lookup: {
                        from: "barbers",
                        localField: "shopId",
                        foreignField: "userId",
                        as: "shopDetails",
                    },
                },
                {
                    $unwind: {
                        path: "$shopDetails",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $sort: {
                        createdAt: -1,
                    },
                },
                {
                    $limit: 1,
                },
                {
                    $project: {
                        _id: 0,
                        bookingId: 1,
                        date: 1,
                        startTime: 1,
                        status: 1,
                        total: 1,
                        servicesDetails: {
                            $map: {
                                input: "$servicesDetails",
                                as: "service",
                                in: {
                                    name: "$$service.name",
                                    price: "$$service.price",
                                },
                            },
                        },
                        shopDetails: {
                            userId: "$shopDetails.userId",
                            shopName: "$shopDetails.shopName",
                            avatar: "$shopDetails.avatar",
                            location: "$shopDetails.location",
                            geoLocation: "$shopDetails.geoLocation",
                        },
                    },
                },
            ];
            const result = yield booking_model_1.BookingModel.aggregate(pipeline).exec();
            return result[0] || null;
        });
    }
    // * Analytics
    getDashboardAnalytics(barberId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const bookingStats = yield booking_model_1.BookingModel.aggregate([
                {
                    $match: {
                        shopId: barberId,
                        status: { $in: ["confirmed", "completed"] },
                    },
                },
                {
                    $facet: {
                        totalEarnings: [
                            { $match: { status: "completed" } },
                            { $group: { _id: null, total: { $sum: "$total" } } },
                        ],
                        totalBookings: [{ $count: "count" }],
                        totalClientsServed: [
                            { $match: { status: "completed" } },
                            { $group: { _id: "$clientId" } },
                            { $count: "count" },
                        ],
                        upcomingAppointmentsToday: [
                            {
                                $match: {
                                    date: { $gte: today, $lt: tomorrow },
                                    status: "confirmed",
                                },
                            },
                            { $count: "count" },
                        ],
                    },
                },
            ]);
            const stats = bookingStats[0];
            const earnings = ((_a = stats.totalEarnings[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
            const totalBookings = ((_b = stats.totalBookings[0]) === null || _b === void 0 ? void 0 : _b.count) || 0;
            const totalClients = ((_c = stats.totalClientsServed[0]) === null || _c === void 0 ? void 0 : _c.count) || 0;
            const todayAppointments = ((_d = stats.upcomingAppointmentsToday[0]) === null || _d === void 0 ? void 0 : _d.count) || 0;
            return {
                totalEarnings: earnings,
                totalBookings,
                totalClientsServed: totalClients,
                upcomingAppointmentsToday: todayAppointments,
            };
        });
    }
    getBookingAndEarningsChartData(shopId) {
        return __awaiter(this, void 0, void 0, function* () {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const weekAgo = new Date(today);
            weekAgo.setDate(today.getDate() - 6);
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(today.getDate() - 29);
            const [weeklyBookings, monthlyBookings, weeklyEarnings, monthlyEarnings] = yield Promise.all([
                booking_model_1.BookingModel.aggregate([
                    {
                        $match: {
                            shopId,
                            date: { $gte: weekAgo, $lte: today },
                            status: { $in: ["confirmed", "completed"] },
                        },
                    },
                    {
                        $group: {
                            _id: {
                                $dateToString: { format: "%Y-%m-%d", date: "$date" },
                            },
                            count: { $sum: 1 },
                        },
                    },
                    { $sort: { _id: 1 } },
                ]),
                booking_model_1.BookingModel.aggregate([
                    {
                        $match: {
                            shopId,
                            date: { $gte: thirtyDaysAgo, $lte: today },
                            status: { $in: ["confirmed", "completed"] },
                        },
                    },
                    {
                        $group: {
                            _id: {
                                $dateToString: { format: "%Y-%m-%d", date: "$date" },
                            },
                            count: { $sum: 1 },
                        },
                    },
                    { $sort: { _id: 1 } },
                ]),
                booking_model_1.BookingModel.aggregate([
                    {
                        $match: {
                            shopId,
                            date: { $gte: weekAgo, $lte: today },
                            status: "completed",
                        },
                    },
                    {
                        $group: {
                            _id: {
                                $dateToString: { format: "%Y-%m-%d", date: "$date" },
                            },
                            total: { $sum: "$total" },
                        },
                    },
                    { $sort: { _id: 1 } },
                ]),
                booking_model_1.BookingModel.aggregate([
                    {
                        $match: {
                            shopId,
                            date: { $gte: thirtyDaysAgo, $lte: today },
                            status: "completed",
                        },
                    },
                    {
                        $group: {
                            _id: {
                                $dateToString: { format: "%Y-%m-%d", date: "$date" },
                            },
                            total: { $sum: "$total" },
                        },
                    },
                    { $sort: { _id: 1 } },
                ]),
            ]);
            const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const weeklyDays = [];
            for (let i = 0; i < 7; i++) {
                const date = new Date(weekAgo);
                date.setDate(weekAgo.getDate() + i);
                weeklyDays.push({
                    fullDate: date.toISOString().split("T")[0],
                    dayName: dayNames[date.getDay()],
                });
            }
            const transformedWeeklyBookings = weeklyDays.map((day) => {
                const matchingBooking = weeklyBookings.find((b) => b._id === day.fullDate);
                return {
                    date: day.dayName,
                    count: matchingBooking ? matchingBooking.count : 0,
                };
            });
            const transformedWeeklyEarnings = weeklyDays.map((day) => {
                const matchingEarning = weeklyEarnings.find((e) => e._id === day.fullDate);
                return {
                    date: day.dayName,
                    total: matchingEarning ? matchingEarning.total : 0,
                };
            });
            const transformedMonthlyBookings = (0, group_data_by_week_helper_1.generateCompleteWeeklyData)(monthlyBookings);
            const transformedMonthlyEarnings = (0, group_data_by_week_helper_1.generateCompleteWeeklyData)(monthlyEarnings, true);
            return {
                weeklyBookings: transformedWeeklyBookings,
                monthlyBookings: transformedMonthlyBookings,
                weeklyEarnings: transformedWeeklyEarnings,
                monthlyEarnings: transformedMonthlyEarnings,
            };
        });
    }
    getBookingAndEarningsChartDataForAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const weekAgo = new Date(today);
            weekAgo.setDate(today.getDate() - 6);
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(today.getDate() - 29);
            const [weeklyBookings, monthlyBookings, weeklyEarnings, monthlyEarnings] = yield Promise.all([
                booking_model_1.BookingModel.aggregate([
                    {
                        $match: {
                            status: { $in: ["confirmed", "completed"] },
                            date: { $gte: weekAgo, $lte: today },
                        },
                    },
                    {
                        $group: {
                            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                            count: { $sum: 1 },
                        },
                    },
                    { $sort: { _id: 1 } },
                ]),
                booking_model_1.BookingModel.aggregate([
                    {
                        $match: {
                            status: { $in: ["confirmed", "completed"] },
                            date: { $gte: thirtyDaysAgo, $lte: today },
                        },
                    },
                    {
                        $group: {
                            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                            count: { $sum: 1 },
                        },
                    },
                    { $sort: { _id: 1 } },
                ]),
                booking_model_1.BookingModel.aggregate([
                    {
                        $match: {
                            status: "completed",
                            date: { $gte: weekAgo, $lte: today },
                        },
                    },
                    {
                        $group: {
                            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                            total: { $sum: "$total" },
                        },
                    },
                    { $sort: { _id: 1 } },
                ]),
                booking_model_1.BookingModel.aggregate([
                    {
                        $match: {
                            status: "completed",
                            date: { $gte: thirtyDaysAgo, $lte: today },
                        },
                    },
                    {
                        $group: {
                            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                            total: { $sum: "$total" },
                        },
                    },
                    { $sort: { _id: 1 } },
                ]),
            ]);
            const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const weeklyDays = [];
            for (let i = 0; i < 7; i++) {
                const date = new Date(weekAgo);
                date.setDate(weekAgo.getDate() + i);
                weeklyDays.push({
                    fullDate: date.toISOString().split("T")[0],
                    dayName: dayNames[date.getDay()],
                });
            }
            const transformedWeeklyBookings = weeklyDays.map((day) => {
                const matchingBooking = weeklyBookings.find((b) => b._id === day.fullDate);
                return {
                    date: day.dayName,
                    count: matchingBooking ? matchingBooking.count : 0,
                };
            });
            const transformedWeeklyEarnings = weeklyDays.map((day) => {
                const matchingEarning = weeklyEarnings.find((e) => e._id === day.fullDate);
                return {
                    date: day.dayName,
                    total: matchingEarning ? matchingEarning.total : 0,
                };
            });
            const transformedMonthlyBookings = (0, group_data_by_week_helper_1.generateCompleteWeeklyData)(monthlyBookings);
            const transformedMonthlyEarnings = (0, group_data_by_week_helper_1.generateCompleteWeeklyData)(monthlyEarnings, true);
            return {
                weeklyBookings: transformedWeeklyBookings,
                monthlyBookings: transformedMonthlyBookings,
                weeklyEarnings: transformedWeeklyEarnings,
                monthlyEarnings: transformedMonthlyEarnings,
            };
        });
    }
    getUpcomingAppointmentsForToday(shopId) {
        return __awaiter(this, void 0, void 0, function* () {
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
            const todayEnd = new Date();
            todayEnd.setHours(23, 59, 59, 999);
            return booking_model_1.BookingModel.aggregate([
                {
                    $match: {
                        shopId,
                        status: "confirmed",
                        date: { $gte: todayStart, $lte: todayEnd },
                    },
                },
                {
                    $lookup: {
                        from: "clients",
                        localField: "clientId",
                        foreignField: "userId",
                        as: "client",
                    },
                },
                { $unwind: "$client" },
                {
                    $lookup: {
                        from: "services",
                        localField: "services",
                        foreignField: "serviceId",
                        as: "serviceDetails",
                    },
                },
                {
                    $project: {
                        bookingId: 1,
                        timeSlot: "$startTime",
                        services: "$serviceDetails.name",
                        status: 1,
                        clientName: "$client.fullName",
                        clientAvatar: "$client.avatar",
                    },
                },
            ]);
        });
    }
    getTotalEarnings() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const result = yield booking_model_1.BookingModel.aggregate([
                {
                    $match: { status: "completed" },
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$total" },
                    },
                },
            ]);
            return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
        });
    }
};
exports.BookingRepository = BookingRepository;
exports.BookingRepository = BookingRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], BookingRepository);
