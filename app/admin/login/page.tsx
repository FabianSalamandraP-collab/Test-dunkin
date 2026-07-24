import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/features/admin/components/AdminLoginForm";
import { getAdminAccessState } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const access = await getAdminAccessState();

  if (access.authenticated && access.isAdmin) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#FFF9F5_0%,#F8F1EB_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="bg-[#FF0068]/8 absolute left-[10%] top-[12%] h-72 w-72 rounded-full blur-[120px]" />
        <div className="absolute right-[10%] top-[18%] h-80 w-80 rounded-full bg-[#EF6A00]/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1280px] items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="hidden space-y-6 lg:block">
          <div className="inline-flex rounded-full border border-[#FFD4E7] bg-[#FFF2F8] px-4 py-2 text-[0.72rem] uppercase tracking-[0.2em] text-[#B74274]">
            Acceso restringido
          </div>
          <h2 className="font-display text-[4.2rem] uppercase leading-[0.88] tracking-[-0.07em] text-[#3E342F]">
            Controla la
            <br />
            campaña con
            <br />
            precisión.
          </h2>
          <p className="max-w-[44ch] font-sans text-[1rem] leading-8 text-[#6E6058]">
            Un workspace interno para leer resultados, revisar conversiones,
            detectar fricción y exportar el rendimiento del quiz de Dunkin'
            Colombia.
          </p>
        </section>

        <div className="mx-auto w-full max-w-[560px]">
          <AdminLoginForm
            isConfigured={access.configured}
            setupMessage={access.reason}
          />
        </div>
      </div>
    </main>
  );
}
