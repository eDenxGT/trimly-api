import { IHairstyleEntity } from "../../models/hairstyle.entity";
import { IBaseRepository } from "../base-repository.interface";

export interface IHairstyleRepository
  extends IBaseRepository<IHairstyleEntity> {
  searchHairstylesWithPagination(params: {
    search?: string;
    skip?: number;
    limit?: number;
  }): Promise<{ hairstyles: IHairstyleEntity[]; totalPages: number }>;
}
