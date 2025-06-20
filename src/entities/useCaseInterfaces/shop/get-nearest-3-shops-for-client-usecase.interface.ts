import { IBarberEntity } from "../../models/barber.entity";

export interface IGetNearest3ShopsForClientUseCase {
  execute({
    userId,
    latitude,
    longitude,
  }: {
    userId: string;
    latitude: number;
    longitude: number;
  }): Promise<IBarberEntity[] | null>;
}
