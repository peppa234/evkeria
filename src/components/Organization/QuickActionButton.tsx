import React from "react";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { cn } from "@lib/utils";

interface QuickActionButtonProps {
  href: string;
  icon: LucideIcon;
  label: string;
  variant?: "primary" | "outline";
  onClickOverride?: () => void;
}

export function QuickActionButton({
  href,
  icon: Icon,
  label,
  variant = "primary",
  onClickOverride,
}: QuickActionButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onClickOverride) {
      e.preventDefault();
      onClickOverride();
    }
  };

  const buttonContent = (
    <Button
      variant={variant === "outline" ? "outline" : "default"}
      className={cn(
        "w-full justify-start rounded-xl font-outfit font-medium text-sm transition-all duration-200",
        variant === "primary"
          ? "bg-[#4fa3e3] hover:bg-[#3d8bc7] text-white h-12 px-4 shadow-sm"
          : "bg-gray-50 hover:bg-gray-100 text-[#0e1f35] h-12 px-4 border border-gray-200"
      )}
      onClick={handleClick}
    >
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center mr-3 flex-shrink-0",
        variant === "primary" ? "bg-white/20" : "bg-white"
      )}>
        <Icon className="w-4 h-4" />
      </div>
      {label}
    </Button>
  );

  if (onClickOverride) {
    return buttonContent;
  }

  return (
    <Link href={href} className="block">
      {buttonContent}
    </Link>
  );
}
