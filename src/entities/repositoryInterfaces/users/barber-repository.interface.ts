import { IAdminDashboardResponse, IBarberDashboardResponse } from "../../../shared/dtos/dashboard-data.dto";
import { IBarberEntity } from "../../models/barber.entity";
import { IBookingEntity } from "../../models/booking.entity";
import { IServiceEntity } from "../../models/service.enity";
import { IBaseRepository } from "../base-repository.interface";

export interface IBarberRepository extends IBaseRepository<IBarberEntity> {
  updateRevenue(shopId: string, revenue: number): Promise<void>;
  findAllNearbyShopsWithFilters(
    filters: {
      search?: string;
      amenities: string[];
    },
    sorting: {
      sortBy: string;
      sortOrder: "asc" | "desc";
    },
    pagination: {
      page: number;
      limit: number;
    }
    // userLocation: number[] // [longitude, latitude]
  ): Promise<IBarberEntity[]>;
  getBarberShopWithAllDetails(filter: any): Promise<
    IBarberEntity & {
      services: IServiceEntity[];
      bookings: IBookingEntity[];
    }
  >;

  findNearest3Shops({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }): Promise<IBarberEntity[] | null>;

  getRecentShops(): Promise<IAdminDashboardResponse["recentShops"]>;
}
