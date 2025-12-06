import Image from "next/image";
import { Card, CardContent } from "@components/ui/card";
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
    <Card className="bg-[#f0f7ff] rounded-[18px] border border-[#e1e9f4] shadow-sm">
      <CardContent className="p-6">
        <div
          className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center mb-6",
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
        <div className="font-outfit font-bold text-[#0e1f35] text-2xl leading-[30px] mb-2">
          {value}
        </div>
        <div className="font-outfit font-medium text-gray-500 text-sm leading-[18px] mb-3">
          {label}
        </div>
        <div className={cn("font-outfit font-medium text-xs leading-3", subtextColor)}>
          {subtext}
        </div>
      </CardContent>
    </Card>
  );
}

