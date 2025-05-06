export interface IBarberDashboardResponse {
  analytics: {
    totalEarnings: number;
    totalBookings: number;
    totalClientsServed: number;
    upcomingAppointmentsToday: number;
    averageRating: number;
    totalReviews: number;
  };

  charts: {
    weeklyBookings: {
      date: string;
      count: number;
    }[];
    monthlyBookings: {
      date: string;
      count: number;
    }[];
    weeklyEarnings: {
      date: string;
      total: number;
    }[];
    monthlyEarnings: {
      date: string;
      total: number;
    }[];
  };

  upcomingAppointments: {
    bookingId: string;
    clientName: string;
    clientAvatar?: string;
    timeSlot: string;
    services: string[];
    status: "confirmed" | "cancelled";
  }[];

  latestReviews: {
    reviewId: string;
    clientName: string;
    clientAvatar?: string;
    rating: number;
    comment?: string;
    createdAt: string;
  }[];
}

export interface IAdminDashboardResponse {
  analytics: {
    totalClients: number;
    totalBarbers: number;
    totalBookings: number;
    totalEarnings: number;
  };

  charts: {
    weeklyBookings: {
      date: string;
      count: number;
    }[];
    monthlyBookings: {
      date: string;
      count: number;
    }[];
    weeklyEarnings: {
      date: string;
      total: number;
    }[];
    monthlyEarnings: {
      date: string;
      total: number;
    }[];
  };

  recentShops: {
    userId: string;
    name: string;
    ownerName: string;
    createdAt: Date;
    status: "pending" | "approved" | "rejected";
  }[];
  recentClients: { userId: string; name: string; createdAt: Date }[];
}
