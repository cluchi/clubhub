export interface Child {
  id: string;
  name: string;
  age: number;
  avatar: string;
  color: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  children: Child[];
  preferences: {
    notifications: boolean;
    location: string;
  };
}

export const children: Child[] = [
  // {
  //   id: "1",
  //   name: "Sarah",
  //   age: 8,
  //   avatar: "S",
  //   color: "#14B8A6",
  // },
  // {
  //   id: "2",
  //   name: "Max",
  //   age: 10,
  //   avatar: "M",
  //   color: "#3B82F6",
  // },
  // {
  //   id: "3",
  //   name: "Emma",
  //   age: 6,
  //   avatar: "E",
  //   color: "#8B5CF6",
  // },
];

export const users: User[] = [
  {
    id: "1",
    email: "parent@example.com",
    name: "Parent",
    children: children,
    preferences: {
      notifications: true,
      location: "New York",
    },
  },
];
