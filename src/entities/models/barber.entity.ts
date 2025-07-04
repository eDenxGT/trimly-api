import { IReviewEntity } from "./review.entity";
import { IServiceEntity } from "./service.enity";
import { IUserEntity } from "./user.entity";

export interface IBarberEntity extends Omit<IUserEntity, "fullName"> {
  shopName?: string;
  banner?: string;
  description?: string;
  googleId?: string;
  openingHours: {
    [day: string]: {
      open?: string;
      close?: string;
    } | null;
  };
  amenities: {
    wifi: boolean;
    parking: boolean;
  };
  card_details?: {
    card_number: string;
    owner_name: string;
    expiry_date: string;
    cvv: string;
    type: string;
  };
  totalRevenue?: string;
  walletBalance?: number;
  withdrawnAmount?: string;
  rejectionReason?: string;
  geoLocation?: {
    type?: "Point";
    coordinates?: number[];
  };
  location?: {
    name?: string;
    displayName?: string;
    zipCode?: string;
  };
}
