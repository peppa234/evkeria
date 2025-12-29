"use client";

import { FileTextIcon, PlusIcon, UserCircleIcon, TrendingUpIcon } from "lucide-react";
import { EventCard } from "@components/Organization/EventCard";
import { QuickActionButton } from "@components/Organization/QuickActionButton";
import { Sidebar, SIDEBAR_WIDTH } from "@components/Organization/Sidebar";
import { StatCard } from "@components/Organization/StatCard";

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
    subtextColor: "text-emerald-600",
  },
  {
    icon: "/frame-9.svg",
    bgColor: "bg-emerald-500",
    value: "8",
    label: "Active Events",
    subtext: "Currently open",
    subtextColor: "text-[#4fa3e3]",
  },
  {
    icon: "/frame-8.svg",
    bgColor: "bg-violet-500",
    value: "12",
    label: "Upcoming Events",
    subtext: "Next 30 days",
    subtextColor: "text-violet-600",
  },
  {
    icon: "/frame-6.svg",
    bgColor: "bg-amber-400",
    value: "27",
    label: "Past Events",
    subtext: "Completed",
    subtextColor: "text-gray-500",
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
    <div className="bg-[#f8fafc] flex min-h-screen">
      <Sidebar />
      <main className="flex-1 min-h-screen px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 pt-28 md:pt-8 md:ml-[280px]">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
        <header className="mb-8">
          <h1 className="font-outfit font-bold text-[#0e1f35] text-2xl sm:text-3xl">
            Dashboard
          </h1>
          <p className="font-outfit text-gray-500 text-sm mt-1">
            Welcome back! Here's what's happening with your events.
          </p>
        </header>

        {/* Stats Grid */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUpIcon className="w-5 h-5 text-[#4fa3e3]" />
            <h2 className="font-outfit font-semibold text-[#0e1f35] text-lg">
              Overview
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsData.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Latest Events - Takes 2 columns */}
          <section className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-outfit font-semibold text-[#0e1f35] text-lg">
                Latest Events
              </h3>
              <a 
                href="/organization/events" 
                className="font-outfit text-sm text-[#4fa3e3] hover:text-[#1e4e79] transition-colors"
              >
                View all →
              </a>
            </div>
            <div className="divide-y divide-gray-100">
              {eventsData.map((event, index) => (
                <EventCard key={`${event.title}-${index}`} {...event} />
              ))}
            </div>
          </section>

          {/* Quick Actions - Takes 1 column */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-outfit font-semibold text-[#0e1f35] text-lg mb-5">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <QuickActionButton
                href="/organization/events"
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
                href="/organization/profile"
                icon={UserCircleIcon}
                label="Edit Profile"
                variant="outline"
              />
            </div>
          </section>
        </div>
        </div>
      </main>
    </div>
  );
}
