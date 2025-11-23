export interface Event {
  id: number;
  title: string;
  description: string;
  image: string;
  badge: string;
  badgeColor: string;
  organization: string;
  location: string;
  date: string;
  category: string;
  hasOverlay?: boolean;
}

export const dummyEvents: Event[] = [
  {
    id: 1,
    title: "AI & Machine Learning Workshop",
    description: "Learn the fundamentals of AI and ML in this comprehensive workshop.",
    image: "/image.png",
    badge: "Workshop",
    badgeColor: "bg-[#f7c948]",
    organization: "Tech Innovation Hub",
    location: "Algiers",
    date: "Dec 15, 2024",
    category: "Workshop",
    hasOverlay: true,
  },
  {
    id: 2,
    title: "AI & Machine Learning Workshop",
    description: "Learn the fundamentals of AI and ML in this comprehensive workshop.",
    image: "/image-1.png",
    badge: "Workshop",
    badgeColor: "bg-[#f7c948]",
    organization: "Tech Innovation Hub",
    location: "Algiers",
    date: "Dec 15, 2024",
    category: "Workshop",
    hasOverlay: false,
  },
  {
    id: 3,
    title: "AI & Machine Learning Workshop",
    description: "Learn the fundamentals of AI and ML in this comprehensive workshop.",
    image: "/image-2.png",
    badge: "Workshop",
    badgeColor: "bg-[#f7c948]",
    organization: "Tech Innovation Hub",
    location: "Algiers",
    date: "Dec 15, 2024",
    category: "Workshop",
    hasOverlay: true,
  },
];

