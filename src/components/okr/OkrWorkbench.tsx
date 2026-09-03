"use client";

import { GuidePanel } from "@/components/okr/GuidePanel";
import { KpiCard, SectionTitle } from "@/components/okr/KpiCard";
import { NumberField } from "@/components/okr/NumberField";
import { PeoplePanel } from "@/components/okr/PeoplePanel";
import { ProductBaselineTable } from "@/components/okr/ProductBaselineTable";
import { StaffingPanel } from "@/components/okr/StaffingPanel";
import { TargetPanel } from "@/components/okr/TargetPanel";
import { WaterfallChart } from "@/components/okr/WaterfallChart";
import { buildOkrModel, SCENARIOS } from "@/lib/okr/formulas";
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
  return Array.isArray(record.products) && Array.isArray(record.people) && Boolean(record.company);
}

export function OkrWorkbench() {
  const [state, setState] = useState<OkrState>(createDefaultState);
  const [hydrated, setHydrated] = useState(false);

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
                唯一目标：9–10 月在网用户净增 {formatInt(state.company.targetIncrement)}。
                不考核现有或目标在网总量；总量只在公式里用来反推成交和到期流失。
                产品为电力、号卡、WIFI、宽带，底数来自 MOBIUS 业绩表 7–8 月。
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
            <div className="flex items-center gap-2 text-xs text-slate-400">
              目标净增
              <NumberField
                ariaLabel="目标净增"
                value={state.company.targetIncrement}
                onChange={(targetIncrement) => patchCompany({ targetIncrement })}
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
            title={`先把净增 ${formatInt(state.company.targetIncrement)} 拆成成交、续费和线索`}
            description={model.scenario.hint}
          />
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <KpiCard
              tone="navy"
              label="目标净增（唯一承诺）"
              value={formatSigned(model.target.targetIncrement)}
              hint="只盯净增，不盯在网总量"
            />
            <KpiCard
              tone="teal"
              label="上期净增（7–8 月）"
              value={formatSigned(model.baseline.increment)}
              hint={
                model.baseline.increment >= model.target.targetIncrement
                  ? "上期已高于目标，下期关键是补到期流失、把结构调过来"
                  : `相对上期还需多净增 ${formatInt(model.target.targetIncrement - model.baseline.increment)}`
              }
            />
            <KpiCard
              label="需净留存成交"
              value={formatInt(model.target.requiredRetained)}
              hint={`${formatInt(model.target.targetIncrement)} + 下期到期解约 ${formatInt(model.target.nextExpiryCancel)}`}
            />
            <KpiCard
              tone="amber"
              label="需线索 / 需毛成交"
              value={`${formatInt(model.target.requiredLeads)} / ${formatInt(model.target.requiredGrossDeals)}`}
              hint={`综合转化 ${formatPct(model.baseline.conversionRate)}，留存 ${formatPct(model.baseline.newRetentionRate)}`}
            />
            <KpiCard
              tone="rose"
              label="推荐付费预算"
              value={formatMoney(model.target.recommendedPaidCost)}
              hint={`付费缺口 ${formatInt(model.target.recommendedPaidLeads)} 条`}
            />
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            <WaterfallChart
              title="上期净增怎么来的：新成交留存 − 到期解约"
              steps={[
                { label: "新成交", value: model.baseline.newDeals, tone: "base" },
                { label: "新成交解约", value: -model.baseline.newCancel, tone: "down" },
                { label: "到期解约", value: -model.baseline.expiryCancel, tone: "down" },
                { label: "净增", value: model.baseline.increment, tone: "end" },
              ]}
            />
            <WaterfallChart
              title="下期怎么打到目标：净增 + 到期流失 = 需留存成交"
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
                柱长表示基线增量；右侧数字是目标周期按战略权重分到的净增份额。
              </p>
              <ul className="mt-4 space-y-3">
                {model.baseline.products.map((product) => {
                  const target = model.target.products.find((row) => row.id === product.id);
                  const maxAbs = Math.max(
                    ...model.baseline.products.map((row) => Math.abs(row.increment)),
                    1,
                  );
                  return (
                    <li key={product.id} className="grid grid-cols-[8rem_1fr_auto] items-center gap-3">
                      <span className="truncate text-sm text-slate-700">{product.name}</span>
                      <span className="h-2.5 rounded-full bg-slate-100">
                        <span
                          className="block h-2.5 rounded-full bg-teal-600"
                          style={{ width: `${(Math.abs(product.increment) / maxAbs) * 100}%` }}
                        />
                      </span>
                      <span className="font-mono text-xs text-slate-600">
                        基线 {formatSigned(product.increment)} → 目标{" "}
                        {formatSigned(target?.incrementShare ?? 0)}
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
                  ? "全部恒等式通过，可以进入目标推演。"
                  : `${failedAudits.length} 项未通过，请先修基线表。`}
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
            title="7 月 1 日–8 月 31 日产品台账"
            description="只看增量：新成交留存 − 到期解约。转化率、留存率、续费率由件数反算。期初/期末总量不进入本表。"
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="线索总量" value={formatInt(model.baseline.leads)} />
            <KpiCard
              label="平均转化率"
              value={formatPct(model.baseline.conversionRate)}
              hint={`新成交 ${formatInt(model.baseline.newDeals)}`}
            />
            <KpiCard
              label="新成交留存率"
              value={formatPct(model.baseline.newRetentionRate)}
              hint={`留存 ${formatInt(model.baseline.newRetained)} / 解约 ${formatInt(model.baseline.newCancel)}`}
            />
            <KpiCard
              label="到期续费率"
              value={formatPct(model.baseline.renewalRate)}
              hint={`到期 ${formatInt(model.baseline.expiringCount)}，解约 ${formatInt(model.baseline.expiryCancel)}`}
            />
          </div>
          <ProductBaselineTable
            products={state.products}
            model={model}
            onChange={patchProduct}
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
            title="人均承接线索与群聊+私聊对接"
            description="前端人数用于倒推下期编制；每个人的对接量用于看负荷分布，避免人均达标但少数人过载。"
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <KpiCard
              label="前端人均承接新线索"
              value={formatNum(model.people.avgLeadsPerFrontend, 1)}
            />
            <KpiCard
              label="前端人均对接"
              value={formatNum(model.people.avgHandoffFrontend, 1)}
              hint="群聊 + 私聊"
            />
            <KpiCard
              label="全员对接合计"
              value={formatInt(model.people.totalHandoff)}
              hint={`群 ${formatInt(model.people.totalGroup)} · 私 ${formatInt(model.people.totalPrivate)}`}
            />
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
            title={`从净增 ${formatSigned(state.company.targetIncrement)} 反推各产品线索与成交`}
            description="不推在网总量。先按战略权重拆净增，再补下期到期解约，倒推毛成交和线索。"
          />
          <TargetPanel model={model} />
        </section>

        <section className="space-y-5" id="staffing">
          <SectionTitle
            id="staffing-title"
            kicker="05 人力与成本"
            title="前端按线索产能、后端按单量外推、投放按付费缺口"
            description="原方案的人数与成本公式都保留，同时给出更稳妥的付费预算口径。"
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
            title="把这套数当成经营模型，而不是一张静态报表"
            description="考核的是净增 175，不是在网总量。下列词典和公式可直接贴进评审材料。"
          />
          <GuidePanel />
        </section>
      </div>

      <div className="sticky bottom-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-3 text-xs sm:grid-cols-4 sm:px-6 lg:px-8">
          <p>
            <span className="text-slate-500">目标净增</span>{" "}
            <span className="font-mono font-semibold">
              {formatSigned(model.target.targetIncrement)}
            </span>
          </p>
          <p>
            <span className="text-slate-500">上期净增</span>{" "}
            <span className="font-mono font-semibold">
              {formatSigned(model.baseline.increment)}
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
