"use client";

import { GuidePanel } from "@/components/okr/GuidePanel";
import { KpiCard, SectionTitle } from "@/components/okr/KpiCard";
import { NumberField } from "@/components/okr/NumberField";
import { PeoplePanel } from "@/components/okr/PeoplePanel";
import { ProductBaselineTable } from "@/components/okr/ProductBaselineTable";
import { StaffingPanel } from "@/components/okr/StaffingPanel";
import { TargetPanel } from "@/components/okr/TargetPanel";
import { WaterfallChart } from "@/components/okr/WaterfallChart";
import { buildOkrModel, PLAN_MONTHS, REFERENCE_MONTHS, SCENARIOS } from "@/lib/okr/formulas";
import { formatInt, formatMoney, formatNum, formatPct, formatSigned } from "@/lib/okr/format";
import {
  blankPerson,
  blankProduct,
  createDefaultState,
  STORAGE_KEY,
} from "@/lib/okr/mock-data";
import type {
  CompanyInput,
  OkrState,
  PersonInput,
  PersonRole,
  ProductInput,
  ProductMonthInput,
  ReferenceMonthId,
  ScenarioId,
} from "@/lib/okr/types";
import { useEffect, useMemo, useState } from "react";

const NAV = [
  { href: "#overview", label: "总览" },
  { href: "#baseline", label: "基线盘点" },
  { href: "#people", label: "个人对接" },
  { href: "#target", label: "目标推演" },
  { href: "#staffing", label: "人力与成本" },
  { href: "#guide", label: "口径与方案" },
];

function isOkrState(value: unknown): value is OkrState {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<OkrState>;
  const company = record.company;
  const products = record.products;
  return (
    Array.isArray(products) &&
    Array.isArray(record.people) &&
    Boolean(company?.monthTargets) &&
    products.every((product) => product && typeof product === "object" && "actuals" in product)
  );
}

