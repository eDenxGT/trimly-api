var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { inject, injectable } from "tsyringe";
let GetBarberDashboardDataUseCase = class GetBarberDashboardDataUseCase {
    _bookingRepository;
    _reviewRepository;
    constructor(_bookingRepository, _reviewRepository) {
        this._bookingRepository = _bookingRepository;
        this._reviewRepository = _reviewRepository;
    }
    async execute({ userId, }) {
        const [analytics, reviewStats, bookingAndEarningsChartData, upcomingAppointments, latestReviews,] = await Promise.all([
            this._bookingRepository.getDashboardAnalytics(userId),
            this._reviewRepository.getReviewStatsByShopId({ shopId: userId }),
            this._bookingRepository.getBookingAndEarningsChartData(userId),
            this._bookingRepository.getUpcomingAppointmentsForToday(userId),
            this._reviewRepository.getLatestReviews(userId),
        ]);
        return {
            analytics: {
                totalEarnings: analytics.totalEarnings || 0,
                totalBookings: analytics.totalBookings || 0,
                totalClientsServed: analytics.totalClientsServed || 0,
                upcomingAppointmentsToday: analytics.upcomingAppointmentsToday || 0,
                averageRating: reviewStats.averageRating,
                totalReviews: reviewStats.totalReviews,
            },
            charts: {
                weeklyBookings: bookingAndEarningsChartData.weeklyBookings,
                monthlyBookings: bookingAndEarningsChartData.monthlyBookings,
                weeklyEarnings: bookingAndEarningsChartData.weeklyEarnings,
                monthlyEarnings: bookingAndEarningsChartData.monthlyEarnings,
            },
            upcomingAppointments: upcomingAppointments,
            latestReviews: latestReviews,
        };
    }
};
GetBarberDashboardDataUseCase = __decorate([
    injectable(),
    __param(0, inject("IBookingRepository")),
    __param(1, inject("IReviewRepository")),
    __metadata("design:paramtypes", [Object, Object])
], GetBarberDashboardDataUseCase);
export { GetBarberDashboardDataUseCase };
