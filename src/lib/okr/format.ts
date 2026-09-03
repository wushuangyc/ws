export function formatInt(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 0 }).format(
    Math.round(value),
  );
}

export function formatNum(value: number, digits = 1): string {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("zh-CN", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatPct(value: number, digits = 1): string {
  if (!Number.isFinite(value)) return "—";
  return `${formatNum(value * 100, digits)}%`;
}

export function formatMoney(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const abs = Math.abs(value);
  if (abs >= 10000) {
    const sign = value < 0 ? "-" : "";
    return `${sign}¥${formatNum(abs / 10000, 1)}万`;
  }
  return `¥${formatInt(value)}`;
}

export function formatSigned(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const rounded = Math.round(value);
  if (rounded > 0) return `+${formatInt(rounded)}`;
  return formatInt(rounded);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function ratio(numerator: number, denominator: number): number {
  if (!denominator) return 0;
  return numerator / denominator;
}

export function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}
