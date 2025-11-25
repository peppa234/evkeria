"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";

const featuredOpportunities = [
  {
    id: 1,
    image: "/image.png",
    badge: "Workshop",
    badgeColor: "bg-[#f7c948]",
    title: "AI & Machine Learning Workshop",
    organization: "Tech Innovation Hub",
    location: "Algiers",
    date: "Dec 15, 2024",
    hasOverlay: true,
  },
  {
    id: 2,
    image: "/image-1.png",
    badge: "Workshop",
    badgeColor: "bg-[#f7c948]",
    title: "AI & Machine Learning Workshop",
    organization: "Tech Innovation Hub",
    location: "Algiers",
    date: "Dec 15, 2024",
    hasOverlay: false,
  },
  {
    id: 3,
    image: "/image-2.png",
    badge: "Workshop",
    badgeColor: "bg-[#f7c948]",
    title: "AI & Machine Learning Workshop",
    organization: "Tech Innovation Hub",
    location: "Algiers",
    date: "Dec 15, 2024",
    hasOverlay: true,
  },
];

const whyEvkeriaFeatures = [
  {
    id: 1,
    icon: "/frame-11.svg",
    title: "Centralized Opportunities",
    description:
      "Find volunteering, events, trainings, and programs—all in one place.",
  },
  {
    id: 2,
    icon: "/frame-6.svg",
    title: "Smart Filters",
    description:
      "Search by category, wilaya, date, or type to find exactly what you need.",
  },
  {
    id: 3,
    icon: "/frame-2.svg",
    title: "Easy to Use",
    description:
      "A clean, modern interface designed for students and young professionals.",
  },
  {
    id: 4,
    icon: "/frame-9.svg",
    title: "Trusted Organizations",
    description:
      "We partner with verified groups to ensure high-quality opportunities.",
  },
];

