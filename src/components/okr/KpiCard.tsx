export function KpiCard({
  label,
  value,
  hint,
  tone = "slate",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "slate" | "teal" | "amber" | "rose" | "navy";
}) {
  const tones = {
    slate: "border-slate-200 bg-white",
    teal: "border-teal-200 bg-teal-50/70",
    amber: "border-amber-200 bg-amber-50/80",
    rose: "border-rose-200 bg-rose-50/70",
    navy: "border-slate-800 bg-slate-900 text-white",
  } as const;
  const valueClass = tone === "navy" ? "text-white" : "text-slate-900";
  const hintClass = tone === "navy" ? "text-slate-300" : "text-slate-500";

  return (
    <article className={`rounded-2xl border p-4 shadow-sm ${tones[tone]}`}>
      <p className={`text-xs font-medium tracking-wide ${hintClass}`}>{label}</p>
      <p className={`mt-2 font-mono text-2xl font-semibold tabular-nums ${valueClass}`}>
        {value}
      </p>
      {hint ? <p className={`mt-1 text-xs leading-5 ${hintClass}`}>{hint}</p> : null}
    </article>
  );
}

export function SectionTitle({
  id,
  kicker,
  title,
  description,
}: {
  id: string;
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <div id={id} className="scroll-mt-28">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
        {kicker}
      </p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
