import { AdminShell } from "@/features/admin/components/AdminShell";
import { requireAdminPageAccess } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const access = await requireAdminPageAccess();

  if (!access.configured) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#FFF9F5_0%,#F8F1EB_100%)] px-6 py-8">
        <div className="border-white/70 bg-white/90 mx-auto max-w-[920px] rounded-[2rem] border p-8 shadow-[0_28px_72px_rgba(62,52,47,0.1)]">
          <p className="font-display text-[2rem] uppercase tracking-[-0.04em] text-[#3E342F]">
            Configuración pendiente
          </p>
          <p className="mt-4 font-sans text-[1rem] leading-8 text-[#6E6058]">
            {access.reason ||
              "El dashboard admin necesita Supabase configurado para autenticación y lectura analítica."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <AdminShell
      adminName={access.adminProfile?.full_name || access.user?.email}
    >
      {children}
    </AdminShell>
  );
}
