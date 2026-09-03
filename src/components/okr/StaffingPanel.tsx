import { NumberField } from "@/components/okr/NumberField";
import { formatInt, formatMoney, formatNum, formatPct } from "@/lib/okr/format";
import type { CompanyInput, OkrModel } from "@/lib/okr/types";

export function StaffingPanel({
  company,
  model,
  onCompanyChange,
}: {
  company: CompanyInput;
  model: OkrModel;
  onCompanyChange: (patch: Partial<CompanyInput>) => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">编制测算</h3>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-500">{model.baseline.label}前端人均承接线索</dt>
            <dd className="font-mono">{formatNum(model.people.avgLeadsPerFrontend, 1)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-500">{model.baseline.label}前端人均成交</dt>
            <dd className="font-mono">{formatNum(model.people.avgDealsPerFrontend, 1)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-500">{model.baseline.label}前端转化率</dt>
            <dd className="font-mono">{formatPct(model.people.conversionRate)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-500">前端在职 / 离职 / 计编</dt>
            <dd className="font-mono">
              {model.people.frontendActiveCount} / {model.people.frontendDepartedCount} /{" "}
              {formatNum(model.people.frontendFte, 1)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-500">{model.target.label}需线索</dt>
            <dd className="font-mono">{formatInt(model.target.requiredLeads)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-600">前端人数 = 需线索 ÷ 人均承接 × 情景系数</dt>
            <dd className="font-mono text-lg font-semibold">
              {formatNum(model.target.frontendNeeded, 2)}
              <span className="ml-2 text-xs font-normal text-slate-500">
                建议编制 {model.target.frontendNeededCeil}
              </span>
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-600">后端人数 = 新成交 ÷ {model.baseline.label}成交 × 后端人数</dt>
            <dd className="font-mono text-lg font-semibold">
              {formatNum(model.target.backendNeeded, 2)}
              <span className="ml-2 text-xs font-normal text-slate-500">
                建议编制 {model.target.backendNeededCeil}
              </span>
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-xs leading-5 text-slate-500">
          前端按线索产能约束（离职 2 人计 1 编，0 线索前端不计入），后端按成交单量线性外推。若交付有明显批量/标准化空间，后端可按人效提升单独打折，不必与销售同步扩张。
        </p>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">付费渠道与自然流量</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="text-xs text-slate-500">
            {model.baseline.label}付费线索总成本
            <div className="mt-1">
              <NumberField
                ariaLabel={`${model.baseline.label}付费线索总成本`}
                value={company.previousPaidLeadCost}
                onChange={(previousPaidLeadCost) => onCompanyChange({ previousPaidLeadCost })}
                step={1000}
              />
            </div>
          </div>
          <div className="text-xs text-slate-500">
            单月自然线索产能上限
            <div className="mt-1">
              <NumberField
                ariaLabel="自然线索产能上限"
                value={company.organicLeadCapacity}
                onChange={(organicLeadCapacity) => onCompanyChange({ organicLeadCapacity })}
              />
            </div>
          </div>
        </div>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-500">{model.baseline.label}付费线索 / CPL</dt>
            <dd className="font-mono">
              {formatInt(model.baseline.paidLeads)} / {formatMoney(model.baseline.paidCpl)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-500">按历史结构拆出的付费线索</dt>
            <dd className="font-mono">{formatInt(model.target.paidLeadsByMix)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-500">自然产能吃满后仍缺的付费线索（推荐）</dt>
            <dd className="font-mono font-semibold">
              {formatInt(model.target.recommendedPaidLeads)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-500">原公式：需求线索 / {model.baseline.label}线索 × 费率月成本</dt>
            <dd className="font-mono">{formatMoney(model.target.paidCostOriginal)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-600">推荐：缺口付费线索 × {model.baseline.label}付费 CPL</dt>
            <dd className="font-mono text-lg font-semibold text-amber-800">
              {formatMoney(model.target.recommendedPaidCost)}
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-xs leading-5 text-slate-500">
          原公式用「全部线索」做分母，会把自然量也摊进付费成本，结果偏小。推荐口径只对付费缺口乘历史付费
          CPL。结构占比法预算为 {formatMoney(model.target.paidCostCorrectedMix)}，可作为投放上限对照。
        </p>
      </article>
    </div>
  );
}
