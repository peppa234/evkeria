export interface Organization {
  id: number;
  name: string;
  email: string;
  logo?: string;
  description: string;
  eventsCount: number;
}

export const dummyOrganizations: Organization[] = [
  {
    id: 1,
    name: "Tech Innovation Hub",
    email: "contact@techhub.dz",
    logo: "/img.png",
    description: "Leading technology innovation center in Algeria",
    eventsCount: 5,
  },
];

