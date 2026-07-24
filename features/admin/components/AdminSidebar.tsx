"use client";

import { BarChart3, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const links = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: BarChart3,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-white/60 sticky top-6 hidden h-[calc(100vh-3rem)] w-[248px] shrink-0 flex-col rounded-[2rem] border bg-[linear-gradient(180deg,rgba(255,255,255,0.84)_0%,rgba(248,244,241,0.95)_100%)] p-5 shadow-[0_28px_72px_rgba(62,52,47,0.1)] backdrop-blur-xl lg:flex">
      <div className="mb-8 space-y-3">
        <div className="inline-flex items-center rounded-full border border-[#FFD4E7] bg-[#FFF4FA] px-3 py-1 text-[0.68rem] uppercase tracking-[0.2em] text-[#B74274]">
          Dunkin' Admin
        </div>
        <div>
          <p className="font-display text-[1.4rem] uppercase leading-none tracking-[-0.04em] text-[#3E342F]">
            Campaign
            <br />
            Control
          </p>
          <p className="mt-3 font-sans text-sm leading-6 text-[#76685F]">
            Analítica, conversiones y seguimiento comercial del quiz.
          </p>
        </div>
      </div>

      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-[1.25rem] px-4 py-3 font-sans text-[0.95rem] font-medium transition-all duration-200",
                isActive
                  ? "bg-[#3E342F] text-[#F8F4F1] shadow-[0_16px_34px_rgba(62,52,47,0.18)]"
                  : "hover:bg-white/80 text-[#5F5149] hover:text-[#3E342F]"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="bg-white/75 mt-auto rounded-[1.4rem] border border-[#F0DDD1] p-4">
        <p className="font-sans text-[0.72rem] uppercase tracking-[0.16em] text-[#A18477]">
          Vista
        </p>
        <p className="mt-2 font-display text-lg uppercase tracking-[-0.03em] text-[#3E342F]">
          Desktop First
        </p>
        <p className="mt-2 font-sans text-sm leading-6 text-[#76685F]">
          Diseñado para equipos de marketing, performance y operaciones.
        </p>
      </div>
    </aside>
  );
}
