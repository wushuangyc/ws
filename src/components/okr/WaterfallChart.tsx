import { formatInt, formatSigned } from "@/lib/okr/format";

type WaterfallStep = {
  label: string;
  value: number;
  tone: "base" | "up" | "down" | "end";
};

const PLOT_HEIGHT = 168;

function layoutSteps(steps: WaterfallStep[]) {
  let cursor = 0;
  const laidOut = steps.map((step, index) => {
    const isTotal = index === 0 || step.tone === "end";
    if (isTotal) {
      cursor = step.value;
      return { ...step, base: 0, magnitude: Math.abs(step.value) };
    }
    const magnitude = Math.abs(step.value);
    if (step.value >= 0) {
      const base = cursor;
      cursor += step.value;
      return { ...step, base, magnitude };
    }
    cursor += step.value;
    return { ...step, base: cursor, magnitude };
  });

  const max = Math.max(...laidOut.map((step) => step.base + step.magnitude), 1);
  return laidOut.map((step) => {
    const rawBar = (step.magnitude / max) * PLOT_HEIGHT;
    const barHeight = step.magnitude === 0 ? 0 : Math.max(8, rawBar);
    const rawBase = (step.base / max) * PLOT_HEIGHT;
    const offset = Math.min(rawBase, Math.max(0, PLOT_HEIGHT - barHeight));
    return { ...step, barHeight, offset };
  });
}

export function WaterfallChart({
  title,
  steps,
}: {
  title: string;
  steps: WaterfallStep[];
}) {
  const columns = layoutSteps(steps);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <div
        className="mt-5 grid gap-3"
        style={{ gridTemplateColumns: `repeat(${Math.max(columns.length, 1)}, minmax(0, 1fr))` }}
      >
        {columns.map((step) => {
          const color =
            step.tone === "up"
              ? "bg-teal-600"
              : step.tone === "down"
                ? "bg-rose-500"
                : step.tone === "end"
                  ? "bg-slate-900"
                  : "bg-slate-400";
          const rounded = step.offset > 0 ? "rounded-sm" : "rounded-t-md";
          return (
            <div key={step.label} className="flex min-w-0 flex-col items-center">
              <div
                className="relative flex w-full max-w-[72px] flex-col justify-end"
                style={{ height: PLOT_HEIGHT }}
              >
                <div className="absolute inset-x-2 inset-y-0 rounded-md bg-slate-100" />
                <div
                  className={`relative z-10 w-10 self-center ${rounded} ${color}`}
                  style={{ height: step.barHeight }}
                />
                <div className="relative w-full shrink-0" style={{ height: step.offset }} />
              </div>
              <p className="mt-3 text-center text-xs leading-4 text-slate-500">{step.label}</p>
              <p className="font-mono text-sm font-semibold tabular-nums text-slate-900">
                {step.tone === "up" || step.tone === "down"
                  ? formatSigned(step.value)
                  : formatInt(step.value)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
