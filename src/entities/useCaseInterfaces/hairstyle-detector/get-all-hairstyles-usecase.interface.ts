import { IHairstyleEntity } from "../../models/hairstyle.entity";

export interface IGetAllHairstylesUseCase {
  execute({
    search,
    page,
    limit,
  }: {
    search: string;
    page: number;
    limit: number;
  }): Promise<{ hairstyles: IHairstyleEntity[]; totalPages: number }>;
}