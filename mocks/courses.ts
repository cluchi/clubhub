export interface Course {
  id: string;
  clubId: string;
  name: string;
  description: string;
  instructor: {
    name: string;
    bio: string;
    experience: string;
    avatar: string;
  };
  schedule: {
    days: string[];
    time: string;
  }[];
  pricing: {
    dropIn: number;
    monthly: number;
    quarterly: number;
  };
  ageRange: string;
  skillLevel: string;
  spotsAvailable: number;
  totalSpots: number;
  category: string;
}

export const courses: Course[] = [
  {
    id: "1",
    clubId: "3",
    name: "Swimming Lessons",
    description:
      "Learn to swim with confidence in our beginner-friendly swimming lessons. Our experienced instructors will guide you through water safety and basic swimming techniques.",
    instructor: {
      name: "Coach Emma",
      bio: "Emma is a certified swimming instructor with 10 years of experience teaching all ages.",
      experience: "10+ years",
      avatar: "E",
    },
    schedule: [
      {
        days: ["Monday", "Wednesday"],
        time: "4:00 PM",
      },
      {
        days: ["Tuesday", "Thursday"],
        time: "5:00 PM",
      },
    ],
    pricing: {
      dropIn: 25,
      monthly: 120,
      quarterly: 300,
    },
    ageRange: "5-12 years",
    skillLevel: "Beginner",
    spotsAvailable: 5,
    totalSpots: 8,
    category: "Swimming",
  },
  {
    id: "2",
    clubId: "2",
    name: "Hip Hop Dance",
    description:
      "Learn the latest hip hop moves and choreography in this high-energy dance class. Perfect for beginners and intermediate dancers looking to improve their skills.",
    instructor: {
      name: "Ms. Jessica",
      bio: "Jessica is a professional dancer with experience in music videos and live performances.",
      experience: "8+ years",
      avatar: "J",
    },
    schedule: [
      {
        days: ["Monday", "Wednesday", "Friday"],
        time: "5:30 PM",
      },
    ],
    pricing: {
      dropIn: 20,
      monthly: 100,
      quarterly: 250,
    },
    ageRange: "10-16 years",
    skillLevel: "Beginner to Intermediate",
    spotsAvailable: 6,
    totalSpots: 12,
    category: "Dance",
  },
  {
    id: "3",
    clubId: "4",
    name: "Piano Basics",
    description:
      "Introduction to piano playing, covering fundamentals of music theory, note reading, and basic techniques. Suitable for complete beginners.",
    instructor: {
      name: "Professor James",
      bio: "James holds a Masters in Music Education and has taught piano for over 15 years.",
      experience: "15+ years",
      avatar: "J",
    },
    schedule: [
      {
        days: ["Tuesday", "Thursday"],
        time: "4:30 PM",
      },
      {
        days: ["Saturday"],
        time: "10:00 AM",
      },
    ],
    pricing: {
      dropIn: 30,
      monthly: 150,
      quarterly: 400,
    },
    ageRange: "7+ years",
    skillLevel: "Beginner",
    spotsAvailable: 3,
    totalSpots: 5,
    category: "Music",
  },
  {
    id: "4",
    clubId: "5",
    name: "Morning Yoga",
    description:
      "Start your day with energizing yoga poses and breathing exercises. This class focuses on flexibility, strength, and mindfulness.",
    instructor: {
      name: "Lisa Chen",
      bio: "Lisa is a certified yoga instructor with training in multiple yoga disciplines.",
      experience: "12+ years",
      avatar: "L",
    },
    schedule: [
      {
        days: ["Monday", "Wednesday", "Friday"],
        time: "7:00 AM",
      },
    ],
    pricing: {
      dropIn: 18,
      monthly: 90,
      quarterly: 240,
    },
    ageRange: "16+ years",
    skillLevel: "All Levels",
    spotsAvailable: 8,
    totalSpots: 15,
    category: "Yoga",
  },
  {
    id: "5",
    clubId: "2",
    name: "Contemporary Dance",
    description:
      "Explore the beauty of contemporary dance through modern movement techniques. This class combines elements of ballet, jazz, and modern dance.",
    instructor: {
      name: "Sarah Martinez",
      bio: "Sarah is a certified contemporary dance instructor with extensive training from Juilliard. She specializes in helping students find their unique movement style while building strength and flexibility.",
      experience: "15+ years",
      avatar: "S",
    },
    schedule: [
      {
        days: ["Monday", "Wednesday"],
        time: "7:00 PM",
      },
      {
        days: ["Friday"],
        time: "6:30 PM",
      },
    ],
    pricing: {
      dropIn: 25,
      monthly: 120,
      quarterly: 300,
    },
    ageRange: "16+ years",
    skillLevel: "Intermediate",
    spotsAvailable: 8,
    totalSpots: 12,
    category: "Dance",
  },
];
