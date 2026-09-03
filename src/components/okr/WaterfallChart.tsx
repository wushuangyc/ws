import { formatInt, formatSigned } from "@/lib/okr/format";

type WaterfallStep = {
  label: string;
  value: number;
  tone: "base" | "up" | "down" | "end";
};

const PLOT_HEIGHT = 168;

export function WaterfallChart({
  title,
  steps,
}: {
  title: string;
  steps: WaterfallStep[];
}) {
  const values = steps.map((step) => Math.abs(step.value + 0));
  const max = Math.max(...values, 1);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <div
        className="mt-5 grid items-end gap-3"
        style={{ gridTemplateColumns: `repeat(${Math.max(steps.length, 1)}, minmax(0, 1fr))` }}
      >
        {steps.map((step) => {
          const magnitude = Math.abs(step.value + 0);
          const barHeight = magnitude === 0 ? 0 : Math.max(10, (magnitude / max) * PLOT_HEIGHT);
          const color =
            step.tone === "up"
              ? "bg-teal-600"
              : step.tone === "down"
                ? "bg-rose-500"
                : step.tone === "end"
                  ? "bg-slate-900"
                  : "bg-slate-400";
          return (
            <div key={step.label} className="flex min-w-0 flex-col items-center">
              <div
                className="flex w-full max-w-[72px] flex-col justify-end"
                style={{ height: PLOT_HEIGHT }}
              >
                <div className="relative mx-auto flex h-full w-10 flex-col justify-end">
                  <div className="absolute inset-0 rounded-md bg-slate-100" />
                  {barHeight > 0 ? (
                    <div
                      className={`relative z-10 w-full rounded-t-md ${color}`}
                      style={{ height: barHeight }}
                    />
                  ) : (
                    <div className="relative z-10 h-px w-full bg-slate-300" />
                  )}
                </div>
              </div>
              <p className="mt-3 text-center text-xs leading-4 text-slate-500">{step.label}</p>
              <p className="font-mono text-sm font-semibold tabular-nums text-slate-900">
                {step.tone === "up" || step.tone === "down"
                  ? formatSigned(step.value + 0)
                  : formatInt(step.value + 0)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
