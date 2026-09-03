import type { PlanMonthId, ReferenceMonthId } from "./types";

export const REFERENCE_MONTHS: { id: ReferenceMonthId; label: string }[] = [
  { id: "2026-07", label: "7月" },
  { id: "2026-08", label: "8月" },
];

export const PLAN_MONTHS: { id: PlanMonthId; label: string; defaultTarget: number }[] = [
  { id: "2026-09", label: "9月", defaultTarget: 175 },
  { id: "2026-10", label: "10月", defaultTarget: 200 },
  { id: "2026-11", label: "11月", defaultTarget: 225 },
];

export function monthLabel(id: ReferenceMonthId | PlanMonthId): string {
  const found =
    REFERENCE_MONTHS.find((row) => row.id === id) ?? PLAN_MONTHS.find((row) => row.id === id);
  return found?.label ?? id;
}
