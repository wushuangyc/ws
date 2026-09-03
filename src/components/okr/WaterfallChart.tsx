import { formatInt, formatSigned } from "@/lib/okr/format";

type WaterfallStep = {
  label: string;
  value: number;
  tone: "base" | "up" | "down" | "end";
};

export function WaterfallChart({
  title,
  steps,
}: {
  title: string;
  steps: WaterfallStep[];
}) {
  const start = steps[0]?.value ?? 0;
  const running: number[] = [];
  let cursor = 0;
  steps.forEach((step, index) => {
    if (index === 0 || step.tone === "end") {
      running.push(0);
      cursor = step.value;
      return;
    }
    if (step.value >= 0) {
      running.push(cursor);
      cursor += step.value;
      return;
    }
    running.push(cursor + step.value);
    cursor += step.value;
  });

  const max = Math.max(
    start,
    ...steps.map((step, index) =>
      step.tone === "end" || index === 0 ? step.value : running[index] + Math.abs(step.value),
    ),
    1,
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {steps.map((step, index) => {
          const magnitude = step.tone === "end" || index === 0 ? step.value : Math.abs(step.value);
          const height = Math.max(8, (magnitude / max) * 140);
          const offset = ((running[index] ?? 0) / max) * 140;
          const color =
            step.tone === "up"
              ? "bg-teal-600"
              : step.tone === "down"
                ? "bg-rose-500"
                : step.tone === "end"
                  ? "bg-slate-900"
                  : "bg-slate-400";
          return (
            <div key={step.label} className="flex flex-col items-center">
              <div className="relative h-[140px] w-full max-w-[72px]">
                <div
                  className={`absolute bottom-0 left-1/2 w-10 -translate-x-1/2 rounded-t-md ${color}`}
                  style={{ height, bottom: offset }}
                />
              </div>
              <p className="mt-3 text-center text-xs text-slate-500">{step.label}</p>
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
