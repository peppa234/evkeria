export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  skills: string[];
  interests: string[];
  savedOpportunities: number[];
}

export const dummyUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    avatar: "/group-13.png",
    skills: ["React", "TypeScript", "Node.js"],
    interests: ["Technology", "Education", "Volunteering"],
    savedOpportunities: [1, 2],
  },
];

