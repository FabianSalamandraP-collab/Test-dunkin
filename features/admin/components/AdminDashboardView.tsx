"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Clock3,
  CupSoda,
  MousePointerClick,
  Send,
  TimerReset,
  Trophy,
  Users,
} from "lucide-react";
import { AdminFiltersBar } from "@/features/admin/components/AdminFiltersBar";
import { DistributionCard } from "@/features/admin/components/DistributionCard";
import { MetricCard } from "@/features/admin/components/MetricCard";
import { ParticipantsTable } from "@/features/admin/components/ParticipantsTable";
import { TimelineCard } from "@/features/admin/components/TimelineCard";
import type { DashboardDataPayload } from "@/lib/admin-dashboard-types";

interface AdminDashboardViewProps {
  data: DashboardDataPayload;
  mode?: "overview" | "analytics";
}

export function AdminDashboardView({
  data,
  mode = "overview",
}: AdminDashboardViewProps) {
  const isAnalytics = mode === "analytics";

  return (
    <div className="space-y-6">
      <AdminFiltersBar
        filters={data.appliedFilters}
        drinks={data.filterOptions.drinks}
        personalities={data.filterOptions.personalities}
        devices={data.filterOptions.devices}
        trafficSources={data.filterOptions.trafficSources}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Users}
          label="Participantes Totales"
          value={String(data.summary.totalParticipants)}
          tone="ink"
          hint="Sesiones iniciadas dentro del filtro actual."
        />
        <MetricCard
          icon={Activity}
          label="Tests Completados"
          value={String(data.summary.completedTests)}
          tone="pink"
          hint={`Abandono ${data.summary.abandonmentRate.toFixed(1)}%`}
        />
        <MetricCard
          icon={Send}
          label="Formularios Enviados"
          value={String(data.summary.submittedForms)}
          tone="orange"
          hint={`Conversión ${data.summary.conversionRate.toFixed(1)}%`}
        />
        <MetricCard
          icon={MousePointerClick}
          label={`Clics en "Ver en Dunkin'"`}
          value={String(data.summary.viewInDunkinClicks)}
          tone="ink"
          hint={`CTR ${data.summary.viewInDunkinCtr.toFixed(1)}%`}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="border-white/70 rounded-[1.8rem] border bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(248,244,241,0.98)_100%)] p-5 shadow-[0_24px_64px_rgba(62,52,47,0.08)]"
        >
          <div className="grid gap-4 md:grid-cols-3">
            <MiniHighlight
              icon={Clock3}
              label="Tiempo promedio"
              value={
                data.summary.averageDurationSeconds
                  ? `${data.summary.averageDurationSeconds}s`
                  : "—"
              }
            />
            <MiniHighlight
              icon={TimerReset}
              label="Tasa de abandono"
              value={`${data.summary.abandonmentRate.toFixed(1)}%`}
            />
            <MiniHighlight
              icon={Trophy}
              label="Bebida con más clics"
              value={data.summary.topClickedDrink.drinkLabel || "Sin datos"}
            />
          </div>
        </motion.div>

        <DistributionCard
          title="Top bebida clicada"
          caption="La acción comercial con mayor interés final."
          accent="orange"
          data={
            data.summary.topClickedDrink.drinkLabel
              ? [
                  {
                    key: data.summary.topClickedDrink.drinkKey || "top",
                    label: data.summary.topClickedDrink.drinkLabel,
                    value: data.summary.topClickedDrink.clicks,
                  },
                ]
              : []
          }
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <DistributionCard
          title="Bebidas con más clics"
          caption="Interés final del CTA agrupado por la bebida recomendada."
          data={data.charts.byClickedDrink}
          accent="orange"
        />
        <DistributionCard
          title="Clics por dispositivo"
          caption="Qué tipo de pantalla genera más aperturas hacia Dunkin'."
          data={data.charts.clicksByDevice}
          accent="ink"
        />
        <DistributionCard
          title="Clics por campaña"
          caption="Distribución de clics finales según `utm_campaign`."
          data={data.charts.clicksByCampaign}
          accent="pink"
        />
        <DistributionCard
          title="Clics por fuente"
          caption="Lectura por `utm_source` o referrer registrado al hacer clic."
          data={data.charts.clicksByTrafficSource}
          accent="orange"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <TimelineCard
          title="Participación por día"
          caption="Lectura del volumen diario de sesiones dentro del rango activo."
          data={data.charts.participationByDay}
        />
        <TimelineCard
          title="Participación por hora"
          caption="Identifica las franjas donde el quiz concentra más tráfico."
          data={data.charts.participationByHour}
          accent="#EF6A00"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <DistributionCard
          title="Resultados por bebida"
          caption="Qué bebida está saliendo con más frecuencia."
          data={data.charts.byDrink}
          accent="orange"
        />
        <DistributionCard
          title="Resultados por personalidad"
          caption="Distribución de los perfiles del quiz."
          data={data.charts.byPersonality}
          accent="pink"
        />
        <DistributionCard
          title="Dispositivos"
          caption="Participación segmentada por tipo de pantalla."
          data={data.charts.byDevice}
          accent="ink"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <DistributionCard
          title="Navegadores"
          caption="Mix de browsers en la experiencia actual."
          data={data.charts.byBrowser}
          accent="ink"
        />
        <DistributionCard
          title="Fuentes de tráfico"
          caption="UTM source o referencia detectada por sesión."
          data={data.charts.byTrafficSource}
          accent="orange"
        />
        <DistributionCard
          title="Abandono por pregunta"
          caption="Dónde se concentra la fricción del recorrido."
          data={data.charts.byAbandonQuestion}
          accent="pink"
        />
      </section>

      {isAnalytics ? (
        <section className="grid gap-4 xl:grid-cols-2">
          <DistributionCard
            title="Bebidas más clicadas"
            caption="Ranking operativo del CTA final para priorizar la oferta destacada."
            data={data.charts.byClickedDrink}
            accent="orange"
          />
          <DistributionCard
            title="Lectura ejecutiva"
            caption="Resumen del funnel desde la misma fuente de datos operativa."
            data={[
              {
                key: "started",
                label: "Sesiones iniciadas",
                value: data.summary.totalParticipants,
              },
              {
                key: "completed",
                label: "Tests completados",
                value: data.summary.completedTests,
              },
              {
                key: "forms",
                label: "Formularios enviados",
                value: data.summary.submittedForms,
              },
              {
                key: "clicks",
                label: `Clics en "Ver en Dunkin'"`,
                value: data.summary.viewInDunkinClicks,
              },
            ]}
            accent="pink"
          />
        </section>
      ) : null}

      <ParticipantsTable table={data.table} />
    </div>
  );
}

function MiniHighlight({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CupSoda;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white/76 rounded-[1.4rem] border border-[#EADCD2] p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[1rem] bg-[#FFF4EC] text-[#EF6A00]">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="font-sans text-[0.72rem] uppercase tracking-[0.16em] text-[#8A7569]">
            {label}
          </p>
          <p className="mt-2 font-display text-[1.4rem] uppercase tracking-[-0.04em] text-[#3E342F]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
