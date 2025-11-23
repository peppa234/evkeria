import Link from "next/link";
import Image from "next/image";

const footerSections = [
  {
    title: "",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Story", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Opportunities",
    links: [
      { label: "Browse Opportunities", href: "/events" },
      { label: "Categories", href: "/events" },
      { label: "Upcoming Events", href: "/events" },
    ],
  },
  {
    title: "For Organizations",
    links: [
      { label: "Create an Account", href: "/auth/organization/signup" },
      { label: "Login", href: "/auth/organization/login" },
      { label: "Publish an Event", href: "/organization/events/create" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

const socialIcons = [
  { icon: "/frame-1.svg", alt: "Social media icon 1" },
  { icon: "/frame.svg", alt: "Social media icon 2" },
  { icon: "/frame-5.svg", alt: "Social media icon 3" },
];

export function Footer() {
  return (
    <footer className="bg-[#1e4e79] py-16">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        <div className="mb-12">
          <Image
            className="w-14 h-10"
            alt="Evkeria Logo"
            src="/img-1.png"
            width={56}
            height={40}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {footerSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {section.title && (
                <h3 className="font-outfit font-semibold text-white text-xl mb-6">
                  {section.title}
                </h3>
              )}
              <nav className="flex flex-col gap-4">
                {section.links.map((link, linkIndex) => (
                  <Link
                    key={linkIndex}
                    href={link.href}
                    className="font-outfit font-normal text-white text-base hover:text-[#9cd0ff] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        <div className="border-t border-white/20 mb-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-outfit font-normal text-white text-base">
            © 2025 Evkeria. All rights reserved.
          </p>

          <div className="flex gap-8">
            {socialIcons.map((social, index) => (
              <a
                key={index}
                href="#"
                className="w-6 h-6 hover:opacity-70 transition-opacity duration-200"
              >
                <Image
                  className="w-full h-full"
                  alt={social.alt}
                  src={social.icon}
                  width={24}
                  height={24}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