export default function HomePage() {
  return (
    <div className="bg-white w-full overflow-x-hidden">
      <section className="relative min-h-screen overflow-hidden">
        <Image
          className="absolute inset-0 w-full h-full object-cover"
          alt="Hero background"
          src="/chatgpt-image-nov-17--2025--09-23-07-pm-1.png"
          fill
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(55,144,223,0.43)] to-[rgba(30,78,121,0.43)]" />

        <div className="absolute -left-1/4 top-3/4 w-[800px] h-[400px] bg-[#4fa3e3a1] rounded-full blur-[150px] opacity-60" />

        <div className="relative z-10 flex items-center min-h-screen px-16 lg:px-32">
          <div className="max-w-3xl">
            <h1 className="font-outfit font-semibold text-7xl lg:text-8xl leading-tight mb-8">
              <span className="text-white">
                Discover, Network <br />
                &amp;{" "}
              </span>
              <span className="text-[#9cd0ff]">Innovate</span>
              <span className="text-white">.</span>
            </h1>

            <p className="font-outfit font-normal text-white text-3xl lg:text-4xl leading-relaxed mb-12">
              Explore volunteering, events, trainings, and exchange programs across
              Algeria — all in one place.
            </p>

            <div className="flex gap-4">
              <Link href="/events">
                <Button className="px-8 py-6 h-auto rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 shadow-lg font-outfit font-medium text-white text-xl hover:bg-[#1e4e79]/90 hover:border-[#1e4e79] hover:backdrop-blur-none transition-all duration-200">
                  Browse Events
                </Button>
              </Link>

              <Link href="/auth/signup">
                <Button className="px-8 py-6 h-auto rounded-2xl bg-gradient-to-r from-[#4fa3e3] to-[#6fb3e6] font-outfit font-medium text-white text-xl hover:shadow-xl hover:scale-105 transition-all duration-200">
                  Register Now
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full pointer-events-none z-10">
          <svg
            className="w-full h-auto block"
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,70 Q360,15 720,45 T1440,35 L1440,100 L0,100 Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8 lg:px-16">
          <h2 className="font-outfit font-semibold text-[#1e4e79] text-5xl lg:text-6xl text-center mb-6">
            Featured Opportunities
          </h2>

          <p className="font-outfit font-normal text-[#4fa3e3] text-xl lg:text-2xl text-center mb-16">
            Handpicked programs and events happening now.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredOpportunities.map((opportunity) => (
              <Card
                key={opportunity.id}
                className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="relative h-52">
                    <Image
                      className="w-full h-full object-cover"
                      alt={opportunity.title}
                      src={opportunity.image}
                      fill
                    />
                    {opportunity.hasOverlay && (
                      <div className="absolute inset-0 bg-black/25" />
                    )}
                    <Badge
                      className={`absolute top-4 left-4 ${opportunity.badgeColor} font-outfit font-medium text-white text-sm px-3 py-1`}
                    >
                      {opportunity.badge}
                    </Badge>
                  </div>

                  <div className="p-6">
                    <h3 className="font-outfit font-semibold text-[#1e4e79] text-2xl leading-tight mb-6">
                      {opportunity.title}
                    </h3>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-[#4fa3e3] rounded-full" />
                      <p className="font-outfit font-medium text-[#4fa3e3] text-base">
                        {opportunity.organization}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 mb-4">
                      <div className="flex items-center gap-2">
                        <Image className="w-4 h-4" alt="Location" src="/frame-3.svg" width={16} height={16} />
                        <span className="font-outfit font-normal text-[#1e4e79] text-sm">
                          {opportunity.location}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Image className="w-4 h-4" alt="Date" src="/frame-4.svg" width={16} height={16} />
                        <span className="font-outfit font-normal text-[#1e4e79] text-sm">
                          {opportunity.date}
                        </span>
                      </div>
                    </div>

                    <Link href={`/events/${opportunity.id}`}>
                      <Button className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#4fa3e3] to-[#6fb3e6] font-outfit font-medium text-white text-base hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-32 lg:py-40 bg-[#1e4e79] overflow-hidden">
        <div className="absolute -top-32 left-0 right-0 h-64 bg-white rounded-[50%] transform -translate-y-1/2" />

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-1/4 top-1/2 w-[800px] h-[400px] bg-[#4fa3e385] rounded-full blur-[150px] opacity-60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center min-h-[600px]">
            <div className="relative flex justify-center lg:justify-start">
              <div className="relative w-full max-w-[500px] lg:max-w-[600px]">
                <Image
                  className="relative z-10 w-full h-auto object-cover rounded-full"
                  alt="Evkeria community"
                  src="/what-is-evkeria-img.png"
                  width={600}
                  height={600}
                />
                <div className="absolute inset-0 bg-[#1e4e7936] rounded-full" />
                <div className="absolute top-1/2 right-0 transform translate-x-1/4 -translate-y-1/2 w-40 h-44 rounded-full backdrop-blur-sm backdrop-brightness-110 bg-gradient-to-b from-[rgba(79,163,227,0.41)] to-[rgba(44,90,125,0.41)] border border-white/20 shadow-inner" />
              </div>
            </div>

            <div className="text-white">
              <h2 className="font-outfit font-semibold text-6xl lg:text-7xl mb-12">
                What is Evkeria?
              </h2>

              <div className="font-outfit text-3xl lg:text-4xl leading-relaxed space-y-8">
                <p>
                  <span className="font-semibold">Evkeria</span> is a platform that helps{" "}
                  <span className="font-semibold">students</span> and{" "}
                  <span className="font-semibold">young professionals</span> in Algeria find real opportunities.
                </p>

                <p>
                  From <span className="font-semibold text-[#6eb2e6]">volunteering</span> to events and trainings, everything is gathered in one simple, accessible platform to support youth growth and development.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-32 left-0 right-0 h-64 bg-white rounded-[50%] transform translate-y-1/2" />
      </section>

      <section className="relative py-32 lg:py-40 bg-white overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#8cc2eb] rounded-full blur-[120px] opacity-30 pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#8cc2eb] rounded-full blur-[120px] opacity-30 pointer-events-none" />
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-[#4fa3e3] rounded-full blur-[100px] opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-80 h-80 bg-[#4fa3e3] rounded-full blur-[100px] opacity-20 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16">
          <h2 className="font-outfit font-semibold text-[#1e4e79] text-5xl lg:text-6xl text-center mb-6">
            Why Evkeria?
          </h2>

          <p className="font-outfit font-normal text-[#4fa3e3] text-xl lg:text-2xl text-center max-w-2xl mx-auto mb-16">
            A platform built to help you grow, connect, and discover real
            opportunities.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyEvkeriaFeatures.map((feature) => (
              <Card
                key={feature.id}
                className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <CardContent className="flex flex-col items-center p-8">
                  <div className="w-16 h-16 bg-[#4fa3e3] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Image className="w-8 h-8" alt={feature.title} src={feature.icon} width={32} height={32} />
                  </div>

                  <h3 className="font-outfit font-semibold text-[#1e4e79] text-xl text-center leading-tight mb-4">
                    {feature.title}
                  </h3>

                  <p className="font-outfit font-normal text-[#1e4e79] text-sm text-center leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 bg-white overflow-hidden">
        <div className="absolute -right-1/4 top-1/2 w-[800px] h-[400px] bg-[#4fa3e370] rounded-full blur-[150px] opacity-60" />
        
        <Image
          className="absolute top-20 right-32 w-14 h-14 opacity-20"
          alt="Decorative icon"
          src="/frame-7.svg"
          width={56}
          height={56}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-8 lg:px-16 text-center">
          <h2 className="font-outfit font-semibold text-[#1e4e79] text-5xl lg:text-6xl mb-6">
            Are You an Organization?
          </h2>

          <p className="font-outfit font-normal text-[#6eb2e6] text-xl lg:text-2xl mb-12 max-w-3xl mx-auto">
            Share your events and reach thousands of motivated students and young
            professionals across Algeria.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link href="/auth/organization/signup">
              <Button className="px-8 py-6 h-auto bg-[#1e4e79] rounded-full font-outfit font-medium text-white text-lg hover:bg-[#2c5f8f] hover:shadow-xl transition-all duration-200">
                Create Organization Account
              </Button>
            </Link>

            <Button
              variant = "outline"
              className="px-8 py-6 h-auto rounded-full border-2 border-[#1e4e79] font-outfit font-medium text-[#1e4e79] text-lg bg-transparent hover:bg-[#1e4e79] hover:text-white transition-all duration-200"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

