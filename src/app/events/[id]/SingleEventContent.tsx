import Image from "next/image";
import { Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Event } from "@data/dummy-events";
import { EventCard } from "@components/EventCard/EventCard";

type Props = {
  event?: Event;
};

export default function SingleEventContent({ event }: Props) {
  const organizer = {
    name: "TechHub Algeria",
    description:
      "Leading technology community in Algeria, dedicated to fostering innovation and connecting tech professionals across the country. We organize events, workshops, and networking opportunities to advance the local tech ecosystem.",
    logo: "/img.png",
  };

  const relatedEvents: Event[] = [
    {
      id: 101,
      title: "Startup Pitch Competition",
      description:
        "Present your startup idea to investors and win funding. Open to all entrepreneurs with innovative business concepts.",
      image: "/image-1.png",
      badge: "Competition",
      badgeColor: "bg-[#f7c948]",
      organization: "Innovation Hub",
      location: "Constantine",
      date: "April 5, 2025",
      category: "Competition",
      hasOverlay: false,
    },
    {
      id: 102,
      title: "Youth Leadership Workshop",
      description: "Develop essential leadership skills through interactive sessions, team building activities, and mentorship opportunities.",
      image: "/chatgpt-image-nov-17--2025--09-23-07-pm-1.png",
      badge: "Workshop",
      badgeColor: "bg-[#f7c948]",
      organization: "Future Leaders Algeria",
      location: "Annaba",
      date: "April 12, 2025",
      category: "Workshop",
      hasOverlay: false,
    },
    {
      id: 103,
      title: "Amazigh Cultural Festival",
      description: "Celebrate Amazigh heritage through traditional music, dance, crafts, and cuisine. Family-friendly event with activities for all ages.",
      image: "/image.png",
      badge: "Cultural Event",
      badgeColor: "bg-[#f7c948]",
      organization: "Cultural Heritage Society",
      location: "Tizi Ouzou",
      date: "April 20, 2025",
      category: "Cultural Event",
      hasOverlay: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-16 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* Main content */}
      <main className="lg:col-span-2 space-y-8">
        <section aria-labelledby="about-title" className="bg-white rounded-2xl shadow p-6">
          <h2 id="about-title" className="text-2xl font-outfit font-semibold text-[#1e1e1e] mb-4">
            About this Event
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Join industry leaders and innovators for a day of cutting-edge technology discussions, networking, and hands-on workshops. The Algeria Tech Summit 2025 brings together the brightest minds in technology to explore the future of innovation in Algeria and beyond.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            This premier technology conference will feature keynote presentations from renowned tech leaders, interactive panel discussions on emerging technologies, and practical workshops designed to enhance your technical skills. Whether you're a seasoned professional or just starting your tech journey, this event offers valuable insights and networking opportunities.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Discover the latest trends in artificial intelligence, blockchain, cybersecurity, and digital transformation. Learn from successful entrepreneurs who have built thriving tech companies and gain practical knowledge that you can apply immediately in your career or business.
          </p>
          </section>

        <section aria-labelledby="learn-title" className="bg-white rounded-2xl shadow p-6">
          <h2 id="learn-title" className="text-2xl font-outfit font-semibold text-[#1e1e1e] mb-4">
            What You Will Learn
          </h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Latest trends in AI and ML</li>
            <li>Blockchain technology and cryptocurrency implementation strategies</li>
            <li>Cybersecurity best practices for modern businesses</li>
            <li>Digital transformation strategies for traditional industries</li>
            <li>Startup funding and investment opportunities</li>
            <li>Networking strategies to build meaningful professional relationships</li>
          </ul>
        </section>

        <section aria-labelledby="join-title" className="bg-white rounded-2xl shadow p-6">
          <h2 id="join-title" className="text-2xl font-outfit font-semibold text-[#1e1e1e] mb-4">
            Who Can Join
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            This event is open to technology professionals, entrepreneurs, students, and anyone interested in the future of technology in Algeria. Whether you're a software developer, product manager, startup founder, or tech enthusiast, you'll find valuable content and networking opportunities.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We welcome participants from all experience levels — from recent graduates to seasoned industry veterans. The diverse mix of attendees creates an ideal environment for knowledge sharing and collaboration.
          </p>
        </section>

        <section aria-labelledby="requirements-title" className="bg-white rounded-2xl shadow p-6">
          <h2 id="requirements-title" className="text-2xl font-outfit font-semibold text-[#1e1e1e] mb-4">
            Requirements
          </h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Valid government-issued ID for registration</li>
            <li>Laptop or tablet for workshop participation (recommended)</li>
            <li>Business cards for networking (optional but recommended)</li>
            <li>Professional attire suggested</li>
          </ul>
        </section>

        <section aria-labelledby="organized-title" className="bg-white rounded-2xl shadow p-6">
          <h2 id="organized-title" className="text-2xl font-outfit font-semibold text-[#1e1e1e] mb-4">
            Organized By
          </h2>
          <article className="flex items-start gap-4">
            <div className="w-16 h-16 bg-[#f0f8ff] rounded-xl flex items-center justify-center">
              <Image src={organizer.logo} alt="Organizer logo" width={40} height={40} className="object-contain" />
            </div>
            <div className="flex-1">
              <h3 className="font-outfit font-semibold text-[#1e1e1e]">{organizer.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{organizer.description}</p>
              <Button variant="outline" className="px-3 py-2 h-9">View Organization</Button>
            </div>
          </article>
        </section>

        {/* You Might Also Like Section (moved under Organized By) */}
        <section className="mt-10 bg-white rounded-2xl shadow p-6">
          <h3 className="font-outfit font-semibold text-[#1e4e79] text-xl mb-4">You Might Also Like</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedEvents.map((ev) => (
              <EventCard key={ev.id} event={ev} />
            ))}
          </div>
        </section>
      </main>

      {/* Sticky right sidebar */}
      <aside className="lg:col-span-1">
        <div className="sticky top-24 space-y-6">
          <Card className="rounded-2xl shadow-lg overflow-hidden">
            <CardContent className="p-6 text-center">
              <div className="text-[#1e1e1e] font-outfit font-bold text-3xl tracking-tight">March</div>
              <div className="text-[#1e4e79] font-outfit font-bold text-6xl leading-none">15</div>
              <div className="text-gray-600 text-sm">2025</div>

              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                <Calendar size={16} />
                <span>9:00 AM - 6:00 PM</span>
              </div>
              <div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-600">
                <MapPin size={16} />
                <span>Convention Center Algiers</span>
              </div>

              <div className="mt-4 text-sm text-gray-700 flex items-center justify-center gap-2">
                <Users size={16} />
                <span>250 attending</span>
              </div>

              <Button className="mt-6 w-full h-12 bg-[#f7c948] text-black font-outfit font-semibold">Apply Now</Button>
            </CardContent>
          </Card>
        </div>
      </aside>
    </div>
  );
}
