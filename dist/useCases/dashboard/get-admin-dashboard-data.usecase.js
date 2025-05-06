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
let GetAdminDashboardDataUseCase = class GetAdminDashboardDataUseCase {
    _clientRepository;
    _barberRepository;
    _bookingRepository;
    constructor(_clientRepository, _barberRepository, _bookingRepository) {
        this._clientRepository = _clientRepository;
        this._barberRepository = _barberRepository;
        this._bookingRepository = _bookingRepository;
    }
    async execute() {
        const [totalClients, totalBarbers, totalBookings, totalEarningsResult, bookingAndEarningsChartData, recentShops, recentClients,] = await Promise.all([
            this._clientRepository.countDocuments({}),
            this._barberRepository.countDocuments({}),
            this._bookingRepository.countDocuments({}),
            this._bookingRepository.getTotalEarnings(),
            this._bookingRepository.getBookingAndEarningsChartDataForAdmin(),
            this._barberRepository.getRecentShops(),
            this._clientRepository.getRecentClients(),
        ]);
        return {
            analytics: {
                totalClients,
                totalBarbers,
                totalBookings,
                totalEarnings: totalEarningsResult,
            },
            charts: {
                weeklyBookings: bookingAndEarningsChartData.weeklyBookings,
                monthlyBookings: bookingAndEarningsChartData.monthlyBookings,
                weeklyEarnings: bookingAndEarningsChartData.weeklyEarnings,
                monthlyEarnings: bookingAndEarningsChartData.monthlyEarnings,
            },
            recentShops,
            recentClients,
        };
    }
};
GetAdminDashboardDataUseCase = __decorate([
    injectable(),
    __param(0, inject("IClientRepository")),
    __param(1, inject("IBarberRepository")),
    __param(2, inject("IBookingRepository")),
    __metadata("design:paramtypes", [Object, Object, Object])
], GetAdminDashboardDataUseCase);
export { GetAdminDashboardDataUseCase };
