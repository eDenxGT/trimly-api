import { IBarberDashboardResponse } from "../../../shared/dtos/dashboard-data.dto";
import { IReviewEntity } from "../../models/review.entity";
import { IBaseRepository } from "../base-repository.interface";

export interface IReviewRepository extends IBaseRepository<IReviewEntity> {
  getReviewStatsByShopId({
    shopId,
  }: {
    shopId: string;
  }): Promise<{ averageRating: number; totalReviews: number }>;

  getLatestReviews(
      shopId: string
    ): Promise<IBarberDashboardResponse["latestReviews"]>
}
