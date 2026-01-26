"use client";

import { useEffect, useState } from "react";
import { FileTextIcon, PlusIcon, UserCircleIcon, TrendingUpIcon, Loader2 } from "lucide-react";
import { EventCard } from "@components/Organization/EventCard";
import { QuickActionButton } from "@components/Organization/QuickActionButton";
import { Sidebar, SIDEBAR_WIDTH } from "@components/Organization/Sidebar";
import { StatCard } from "@components/Organization/StatCard";
import { useOrganizationAuth } from "@context/OrganizationAuthContext";
import { EventListSkeleton } from "@components/ui/skeleton";

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

interface OrganizationEvent {
  id: string;
  title: string;
  imageUrl?: string;
  date: string;
  status: string;
  createdAt?: string;
}

export default function OrganizationDashboardPage() {
  const { organization, isLoading: authLoading } = useOrganizationAuth();
  const [events, setEvents] = useState<OrganizationEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<StatData[]>([]);

  useEffect(() => {
    if (organization?.id) {
      fetchEvents();
    }
  }, [organization?.id]);

  const fetchEvents = async () => {
    if (!organization?.id) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/organizations/${organization.id}/events`);
      if (res.ok) {
        const data = await res.json();
        // Standardized format: { success: true, data: { events: [...] } }
        if (data.success && data.data?.events) {
          const fetchedEvents = data.data.events;
          setEvents(fetchedEvents);
          
          // Calculate stats
          const total = fetchedEvents.length;
          const active = fetchedEvents.filter((e: OrganizationEvent) => e.status === 'Active').length;
          const upcoming = fetchedEvents.filter((e: OrganizationEvent) => {
            if (e.status === 'Upcoming') return true;
            // Also check if event date is in next 30 days
            if (e.date) {
              const eventDate = new Date(e.date);
              const now = new Date();
              const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
              return eventDate >= now && eventDate <= thirtyDaysFromNow;
            }
            return false;
          }).length;
          const past = fetchedEvents.filter((e: OrganizationEvent) => e.status === 'Past').length;

          setStats([
            {
              icon: "/frame-2.svg",
              bgColor: "bg-[#4fa3e3]",
              value: total.toString(),
              label: "Total Events",
              subtext: "All time",
              subtextColor: "text-gray-600",
            },
            {
              icon: "/frame-9.svg",
              bgColor: "bg-emerald-500",
              value: active.toString(),
              label: "Active Events",
              subtext: "Currently open",
              subtextColor: "text-[#4fa3e3]",
            },
            {
              icon: "/frame-8.svg",
              bgColor: "bg-violet-500",
              value: upcoming.toString(),
              label: "Upcoming Events",
              subtext: "Next 30 days",
              subtextColor: "text-violet-600",
            },
            {
              icon: "/frame-6.svg",
              bgColor: "bg-amber-400",
              value: past.toString(),
              label: "Past Events",
              subtext: "Completed",
              subtextColor: "text-gray-500",
            },
          ]);
        }
      }
    } catch (err) {
      // Error fetching events
    } finally {
      setIsLoading(false);
    }
  };

  // Get latest 3 events
  const latestEvents: EventData[] = events
    .sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime())
    .slice(0, 3)
    .map((event) => ({
      image: event.imageUrl || "/image.png",
      title: event.title,
      date: new Date(event.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    }));

  if (authLoading || isLoading) {
    return (
      <div className="bg-[#f8fafc] flex min-h-screen">
        <Sidebar />
        <main className="flex-1 min-h-screen px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 pt-28 md:pt-8 md:ml-[280px]">
          <div className="max-w-6xl mx-auto flex items-center justify-center min-h-screen">
            <Loader2 className="w-8 h-8 animate-spin text-[#4fa3e3]" />
          </div>
        </main>
      </div>
    );
  }
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
            {stats.map((stat) => (
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
              {latestEvents.length > 0 ? (
                latestEvents.map((event, index) => (
                  <EventCard key={`${event.title}-${index}`} {...event} />
                ))
              ) : (
                <p className="text-gray-500 text-sm py-4 text-center">No events yet</p>
              )}
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
