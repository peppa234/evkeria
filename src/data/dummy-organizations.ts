export interface Organization {
  id: number;
  name: string;
  type: string; // e.g., "Algeria Organization", "Tech Community"
  email: string;
  websiteUrl?: string; // Full URL with https://
  logo?: string;
  description: string;
  eventsCount: number;
  fields: string[]; // e.g., ["Digital Marketing", "AI", "Cybersecurity"]
  opportunities: string[]; // e.g., ["Internships", "Workshops", "Mentorship"]
}

export const dummyOrganizations: Organization[] = [
  {
    id: 1,
    name: "Algeria 2.0",
    type: "Algeria Organization",
    email: "algeria2.0@gmail.com",
    websiteUrl: "https://algeria20.com/",
    logo: "/imageorg.svg",
    description:
      "Algeria 2.0 is a pioneering tech community dedicated to empowering Algeria's digital generation through events and summaries. By bringing together experts in AI, digital marketing, software development, cybersecurity, and cloud, we connect people with the skills, mentors, and opportunities they need to grow in today's fast-changing digital world.",
    eventsCount: 5,
    fields: [
      "Digital Marketing",
      "AI & Machine Learning",
      "Software Development",
    ],
    opportunities: ["Internships", "Workshops", "Mentorship Programs"],
  },
  {
    id: 2,
    name: "Tech Innovation Hub",
    type: "Technology Hub",
    email: "contact@techhub.dz",
    websiteUrl: "https://techhub.dz",
    logo: "/logo_white.svg",
    description: "Leading technology innovation center in Algeria",
    eventsCount: 12,
    fields: ["Cybersecurity", "Cloud Computing", "Data Science"],
    opportunities: ["Job Placements", "Training", "Networking Events"],
  },
];
