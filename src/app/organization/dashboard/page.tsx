"use client";

import { FileTextIcon, PlusIcon, UserCircleIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Card, CardContent } from "@components/ui/card";
import { EventCard } from "@components/Organization/EventCard";
import { QuickActionButton } from "@components/Organization/QuickActionButton";
import { Sidebar, SIDEBAR_WIDTH } from "@components/Organization/Sidebar";
import { StatCard } from "@components/Organization/StatCard";
import { Tabs, TabsList, TabsTrigger } from "@components/ui/tabs";

interface StatData {
  icon: string;
  bgColor: string;
  value: string;
  label: string;
  subtext: string;
  subtextColor: string;
}

interface EventData {
  image: string;
  title: string;
  date: string;
}

const statsData: StatData[] = [
  {
    icon: "/frame-2.svg",
    bgColor: "bg-[#4fa3e3]",
    value: "47",
    label: "Total Events",
    subtext: "+15% from last month",
    subtextColor: "text-[#1e4e79]",
  },
  {
    icon: "/frame-9.svg",
    bgColor: "bg-emerald-500",
    value: "8",
    label: "Active Events",
    subtext: "Currently open",
    subtextColor: "text-[#1e4e79]",
  },
  {
    icon: "/frame-8.svg",
    bgColor: "bg-violet-500",
    value: "12",
    label: "Upcoming Events",
    subtext: "Next 30 days",
    subtextColor: "text-[#1e4e79]",
  },
  {
    icon: "/frame-6.svg",
    bgColor: "bg-[#f7c948]",
    value: "27",
    label: "Past Events",
    subtext: "Completed",
    subtextColor: "text-[#1e4e79]",
  },
];

const eventsData: EventData[] = [
  {
    image: "/rectangle-2.png",
    title: "AI & Machine Learning Summit",
    date: "March 15, 2024",
  },
  {
    image: "/rectangle-2.png",
    title: "Startup Pitch Competition",
    date: "March 22, 2024",
  },
  {
    image: "/rectangle-2.png",
    title: "Digital Marketing Workshop",
    date: "April 5, 2024",
  },
];

export default function OrganizationDashboardPage() {
  return (
    <div className="bg-white flex min-h-screen">
      <Sidebar />
      <main
        className="flex-1 p-4 sm:p-6 md:p-8 md:ml-[280px] pt-16 md:pt-8"
      >
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-outfit font-bold text-gray-800 text-2xl sm:text-3xl lg:text-[32px] leading-9">
              Organization Dashboard
            </h1>
            <p className="font-outfit font-normal text-[#5d6472] text-sm leading-[19.5px] mt-2">
              Comprehensive insights and statistics
            </p>
          </div>
          <Avatar className="w-12 h-12 sm:w-[51px] sm:h-[51px] shrink-0">
            <AvatarImage src="/group-13.png" alt="User avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </header>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="bg-transparent border-b border-gray-200 rounded-none h-auto p-0 w-full justify-start">
            <TabsTrigger
              value="overview"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#1e4e79] data-[state=active]:bg-transparent data-[state=active]:shadow-none font-outfit font-semibold text-base data-[state=active]:text-[#1e4e79] text-gray-500 pb-3"
            >
              Overview
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <section className="mb-8">
          <h2 className="font-outfit font-bold text-[#0e1f35] text-xl sm:text-2xl leading-9 mb-6">
            Dashboard Overview
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {statsData.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          <Card className="bg-white rounded-[18px] border shadow-sm mb-8">
            <CardContent className="p-6 sm:p-8">
              <h3 className="font-outfit font-bold text-[#0e1f35] text-lg sm:text-xl leading-[30px] mb-6">
                Latest Events
              </h3>
              <div className="space-y-3">
                {eventsData.map((event, index) => (
                  <EventCard key={`${event.title}-${index}`} {...event} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-[18px] border shadow-sm">
            <CardContent className="p-6 sm:p-8">
              <h3 className="font-outfit font-bold text-[#0e1f35] text-lg sm:text-xl leading-[30px] mb-6">
                Quick Actions
              </h3>
              <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                <QuickActionButton
                  href="/organization/events/create"
                  icon={PlusIcon}
                  label="Create New Event"
                  variant="primary"
                />
                <QuickActionButton
                  href="/organization/events"
                  icon={FileTextIcon}
                  label="Manage My Events"
                  variant="outline"
                />
                <QuickActionButton
                  href="/profile/edit"
                  icon={UserCircleIcon}
                  label="Edit Profile"
                  variant="outline"
                />
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
