import * as XLSX from "xlsx";
import type { DashboardParticipantRow } from "@/lib/admin-dashboard-types";

const CSV_HEADERS = [
  "Nombre",
  "Correo",
  "Celular",
  "Resultado",
  "Bebida",
  "Fecha",
  "Duracion (seg)",
  "Dispositivo",
  "Estado",
  "Fuente",
];

function mapRow(row: DashboardParticipantRow) {
  return [
    row.fullName || "",
    row.email || "",
    row.phone || "",
    row.result || "",
    row.drink || "",
    row.date,
    row.durationSeconds ?? "",
    row.deviceType || "",
    row.status,
    row.trafficSource,
  ];
}

function escapeCsvCell(value: string | number) {
  const text = String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function createDashboardCsv(rows: DashboardParticipantRow[]) {
  const lines = [
    CSV_HEADERS.map(escapeCsvCell).join(","),
    ...rows.map((row) => mapRow(row).map(escapeCsvCell).join(",")),
  ];

  return lines.join("\n");
}

export function createDashboardWorkbook(rows: DashboardParticipantRow[]) {
  const worksheet = XLSX.utils.aoa_to_sheet([
    CSV_HEADERS,
    ...rows.map((row) => mapRow(row)),
  ]);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Dashboard");

  return XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });
}
