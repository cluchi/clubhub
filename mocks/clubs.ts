export interface Club {
  id: string;
  name: string;
  description: string;
  location: string;
  distance: number;
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: string[];
  operatingHours: {
    [key: string]: { open: string; close: string };
  };
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  category: string;
}

export const clubs: Club[] = [
  {
    id: "1",
    name: "FitZone Gym",
    description:
      "Premium fitness facility with state-of-the-art equipment, expert trainers, and a welcoming community. We offer comprehensive fitness solutions including strength training, cardio, group classes, and personal training sessions.",
    location: "Downtown",
    distance: 2.3,
    rating: 4.8,
    reviewCount: 124,
    images: ["https://example.com/fitzone1.jpg"],
    amenities: [
      "Parking",
      "Locker Rooms",
      "Showers",
      "Café",
      "Personal Training",
    ],
    operatingHours: {
      "Monday - Friday": { open: "5:00 AM", close: "11:00 PM" },
      Saturday: { open: "6:00 AM", close: "10:00 PM" },
      Sunday: { open: "7:00 AM", close: "9:00 PM" },
    },
    contact: {
      phone: "555-123-4567",
      email: "info@fitzonegym.com",
      address: "123 Fitness Ave, Downtown",
    },
    category: "Gym",
  },
  {
    id: "2",
    name: "Rhythm Studio",
    description:
      "Dance studio offering a variety of classes for all ages and skill levels. From ballet to hip hop, our experienced instructors will help you find your rhythm.",
    location: "Midtown",
    distance: 3.5,
    rating: 4.9,
    reviewCount: 89,
    images: ["https://example.com/rhythm1.jpg"],
    amenities: ["Sprung Floors", "Mirrors", "Sound System", "Changing Rooms"],
    operatingHours: {
      "Monday - Friday": { open: "9:00 AM", close: "9:00 PM" },
      Saturday: { open: "9:00 AM", close: "6:00 PM" },
      Sunday: { open: "10:00 AM", close: "4:00 PM" },
    },
    contact: {
      phone: "555-987-6543",
      email: "info@rhythmstudio.com",
      address: "456 Dance Blvd, Midtown",
    },
    category: "Dance",
  },
  {
    id: "3",
    name: "AquaFit Center",
    description:
      "State-of-the-art aquatic facility offering swimming lessons, water aerobics, and open swim sessions for all ages.",
    location: "Riverside",
    distance: 4.1,
    rating: 4.7,
    reviewCount: 156,
    images: ["https://example.com/aquafit1.jpg"],
    amenities: [
      "Olympic Pool",
      "Kids Pool",
      "Hot Tub",
      "Sauna",
      "Towel Service",
    ],
    operatingHours: {
      "Monday - Friday": { open: "6:00 AM", close: "10:00 PM" },
      "Saturday - Sunday": { open: "8:00 AM", close: "8:00 PM" },
    },
    contact: {
      phone: "555-789-0123",
      email: "info@aquafitcenter.com",
      address: "789 Water Lane, Riverside",
    },
    category: "Swimming",
  },
  {
    id: "4",
    name: "Harmony Music",
    description:
      "Music school offering lessons in piano, guitar, violin, and voice for students of all ages and abilities.",
    location: "Arts District",
    distance: 1.8,
    rating: 4.9,
    reviewCount: 112,
    images: ["https://example.com/harmony1.jpg"],
    amenities: ["Practice Rooms", "Recording Studio", "Instrument Rental"],
    operatingHours: {
      "Monday - Friday": { open: "10:00 AM", close: "8:00 PM" },
      Saturday: { open: "9:00 AM", close: "5:00 PM" },
      Sunday: { open: "Closed", close: "Closed" },
    },
    contact: {
      phone: "555-456-7890",
      email: "lessons@harmonymusic.com",
      address: "321 Melody Street, Arts District",
    },
    category: "Music",
  },
  {
    id: "5",
    name: "Zen Studio",
    description:
      "Peaceful yoga studio offering a variety of classes from beginner to advanced, focusing on mindfulness and wellness.",
    location: "Eastside",
    distance: 2.7,
    rating: 4.8,
    reviewCount: 98,
    images: ["https://example.com/zen1.jpg"],
    amenities: ["Mats Provided", "Meditation Room", "Tea Bar"],
    operatingHours: {
      "Monday - Thursday": { open: "6:00 AM", close: "9:00 PM" },
      Friday: { open: "6:00 AM", close: "8:00 PM" },
      "Saturday - Sunday": { open: "8:00 AM", close: "6:00 PM" },
    },
    contact: {
      phone: "555-234-5678",
      email: "info@zenstudio.com",
      address: "567 Calm Avenue, Eastside",
    },
    category: "Yoga",
  },
];
