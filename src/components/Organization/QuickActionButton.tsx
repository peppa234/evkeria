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
        "rounded-xl font-outfit font-medium text-base",
        variant === "primary"
          ? "bg-[#4fa3e3] hover:bg-[#4fa3e3]/90 text-white h-[57px] px-6"
          : "bg-gray-50 hover:bg-gray-100 text-[#0e1f35] h-[53px] px-6 border"
      )}
      onClick={handleClick}
    >
      <Icon className="w-5 h-5 mr-2" />
      {label}
    </Button>
  );

  if (onClickOverride) {
    return buttonContent;
  }

  return (
    <Link href={href}>
      {buttonContent}
    </Link>
  );
}

