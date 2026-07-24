"use client";

import { Download, RotateCcw, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui";
import type {
  DashboardFilters,
  DashboardFilterOption,
} from "@/lib/admin-dashboard-types";

interface AdminFiltersBarProps {
  filters: DashboardFilters;
  drinks: DashboardFilterOption[];
  personalities: DashboardFilterOption[];
  devices: DashboardFilterOption[];
  trafficSources: DashboardFilterOption[];
}

export function AdminFiltersBar({
  filters,
  drinks,
  personalities,
  devices,
  trafficSources,
}: AdminFiltersBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [formState, setFormState] = useState({
    startDate: filters.startDate || "",
    endDate: filters.endDate || "",
    drinkKey: filters.drinkKey || "",
    personalityKey: filters.personalityKey || "",
    deviceType: filters.deviceType || "",
    trafficSource: filters.trafficSource || "",
  });

  const exportQuery = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    return params.toString();
  }, [searchParams]);

  return (
    <section className="border-white/70 rounded-[1.8rem] border bg-[linear-gradient(180deg,rgba(255,255,255,0.86)_0%,rgba(255,249,245,0.94)_100%)] p-5 shadow-[0_24px_64px_rgba(62,52,47,0.08)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="font-display text-[1.2rem] uppercase tracking-[-0.04em] text-[#3E342F]">
            Filtros globales
          </p>
          <p className="mt-2 font-sans text-sm leading-6 text-[#6E6058]">
            Segmenta el desempeño del quiz y exporta la misma vista aplicada.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={
              exportQuery
                ? `/api/admin/dashboard/export/csv?${exportQuery}`
                : "/api/admin/dashboard/export/csv"
            }
          >
            <Button variant="quizSecondary" size="quizPill" className="gap-2">
              <Download className="h-4 w-4" />
              CSV
            </Button>
          </Link>
          <Link
            href={
              exportQuery
                ? `/api/admin/dashboard/export/xlsx?${exportQuery}`
                : "/api/admin/dashboard/export/xlsx"
            }
          >
            <Button variant="quizSecondary" size="quizPill" className="gap-2">
              <Download className="h-4 w-4" />
              Excel
            </Button>
          </Link>
        </div>
      </div>

      <form
        className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-6"
        onSubmit={(event) => {
          event.preventDefault();
          const params = new URLSearchParams(searchParams.toString());

          Object.entries(formState).forEach(([key, value]) => {
            if (value) {
              params.set(key, value);
            } else {
              params.delete(key);
            }
          });

          params.delete("page");
          router.push(`${pathname}?${params.toString()}`);
        }}
      >
        <FilterField label="Fecha inicio">
          <input
            type="date"
            value={formState.startDate}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                startDate: event.target.value,
              }))
            }
            className="bg-white h-12 w-full rounded-[1rem] border border-[#EAD9CD] px-4 font-sans text-sm text-[#463B35] outline-none transition focus:border-[#EF6A00]"
          />
        </FilterField>

        <FilterField label="Fecha fin">
          <input
            type="date"
            value={formState.endDate}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                endDate: event.target.value,
              }))
            }
            className="bg-white h-12 w-full rounded-[1rem] border border-[#EAD9CD] px-4 font-sans text-sm text-[#463B35] outline-none transition focus:border-[#EF6A00]"
          />
        </FilterField>

        <FilterField label="Bebida">
          <FilterSelect
            value={formState.drinkKey}
            onChange={(value) =>
              setFormState((current) => ({ ...current, drinkKey: value }))
            }
            options={drinks}
          />
        </FilterField>

        <FilterField label="Personalidad">
          <FilterSelect
            value={formState.personalityKey}
            onChange={(value) =>
              setFormState((current) => ({ ...current, personalityKey: value }))
            }
            options={personalities}
          />
        </FilterField>

        <FilterField label="Dispositivo">
          <FilterSelect
            value={formState.deviceType}
            onChange={(value) =>
              setFormState((current) => ({ ...current, deviceType: value }))
            }
            options={devices}
          />
        </FilterField>

        <FilterField label="Fuente de tráfico">
          <FilterSelect
            value={formState.trafficSource}
            onChange={(value) =>
              setFormState((current) => ({ ...current, trafficSource: value }))
            }
            options={trafficSources}
          />
        </FilterField>

        <div className="flex items-end gap-3 md:col-span-2 xl:col-span-6">
          <Button
            type="submit"
            variant="quizCta"
            size="quizLg"
            className="gap-2"
          >
            <Search className="h-4 w-4" />
            Aplicar filtros
          </Button>
          <Button
            type="button"
            variant="quizSecondary"
            size="quizLg"
            className="gap-2"
            onClick={() => {
              setFormState({
                startDate: "",
                endDate: "",
                drinkKey: "",
                personalityKey: "",
                deviceType: "",
                trafficSource: "",
              });
              router.push(pathname);
            }}
          >
            <RotateCcw className="h-4 w-4" />
            Limpiar
          </Button>
        </div>
      </form>
    </section>
  );
}

function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-2">
      <span className="font-sans text-[0.72rem] uppercase tracking-[0.16em] text-[#8A7569]">
        {label}
      </span>
      {children}
    </label>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: DashboardFilterOption[];
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="bg-white h-12 w-full rounded-[1rem] border border-[#EAD9CD] px-4 font-sans text-sm text-[#463B35] outline-none transition focus:border-[#EF6A00]"
    >
      <option value="">Todos</option>
      {options.map((option) => (
        <option key={option.key} value={option.key}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
