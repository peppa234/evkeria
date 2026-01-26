"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@components/ui/button";


const EmailIcon = () => (
  <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default function AboutPage() {
  const contactInfo = [
    {
      icon: EmailIcon,
      label: "Email",
      value: "contact@evkeria.dz",
      href: "mailto:contact@evkeria.dz",
    },
    {
      icon: PhoneIcon,
      label: "Phone",
      value: "+213 555 123 456",
      href: "tel:+213555123456",
    },
    {
      icon: LocationIcon,
      label: "Location",
      value: "Algiers, Algeria",
      href: null,
    },
  ];

  return (
    <div className="bg-white w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="hero-section relative min-h-screen overflow-hidden">
        <Image
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          alt="About Us background"
          src="/AboutUsBgImg.jpg"
          fill
          priority
          sizes="100vw"
          quality={90}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(55,144,223,0.43)] to-[rgba(30,78,121,0.43)] transition-opacity duration-500" />

        {/* Blur effect - contained within hero */}
        <div className="absolute -left-1/4 top-3/4 w-[800px] h-[400px] bg-[#4fa3e3a1] rounded-full blur-[150px] opacity-60 animate-pulse pointer-events-none" />

        <div className="hero-content relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 md:px-8 lg:px-16 pt-[90px] sm:pt-[100px] lg:pt-0">
          <div className="max-w-3xl w-full text-center animate-fade-in">
            <h1 className="hero-title font-outfit font-semibold text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-[110px] leading-tight mb-4 xs:mb-6 sm:mb-8 animate-slide-up text-white">
              About Us
            </h1>

            <p className="hero-subtitle font-outfit font-normal text-white text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-[42px] leading-relaxed animate-slide-up delay-100">
              Learn more about Evkeria and our mission to connect youth with
              opportunities.
            </p>
          </div>
        </div>

        <div className="absolute -bottom-px left-0 w-full pointer-events-none z-10">
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

      {/* Our Story Section */}
      <section className="relative z-10 py-16 sm:py-20 lg:py-28 bg-white isolate">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 md:gap-20 items-center">
            {/* Text Content */}
            <div className="order-2 lg:order-1">
              <h2 className="font-outfit font-semibold text-[#1e4e79] text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 sm:mb-8">
                Our Story
              </h2>

              <div className="font-outfit font-normal text-[#1e4e79]/80 text-base sm:text-lg md:text-xl leading-relaxed space-y-5 sm:space-y-6">
                <p>
                  Evkeria was created with a simple mission: to help Algerian youth discover real opportunities.
                </p>

                <p>
                  We bring together volunteering opportunities, workshops, training programs, and exchange initiatives—all in one accessible platform.
                </p>

                <p>
                  Whether you're looking to develop new skills, contribute to your community, or grow your professional network, Evkeria makes it easy to find exactly what you need.
                </p>

                <p>
                  We partner with trusted organizations across Algeria to ensure every opportunity is high-quality and verified.
                </p>
              </div>
            </div>

           
            <div className="relative order-1 lg:order-2 flex justify-center">
              <div className="relative w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] md:w-[420px] md:h-[420px] lg:w-[460px] lg:h-[460px]">
                <Image
                  className="relative z-10 w-full h-full object-cover rounded-full"
                  alt="Evkeria community"
                  src="/what-is-evkeria-img.png"
                  width={460}
                  height={460}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get in Touch Section */}
      <section className="relative z-10 py-16 sm:py-20 lg:py-24 bg-[#f8fafc] isolate">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
          <h2 className="font-outfit font-semibold text-[#1e4e79] text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center mb-4 sm:mb-6">
            Get in Touch
          </h2>

          <p className="font-outfit font-normal text-[#4fa3e3] text-base sm:text-lg md:text-xl text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            Have questions? We'd love to hear from you. Reach out to our team.
          </p>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {contactInfo.map((contact, index) => {
              const Icon = contact.icon;
              const content = (
                <div
                  className="bg-white rounded-2xl p-6 sm:p-8 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                >
                  {/* Icon Circle */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-5 rounded-full bg-[#4fa3e3] flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                    <Icon />
                  </div>
                  
                  <h3 className="font-outfit font-semibold text-[#1e4e79] text-lg sm:text-xl mb-2">
                    {contact.label}
                  </h3>
                  <p className="font-outfit font-normal text-[#4fa3e3] text-sm sm:text-base">
                    {contact.value}
                  </p>
                </div>
              );

              return contact.href ? (
                <a key={index} href={contact.href} className="block">
                  {content}
                </a>
              ) : (
                <div key={index}>{content}</div>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link href="/events">
              <Button className="px-8 sm:px-10 py-4 sm:py-6 h-auto rounded-full bg-[#4fa3e3] font-outfit font-medium text-white text-base sm:text-lg hover:bg-[#3d8bc9] hover:shadow-xl hover:scale-105 transition-all duration-300">
                Explore Opportunities
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
