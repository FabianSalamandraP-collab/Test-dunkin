import type { ReactNode } from "react";
import { AdminLogoutButton } from "@/features/admin/components/AdminLogoutButton";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";

interface AdminShellProps {
  adminName?: string | null;
  children: ReactNode;
}

export function AdminShell({ adminName, children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#FFF9F5_0%,#F8F1EB_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="bg-[#FF0068]/8 absolute left-[6%] top-[10%] h-64 w-64 rounded-full blur-[120px]" />
        <div className="absolute right-[8%] top-[20%] h-72 w-72 rounded-full bg-[#EF6A00]/10 blur-[140px]" />
        <div className="absolute bottom-0 left-[34%] h-80 w-80 rounded-full bg-[#FFE0CF]/80 blur-[160px]" />
      </div>

      <div className="relative mx-auto flex max-w-[1500px] gap-6">
        <AdminSidebar />

        <main className="min-w-0 flex-1 space-y-6">
          <header className="border-white/70 rounded-[2rem] border bg-[linear-gradient(180deg,rgba(255,255,255,0.8)_0%,rgba(255,251,247,0.92)_100%)] px-6 py-5 shadow-[0_24px_72px_rgba(62,52,47,0.08)] backdrop-blur-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center rounded-full border border-[#FFD4E7] bg-[#FFF1F7] px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-[#B74274]">
                  Dunkin' Colombia
                </div>
                <div>
                  <h1 className="font-display text-[2rem] uppercase leading-none tracking-[-0.05em] text-[#3E342F]">
                    Dashboard administrativo
                  </h1>
                  <p className="mt-3 font-sans text-[0.94rem] leading-7 text-[#6E6058]">
                    Seguimiento de participantes, conversiones, abandono y
                    comportamiento del quiz.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start gap-3 lg:items-end">
                <div className="bg-white/75 rounded-[1.2rem] border border-[#F0DED3] px-4 py-3 text-sm text-[#5F5149]">
                  <span className="font-sans uppercase tracking-[0.14em] text-[#9D8376]">
                    Admin
                  </span>
                  <p className="mt-1 font-display text-base uppercase tracking-[-0.03em] text-[#3E342F]">
                    {adminName || "Usuario interno"}
                  </p>
                </div>
                <AdminLogoutButton />
              </div>
            </div>
          </header>

          {children}
        </main>
      </div>
    </div>
  );
}
