"use client";

import type { ComponentType } from "react";
import { cn } from "@/lib/cn";
import { QuizIconLink } from "./QuizIconLink";

export type SocialLinkItem = {
  id: string;
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  accentClass?: string;
};

export type SocialLinksProps = {
  links: readonly SocialLinkItem[];
  label?: string;
  className?: string;
};

export function SocialLinks({ links, label = "Síguenos", className }: SocialLinksProps) {
  return (
    <div className={cn("flex items-center gap-3 text-xs sm:text-sm", className)}>
      <span className="font-sans font-medium text-[#4A281B]">{label}</span>
      <div className="flex items-center gap-2">
        {links.map((social) => {
          const Icon = social.icon;

          return (
            <QuizIconLink
              key={social.id}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Ir a ${social.label} de Dunkin' Colombia`}
              tone="soft"
              size="sm"
              className={cn(
                "h-11 w-11",
                "lg:h-9 lg:w-9 lg:bg-[#FFF8F1] lg:ring-1 lg:ring-[#E6C8B3] lg:shadow-[0_10px_22px_rgba(102,66,30,0.12)]",
                social.accentClass
              )}
            >
              <Icon className="h-6 w-6 lg:h-[18px] lg:w-[18px]" />
            </QuizIconLink>
          );
        })}
      </div>
    </div>
  );
}
