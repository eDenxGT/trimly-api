import { inject, injectable } from "tsyringe";
import { IGetAdminDashboardDataUseCase } from "../../entities/useCaseInterfaces/dashboard/get-admin-dashboard-data-usecase.interface";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface";
import { IBarberRepository } from "../../entities/repositoryInterfaces/users/barber-repository.interface";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { IAdminDashboardResponse } from "../../shared/dtos/dashboard-data.dto";

@injectable()
export class GetAdminDashboardDataUseCase
  implements IGetAdminDashboardDataUseCase
{
  constructor(
    @inject("IClientRepository")
    private _clientRepository: IClientRepository,
    @inject("IBarberRepository")
    private _barberRepository: IBarberRepository,
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository
  ) {}

  async execute(): Promise<IAdminDashboardResponse> {
    const [
      totalClients,
      totalBarbers,
      totalBookings,
      totalEarningsResult,
      bookingAndEarningsChartData,
      recentShops,
      recentClients,
    ] = await Promise.all([
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
}
