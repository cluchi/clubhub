export interface Subscription {
  id: string;
  child_id: string;
  course_id: string;
  subscription_type: "drop_in" | "monthly" | "quarterly";
  status: "active" | "expiring" | "expired" | "on_hold";
  start_date: string;
  end_date: string;
  next_session: string;
  renewal_date: string;
  payment_method: string;
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
    child_id: "1",
    course_id: "1",
    subscription_type: "monthly",
    status: "active",
    start_date: "2023-05-15T10:00:00.000Z",
    end_date: "2023-07-15T10:00:00.000Z",
    next_session: "2023-06-16T16:00:00.000Z",
    renewal_date: "2023-07-15T10:00:00.000Z",
    payment_method: "Visa ending in 4532",
  },
  {
    id: "2",
    child_id: "1",
    course_id: "2",
    subscription_type: "monthly",
    status: "expiring",
    start_date: "2023-05-01T10:00:00.000Z",
    end_date: "2023-06-19T10:00:00.000Z",
    next_session: "2023-06-16T17:30:00.000Z",
    renewal_date: "2023-06-19T10:00:00.000Z",
    payment_method: "Visa ending in 4532",
  },
  {
    id: "3",
    child_id: "2",
    course_id: "3",
    subscription_type: "quarterly",
    status: "active",
    start_date: "2023-06-01T10:00:00.000Z",
    end_date: "2023-08-01T10:00:00.000Z",
    next_session: "2023-06-17T10:00:00.000Z",
    renewal_date: "2023-08-01T10:00:00.000Z",
    payment_method: "Mastercard ending in 8901",
  },
];

export const bookings: Booking[] = [
  {
    id: "1",
    subscriptionId: "1",
    sessionDate: "2023-06-15T10:00:00.000Z",
    status: "booked",
    canReschedule: true,
  },
  {
    id: "2",
    subscriptionId: "1",
    sessionDate: "2023-06-16T16:00:00.000Z",
    status: "booked",
    canReschedule: true,
  },
  {
    id: "3",
    subscriptionId: "1",
    sessionDate: "2023-06-17T10:00:00.000Z",
    status: "booked",
    canReschedule: true,
  },
  {
    id: "4",
    subscriptionId: "2",
    sessionDate: "2023-06-16T17:30:00.000Z",
    status: "booked",
    canReschedule: true,
  },
];