export function OkrWorkbench() {
  const [state, setState] = useState<OkrState>(createDefaultState);
  const [hydrated, setHydrated] = useState(false);
  const [viewMonth, setViewMonth] = useState<ReferenceMonthId>("2026-08");

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: unknown = JSON.parse(raw);
          if (isOkrState(parsed)) setState(parsed);
        }
      } catch {
        // keep defaults when local data is unreadable
      }
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  const model = useMemo(() => buildOkrModel(state), [state]);
  const failedAudits = model.audit.filter((item) => !item.ok);
  const viewed = viewMonth === "2026-07" ? model.july : model.august;
  const trendMax = Math.max(
    model.july.increment,
    model.august.increment,
    ...model.plans.map((plan) => plan.targetIncrement),
    1,
  );

  function patchCompany(patch: Partial<CompanyInput>) {
    setState((current) => ({
      ...current,
      company: { ...current.company, ...patch },
    }));
  }

  function patchProduct(id: string, patch: Partial<ProductInput>) {
    setState((current) => ({
      ...current,
      products: current.products.map((product) =>
        product.id === id ? { ...product, ...patch } : product,
      ),
    }));
  }

  function patchProductMonth(
    id: string,
    month: ReferenceMonthId,
    patch: Partial<ProductMonthInput>,
  ) {
    setState((current) => ({
      ...current,
      products: current.products.map((product) =>
        product.id === id
          ? {
              ...product,
              actuals: {
                ...product.actuals,
                [month]: { ...product.actuals[month], ...patch },
              },
            }
          : product,
      ),
    }));
  }

  function patchPerson(id: string, patch: Partial<PersonInput>) {
    setState((current) => ({
      ...current,
      people: current.people.map((person) =>
        person.id === id ? { ...person, ...patch } : person,
      ),
    }));
  }

  function downloadJson() {
    const blob = new Blob([JSON.stringify({ state, snapshot: model }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "okr-workbench.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="bg-[var(--okr-canvas)]">
      <div className="border-b border-slate-800 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-300">
                OKR 目标与关键成果
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                在网增长工作台
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                周期按自然月。7 月、8 月是两个独立参考月，只看趋势，不是加总后的「上个周期」。
                规划月是 9、10、11 月，净增目标分别是 175、200、225。不考核在网总量。
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-200 hover:border-teal-400 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-full bg-slate-900 p-1">
              {PLAN_MONTHS.map((row) => (
                <button
                  key={row.id}
                  type="button"
                  onClick={() => patchCompany({ planningMonth: row.id })}
                  className={`rounded-full px-3 py-1.5 text-xs ${
                    state.company.planningMonth === row.id
                      ? "bg-teal-500 text-slate-950"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {row.label} {formatSigned(state.company.monthTargets[row.id])}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              {model.target.label}目标净增
              <NumberField
                ariaLabel={`${model.target.label}目标净增`}
                value={state.company.monthTargets[state.company.planningMonth]}
                onChange={(value) =>
                  patchCompany({
                    monthTargets: {
                      ...state.company.monthTargets,
                      [state.company.planningMonth]: value,
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              转化缓冲
              <NumberField
                ariaLabel="转化缓冲"
                value={state.company.conversionBuffer}
                onChange={(conversionBuffer) => patchCompany({ conversionBuffer })}
                min={0.5}
                max={1.2}
                step={0.01}
                digits={2}
              />
            </div>
            <div className="flex rounded-full bg-slate-900 p-1">
              {(Object.keys(SCENARIOS) as ScenarioId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => patchCompany({ scenario: id })}
                  className={`rounded-full px-3 py-1.5 text-xs ${
                    state.company.scenario === id
                      ? "bg-teal-500 text-slate-950"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {SCENARIOS[id].label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={downloadJson}
              className="rounded-full border border-slate-600 px-3 py-1.5 text-xs text-slate-200 hover:border-white"
            >
              导出 JSON
            </button>
            <button
              type="button"
              onClick={() => setState(createDefaultState())}
              className="rounded-full border border-slate-600 px-3 py-1.5 text-xs text-slate-200 hover:border-white"
            >
              恢复表内数据
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 pb-28 sm:px-6 lg:px-8">
        <section className="space-y-5" id="overview">
          <SectionTitle
            id="overview-title"
            kicker="01 总览"
            title={`把${model.target.label}净增 ${formatInt(model.target.targetIncrement)} 拆成成交、续费和线索`}
            description={model.scenario.hint}
          />
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <KpiCard
              tone="navy"
              label={`${model.target.label}目标净增`}
              value={formatSigned(model.target.targetIncrement)}
              hint="当月唯一承诺，不盯在网总量"
            />
            <KpiCard
              tone="teal"
              label="7月净增（参考）"
              value={formatSigned(model.july.increment)}
              hint={`线索 ${formatInt(model.july.leads)} · 新成交 ${formatInt(model.july.newDeals)}`}
            />
            <KpiCard
              tone="teal"
              label="8月净增（参考）"
              value={formatSigned(model.august.increment)}
              hint={`线索 ${formatInt(model.august.leads)} · 新成交 ${formatInt(model.august.newDeals)}`}
            />
            <KpiCard
              label={`${model.target.label}需净留存成交`}
              value={formatInt(model.target.requiredRetained)}
              hint={`${formatInt(model.target.targetIncrement)} + 当月到期解约 ${formatInt(model.target.nextExpiryCancel)}`}
            />
            <KpiCard
              tone="amber"
              label="需线索 / 需毛成交"
              value={`${formatInt(model.target.requiredLeads)} / ${formatInt(model.target.requiredGrossDeals)}`}
              hint={`费率取自${model.baseline.label}，转化 ${formatPct(model.baseline.conversionRate)}`}
            />
          </div>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">月度净增趋势</h3>
            <p className="mt-1 text-xs text-slate-500">
              7 月、8 月是实绩；9–11 月是分月目标。两月实绩不能加总成「上个周期」。
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-5">
              {[
                { label: "7月实绩", value: model.july.increment, tone: "actual" as const },
                { label: "8月实绩", value: model.august.increment, tone: "actual" as const },
                ...model.plans.map((plan) => ({
                  label: `${plan.label}目标`,
                  value: plan.targetIncrement,
                  tone: "target" as const,
                })),
              ].map((item) => (
                <li key={item.label}>
                  <p className="text-xs text-slate-500">{item.label}</p>
                  <p className="mt-1 font-mono text-lg font-semibold">{formatSigned(item.value)}</p>
                  <span className="mt-2 block h-2.5 rounded-full bg-slate-100">
                    <span
                      className={`block h-2.5 rounded-full ${
                        item.tone === "actual" ? "bg-slate-500" : "bg-teal-600"
                      }`}
                      style={{ width: `${(Math.abs(item.value) / trendMax) * 100}%` }}
                    />
                  </span>
                </li>
              ))}
            </ul>
          </article>
          <div className="grid gap-4 xl:grid-cols-2">
            <WaterfallChart
              title={`${viewed.label}净增怎么来的：新成交留存 − 到期解约`}
              steps={[
                { label: "新成交", value: viewed.newDeals, tone: "base" },
                { label: "新成交解约", value: -viewed.newCancel, tone: "down" },
                { label: "到期解约", value: -viewed.expiryCancel, tone: "down" },
                { label: "净增", value: viewed.increment, tone: "end" },
              ]}
            />
            <WaterfallChart
              title={`${model.target.label}怎么打到目标：净增 + 当月到期流失 = 需留存成交`}
              steps={[
                { label: "目标净增", value: model.target.targetIncrement, tone: "base" },
                { label: "补到期解约", value: model.target.nextExpiryCancel, tone: "up" },
                { label: "需净留存", value: model.target.requiredRetained, tone: "end" },
                { label: "需毛成交", value: model.target.requiredGrossDeals, tone: "end" },
              ]}
            />
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
              <h3 className="text-sm font-semibold text-slate-900">产品增量结构</h3>
              <p className="mt-1 text-xs text-slate-500">
                对照 7 月、8 月实绩，再看{model.target.label}按战略权重分到的净增份额。
              </p>
              <ul className="mt-4 space-y-3">
                {model.august.products.map((product) => {
                  const july = model.july.products.find((row) => row.id === product.id);
                  const target = model.target.products.find((row) => row.id === product.id);
                  const maxAbs = Math.max(
                    ...model.july.products.map((row) => Math.abs(row.increment)),
                    ...model.august.products.map((row) => Math.abs(row.increment)),
                    ...model.target.products.map((row) => Math.abs(row.incrementShare)),
                    1,
                  );
                  return (
                    <li key={product.id} className="space-y-1">
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="truncate text-slate-700">{product.name}</span>
                        <span className="font-mono text-xs text-slate-600">
                          7月 {formatSigned(july?.increment ?? 0)} → 8月{" "}
                          {formatSigned(product.increment)} → {model.target.label}{" "}
                          {formatSigned(target?.incrementShare ?? 0)}
                        </span>
                      </div>
                      <span className="flex h-2.5 overflow-hidden rounded-full bg-slate-100">
                        <span
                          className="block h-2.5 bg-slate-400"
                          style={{ width: `${(Math.abs(july?.increment ?? 0) / maxAbs) * 50}%` }}
                        />
                        <span
                          className="block h-2.5 bg-teal-600"
                          style={{ width: `${(Math.abs(product.increment) / maxAbs) * 50}%` }}
                        />
                      </span>
                    </li>
                  );
                })}
              </ul>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">口径校验</h3>
              <p className="mt-1 text-xs text-slate-500">
                {failedAudits.length === 0
                  ? "7月、8月恒等式均通过，可以进入分月推演。"
                  : `${failedAudits.length} 项未通过，请先修对应月的基线表。`}
              </p>
              <ul className="mt-3 max-h-56 space-y-2 overflow-auto text-xs leading-5">
                {model.audit.map((item) => (
                  <li key={item.id} className="flex gap-2">
                    <span className={item.ok ? "text-teal-700" : "text-rose-600"}>
                      {item.ok ? "通过" : "异常"}
                    </span>
                    <span className="text-slate-600">
                      <span className="font-medium text-slate-800">{item.label}</span>
                      ：{item.detail}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="space-y-5" id="baseline">
          <SectionTitle
            id="baseline-title"
            kicker="02 基线盘点"
            title="7 月、8 月分月台账"
            description="每个自然月单独算增量：当月新成交留存 − 当月到期解约。不要把两月加总。右侧 9/10/11 月到期是规划月日历。"
          />
          <div className="flex flex-wrap items-center gap-2">
            {REFERENCE_MONTHS.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => setViewMonth(row.id)}
                className={`rounded-full px-3 py-1.5 text-xs ${
                  viewMonth === row.id
                    ? "bg-slate-900 text-white"
                    : "border border-slate-300 bg-white text-slate-600 hover:border-slate-500"
                }`}
              >
                查看{row.label}实绩{" "}
                {formatSigned(row.id === "2026-07" ? model.july.increment : model.august.increment)}
              </button>
            ))}
            <div className="flex rounded-full border border-slate-200 bg-white p-1 text-xs">
              {REFERENCE_MONTHS.map((row) => (
                <button
                  key={`rate-${row.id}`}
                  type="button"
                  onClick={() => patchCompany({ rateMonth: row.id })}
                  className={`rounded-full px-3 py-1 ${
                    state.company.rateMonth === row.id
                      ? "bg-teal-500 text-slate-950"
                      : "text-slate-600"
                  }`}
                >
                  费率用{row.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard label={`${viewed.label}线索`} value={formatInt(viewed.leads)} />
            <KpiCard
              label={`${viewed.label}转化率`}
              value={formatPct(viewed.conversionRate)}
              hint={`新成交 ${formatInt(viewed.newDeals)}`}
            />
            <KpiCard
              label={`${viewed.label}新成交留存率`}
              value={formatPct(viewed.newRetentionRate)}
              hint={`留存 ${formatInt(viewed.newRetained)} / 解约 ${formatInt(viewed.newCancel)}`}
            />
            <KpiCard
              label={`${viewed.label}到期续费率`}
              value={formatPct(viewed.renewalRate)}
              hint={`到期 ${formatInt(viewed.expiringCount)}，解约 ${formatInt(viewed.expiryCancel)}`}
            />
          </div>
          <ProductBaselineTable
            products={state.products}
            model={model}
            viewMonth={viewMonth}
            onChangeProduct={patchProduct}
            onChangeMonth={patchProductMonth}
            onRemove={(id) =>
              setState((current) => ({
                ...current,
                products: current.products.filter((product) => product.id !== id),
              }))
            }
            onAdd={() =>
              setState((current) => ({
                ...current,
                products: [...current.products, blankProduct()],
              }))
            }
          />
        </section>

        <section className="space-y-5" id="people">
          <SectionTitle
            id="people-title"
            kicker="03 个人对接"
            title="7 月 / 8 月分月承接线索"
            description="前端人数用于倒推规划月编制；人均产能默认取费率月（通常是 8 月），7 月只作负荷对照。"
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <KpiCard
              label={`${model.baseline.label}前端人均承接`}
              value={formatNum(model.people.avgLeadsPerFrontend, 1)}
            />
            <KpiCard label="7月进线合计" value={formatInt(model.people.julyLeads)} />
            <KpiCard label="8月进线合计" value={formatInt(model.people.augustLeads)} />
          </div>
          <PeoplePanel
            people={state.people}
            model={model}
            onChange={patchPerson}
            onRemove={(id) =>
              setState((current) => ({
                ...current,
                people: current.people.filter((person) => person.id !== id),
              }))
            }
            onAdd={(role: PersonRole) =>
              setState((current) => ({
                ...current,
                people: [...current.people, blankPerson(role)],
              }))
            }
          />
        </section>

        <section className="space-y-5" id="target">
          <SectionTitle
            id="target-title"
            kicker="04 目标推演"
            title={`从${model.target.label}净增 ${formatSigned(model.target.targetIncrement)} 反推各产品线索与成交`}
            description="9、10、11 月分别倒推。先按战略权重拆当月净增，再补当月到期解约。"
          />
          <TargetPanel model={model} />
        </section>

        <section className="space-y-5" id="staffing">
          <SectionTitle
            id="staffing-title"
            kicker="05 人力与成本"
            title={`${model.target.label}编制与投放：前端按线索、后端按单量、投放按付费缺口`}
            description="人效和 CPL 取费率月（默认 8 月），自然线索产能按单月上限，不按 7+8 合计。"
          />
          <StaffingPanel
            company={state.company}
            model={model}
            onCompanyChange={patchCompany}
          />
        </section>

        <section className="space-y-5" id="guide">
          <SectionTitle
            id="guide-title"
            kicker="06 口径与方案"
            title="把这套数当成按月经营模型"
            description="考核的是 9 月 +175、10 月 +200、11 月 +225，不是两月加总，也不是在网总量。"
          />
          <GuidePanel monthTargets={state.company.monthTargets} />
        </section>
      </div>

      <div className="sticky bottom-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-3 text-xs sm:grid-cols-4 sm:px-6 lg:px-8">
          <p>
            <span className="text-slate-500">{model.target.label}目标</span>{" "}
            <span className="font-mono font-semibold">
              {formatSigned(model.target.targetIncrement)}
            </span>
          </p>
          <p>
            <span className="text-slate-500">7月 / 8月</span>{" "}
            <span className="font-mono font-semibold">
              {formatSigned(model.july.increment)} / {formatSigned(model.august.increment)}
            </span>
          </p>
          <p>
            <span className="text-slate-500">建议编制</span>{" "}
            <span className="font-mono font-semibold">
              前 {model.target.frontendNeededCeil} / 后 {model.target.backendNeededCeil}
            </span>
          </p>
          <p>
            <span className="text-slate-500">推荐投放</span>{" "}
            <span className="font-mono font-semibold">
              {formatMoney(model.target.recommendedPaidCost)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
