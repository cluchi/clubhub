export interface Notification {
  id: string;
  userId: string;
  type: "reminder" | "renewal" | "new_course" | "schedule_change";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  relatedItemId?: string;
  icon: string;
  color: string;
}

export const notifications: Notification[] = [
  {
    id: "1",
    userId: "1",
    type: "reminder",
    title: "Class Reminder",
    message: "Your piano lesson is tomorrow at 5:00 PM",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    isRead: false,
    relatedItemId: "3",
    icon: "clock",
    color: "#14B8A6",
  },
  {
    id: "2",
    userId: "1",
    type: "renewal",
    title: "Subscription Renewal",
    message: "Your gym membership will renew in 3 days",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    isRead: false,
    relatedItemId: "2",
    icon: "calendar",
    color: "#3B82F6",
  },
  {
    id: "3",
    userId: "1",
    type: "new_course",
    title: "New Course Available",
    message: "Advanced Swimming Techniques now open for registration",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    isRead: true,
    relatedItemId: "1",
    icon: "star",
    color: "#F97316",
  },
  {
    id: "4",
    userId: "1",
    type: "schedule_change",
    title: "Schedule Change",
    message: "Dance class moved from 6 PM to 7 PM this Friday",
    timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(), // 1.2 days ago
    isRead: true,
    relatedItemId: "2",
    icon: "alert-triangle",
    color: "#F97316",
  },
  {
    id: "5",
    userId: "1",
    type: "reminder",
    title: "Class Reminder",
    message: "Your yoga session starts in 30 minutes",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    isRead: true,
    relatedItemId: "4",
    icon: "clock",
    color: "#14B8A6",
  },
];
