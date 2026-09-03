"use client";

import { useId } from "react";

type NumberFieldProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  digits?: number;
  suffix?: string;
  className?: string;
  ariaLabel: string;
};

export function NumberField({
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  digits = 0,
  suffix,
  className = "",
  ariaLabel,
}: NumberFieldProps) {
  const id = useId();

  return (
    <label className={`inline-flex items-center gap-1 ${className}`}>
      <input
        id={id}
        aria-label={ariaLabel}
        className="w-24 rounded-md border border-slate-200 bg-white px-2 py-1 text-right font-mono text-sm tabular-nums text-slate-800 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
        type="number"
        min={min}
        max={max}
        step={step}
        value={Number.isFinite(value) ? Number(value.toFixed(digits)) : 0}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (!Number.isFinite(next)) return;
          const bounded = max === undefined ? next : Math.min(max, next);
          onChange(Math.max(min, bounded));
        }}
      />
      {suffix ? <span className="text-xs text-slate-500">{suffix}</span> : null}
    </label>
  );
}

export function PercentField({
  value,
  onChange,
  ariaLabel,
}: {
  value: number;
  onChange: (value: number) => void;
  ariaLabel: string;
}) {
  return (
    <NumberField
      ariaLabel={ariaLabel}
      value={value * 100}
      onChange={(next) => onChange(next / 100)}
      min={0}
      max={100}
      step={0.1}
      digits={1}
      suffix="%"
    />
  );
}
