import Image from "next/image";
import { cn } from "@lib/utils";

interface StatCardProps {
  icon: string;
  bgColor: string;
  value: string;
  label: string;
  subtext: string;
  subtextColor: string;
}

export function StatCard({
  icon,
  bgColor,
  value,
  label,
  subtext,
  subtextColor,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 p-5">
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            bgColor
          )}
        >
          <Image
            className="w-6 h-6"
            alt={`${label} icon`}
            src={icon}
            width={24}
            height={24}
          />
        </div>
      </div>
      <div className="font-outfit font-bold text-[#0e1f35] text-3xl leading-none mb-1">
        {value}
      </div>
      <div className="font-outfit font-medium text-gray-500 text-sm mb-2">
        {label}
      </div>
      <div className={cn("font-outfit font-medium text-xs", subtextColor)}>
        {subtext}
      </div>
    </div>
  );
}
