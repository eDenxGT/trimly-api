import { IBarberEntity } from "./barber.entity";
import { IClientEntity } from "./client.entity";
import { IServiceEntity } from "./service.enity";

export interface IBookingEntity {
	bookingId?: string;
	shopId: string;
	orderId: string;
	clientId: string;
	services: string[];
	date: Date;
	startTime: string;
	bookedTimeSlots: string[];
	duration: number;
	total: number;
	status?: "pending" | "completed" | "cancelled" | "confirmed";
	createdAt?: Date;
	updatedAt?: Date;
	servicesDetails?: IServiceEntity[];
	shopDetails?: IBarberEntity | null;
	clientDetails?: IClientEntity | null;
}
