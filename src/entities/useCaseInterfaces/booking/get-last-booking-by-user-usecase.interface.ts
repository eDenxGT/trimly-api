import { IBookingEntity } from "../../models/booking.entity";

export interface IGetLastBookingByUserUseCase {
  execute({ userId }: { userId: string }): Promise<IBookingEntity | null>;
}
