"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui";
import type { DashboardTablePayload } from "@/lib/admin-dashboard-types";

interface ParticipantsTableProps {
  table: DashboardTablePayload;
}

const statusLabelMap = {
  completed: "Completado",
  abandoned: "Abandonó",
  started: "Iniciado",
} as const;

const statusClassMap = {
  completed: "bg-[#EEF9F1] text-[#2E7D4F] border-[#CDEED8]",
  abandoned: "bg-[#FFF2F4] text-[#B54A62] border-[#F4CCD6]",
  started: "bg-[#F7F3EF] text-[#6C5A50] border-[#E7D9CF]",
} as const;

export function ParticipantsTable({ table }: ParticipantsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <section className="border-white/70 rounded-[1.8rem] border bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(248,244,241,0.98)_100%)] p-5 shadow-[0_24px_64px_rgba(62,52,47,0.08)]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-display text-[1.2rem] uppercase tracking-[-0.04em] text-[#3E342F]">
            Participantes y sesiones
          </p>
          <p className="mt-2 font-sans text-sm leading-6 text-[#6E6058]">
            Vista operativa del funnel con estado, origen y datos de contacto.
          </p>
        </div>
        <div className="bg-white/75 rounded-full border border-[#EAD9CD] px-4 py-2 font-sans text-sm text-[#6E6058]">
          {table.pagination.totalItems} registros
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-[1.4rem] border border-[#EDE0D6]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#EFE3D9]">
            <thead className="bg-[#FFF8F4]">
              <tr className="text-left">
                {[
                  "Nombre",
                  "Correo",
                  "Celular",
                  "Resultado",
                  "Bebida",
                  "Fecha",
                  "Duración",
                  "Dispositivo",
                  "Estado",
                ].map((label) => (
                  <th
                    key={label}
                    className="px-4 py-3 font-sans text-[0.72rem] uppercase tracking-[0.14em] text-[#8A7569]"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white/70 divide-y divide-[#F2E7DF]">
              {table.rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-10 text-center font-sans text-sm text-[#7A6A62]"
                  >
                    No hay sesiones para los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                table.rows.map((row) => (
                  <tr key={row.sessionId} className="hover:bg-[#FFF9F5]">
                    <td className="px-4 py-4 font-sans text-sm text-[#3E342F]">
                      {row.fullName || "Sin formulario"}
                    </td>
                    <td className="px-4 py-4 font-sans text-sm text-[#5E5149]">
                      {row.email || "—"}
                    </td>
                    <td className="px-4 py-4 font-sans text-sm text-[#5E5149]">
                      {row.phone || "—"}
                    </td>
                    <td className="px-4 py-4 font-sans text-sm text-[#5E5149]">
                      {row.result || "Pendiente"}
                    </td>
                    <td className="px-4 py-4 font-sans text-sm text-[#5E5149]">
                      {row.drink || "Pendiente"}
                    </td>
                    <td className="px-4 py-4 font-sans text-sm text-[#5E5149]">
                      {new Intl.DateTimeFormat("es-CO", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(new Date(row.date))}
                    </td>
                    <td className="px-4 py-4 font-sans text-sm text-[#5E5149]">
                      {row.durationSeconds ? `${row.durationSeconds}s` : "—"}
                    </td>
                    <td className="px-4 py-4 font-sans text-sm capitalize text-[#5E5149]">
                      {row.deviceType || "—"}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-[0.72rem] uppercase tracking-[0.12em] ${statusClassMap[row.status]}`}
                      >
                        {statusLabelMap[row.status]}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="font-sans text-sm text-[#76685F]">
          Página {table.pagination.page} de {table.pagination.totalPages}
        </p>
        <div className="flex items-center gap-2">
          <PaginationButton
            label="Anterior"
            icon={<ChevronLeft className="h-4 w-4" />}
            disabled={table.pagination.page <= 1}
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("page", String(table.pagination.page - 1));
              router.push(`${pathname}?${params.toString()}`);
            }}
          />
          <PaginationButton
            label="Siguiente"
            icon={<ChevronRight className="h-4 w-4" />}
            reverse
            disabled={table.pagination.page >= table.pagination.totalPages}
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("page", String(table.pagination.page + 1));
              router.push(`${pathname}?${params.toString()}`);
            }}
          />
        </div>
      </div>
    </section>
  );
}

function PaginationButton({
  label,
  icon,
  reverse = false,
  disabled,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  reverse?: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="quizSecondary"
      size="quizPill"
      disabled={disabled}
      className={`h-10 gap-2 ${reverse ? "flex-row-reverse" : ""}`}
      onClick={onClick}
    >
      {icon}
      {label}
    </Button>
  );
}
