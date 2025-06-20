export interface Subscription {
  id: string;
  childId: string;
  courseId: string;
  status: "active" | "expiring" | "expired" | "on_hold";
  startDate: string;
  endDate: string;
  nextSession: string;
  renewalDate: string;
  paymentMethod: string;
}

export interface Booking {
  id: string;
  subscriptionId: string;
  sessionDate: string;
  status: "booked" | "completed" | "cancelled";
  canReschedule: boolean;
}

export const subscriptions: Subscription[] = [
  {
    id: "1",
    childId: "1",
    courseId: "1",
    status: "active",
    startDate: "2023-05-15",
    endDate: "2023-07-15",
    nextSession: "2023-06-16 16:00:00",
    renewalDate: "2023-07-15",
    paymentMethod: "Visa ending in 4532",
  },
  {
    id: "2",
    childId: "1",
    courseId: "2",
    status: "expiring",
    startDate: "2023-05-01",
    endDate: "2023-06-19",
    nextSession: "2023-06-16 17:30:00",
    renewalDate: "2023-06-19",
    paymentMethod: "Visa ending in 4532",
  },
  {
    id: "3",
    childId: "2",
    courseId: "3",
    status: "active",
    startDate: "2023-06-01",
    endDate: "2023-08-01",
    nextSession: "2023-06-17 10:00:00",
    renewalDate: "2023-08-01",
    paymentMethod: "Mastercard ending in 8901",
  },
];

export const bookings: Booking[] = [
  {
    id: "1",
    subscriptionId: "1",
    sessionDate: "2023-06-15 10:00:00",
    status: "booked",
    canReschedule: true,
  },
  {
    id: "2",
    subscriptionId: "1",
    sessionDate: "2023-06-16 16:00:00",
    status: "booked",
    canReschedule: true,
  },
  {
    id: "3",
    subscriptionId: "1",
    sessionDate: "2023-06-17 10:00:00",
    status: "booked",
    canReschedule: true,
  },
  {
    id: "4",
    subscriptionId: "2",
    sessionDate: "2023-06-16 17:30:00",
    status: "booked",
    canReschedule: true,
  },
];
