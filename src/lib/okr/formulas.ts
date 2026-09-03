import { monthLabel, PLAN_MONTHS, REFERENCE_MONTHS } from "./calendar";
import { clamp, ratio } from "./format";
import { countsTowardPeopleStats, personDealsIn, personLeadsIn } from "./mock-data";
import type {
  AuditItem,
  CompanyInput,
  MonthPlan,
  MonthSnapshot,
  OkrModel,
  OkrState,
  PersonInput,
  PlanMonthId,
  ProductBaseline,
  ProductInput,
  ProductMonthInput,
  ProductTarget,
  ReferenceMonthId,
  ScenarioConfig,
  ScenarioId,
} from "./types";

export const SCENARIOS: Record<ScenarioId, ScenarioConfig> = {
  conservative: {
    id: "conservative",
    label: "保守",
    hint: "转化、留存、续费、人效按最近完整月打九折左右，用于排兵布阵留缓冲。",
    conversion: 0.9,
    retention: 0.95,
    renewal: 0.95,
    capacity: 0.9,
  },
  base: {
    id: "base",
    label: "基准",
    hint: "沿用最近完整月（8月）转化、留存、续费与人效，作为正式 OKR 主方案。7月只作趋势对照。",
    conversion: 1,
    retention: 1,
    renewal: 1,
    capacity: 1,
  },
  aggressive: {
    id: "aggressive",
    label: "进取",
    hint: "假设转化与人效略升、解约略降，仅作为冲刺上限，不建议直接当承诺值。",
    conversion: 1.08,
    retention: 1.02,
    renewal: 1.03,
    capacity: 1.1,
  },
};

export function allocateByWeight(total: number, weights: number[]): number[] {
  if (weights.length === 0) return [];
  const safeWeights = weights.map((weight) => Math.max(0, weight));
  const sum = safeWeights.reduce((acc, weight) => acc + weight, 0);
  if (sum === 0) {
    const even = Math.floor(total / weights.length);
    const result = weights.map(() => even);
    let remain = total - even * weights.length;
    for (let i = 0; remain > 0; i += 1, remain -= 1) result[i] += 1;
    return result;
  }
  const raw = safeWeights.map((weight) => (total * weight) / sum);
  const floors = raw.map((value) => Math.floor(value));
  const remain = total - floors.reduce((acc, value) => acc + value, 0);
  const order = raw
    .map((value, index) => ({ index, frac: value - Math.floor(value) }))
    .sort((a, b) => b.frac - a.frac);
  const result = [...floors];
  for (let i = 0; i < remain; i += 1) {
    result[order[i % order.length].index] += 1;
  }
  return result;
}

function deriveProduct(product: ProductInput, actual: ProductMonthInput): ProductBaseline {
  const conversionRate = ratio(actual.newDeals, actual.leads);
  const newCancelRate = ratio(actual.newCancel, actual.newDeals);
  const newRetained = actual.newDeals - actual.newCancel;
  const newRetentionRate = ratio(newRetained, actual.newDeals);
  const expiryCancel = actual.expiringCount - actual.renewedCount;
  const expiryCancelRate = ratio(expiryCancel, actual.expiringCount);
  const renewalRate = ratio(actual.renewedCount, actual.expiringCount);
  const increment = newRetained - expiryCancel;
  const closingOnline = product.openingOnline + increment;
  const paidLeads = actual.leads * actual.paidLeadShare;
  const organicLeads = actual.leads - paidLeads;

  return {
    id: product.id,
    name: product.name,
    ticketPrice: product.ticketPrice,
    openingOnline: product.openingOnline,
    strategicWeight: product.strategicWeight,
    ...actual,
    conversionRate,
    newCancelRate,
    newRetained,
    newRetentionRate,
    expiryCancel,
    expiryCancelRate,
    renewalRate,
    increment,
    closingOnline,
    paidLeads,
    organicLeads,
    newDealRevenue: actual.newDeals * product.ticketPrice,
    renewalRevenue: actual.renewedCount * product.ticketPrice,
  };
}

function sumBy<T>(rows: T[], pick: (row: T) => number): number {
  return rows.reduce((acc, row) => acc + pick(row), 0);
}

function rateOr(value: number, fallback: number): number {
  return clamp(value, 0.01, 0.99) || fallback;
}

function snapshotFor(
  month: ReferenceMonthId,
  products: ProductInput[],
  paidCpl: number,
): MonthSnapshot {
  const derived = products.map((product) => deriveProduct(product, product.actuals[month]));
  const newDeals = sumBy(derived, (row) => row.newDeals);
  const newRetained = sumBy(derived, (row) => row.newRetained);
  const leads = sumBy(derived, (row) => row.leads);
  const expiringCount = sumBy(derived, (row) => row.expiringCount);
  const renewedCount = sumBy(derived, (row) => row.renewedCount);
  const paidLeads = sumBy(derived, (row) => row.paidLeads);
  return {
    month,
    label: monthLabel(month),
    products: derived,
    increment: sumBy(derived, (row) => row.increment),
    leads,
    newDeals,
    newCancel: sumBy(derived, (row) => row.newCancel),
    newRetained,
    newRetentionRate: ratio(newRetained, newDeals),
    conversionRate: ratio(newDeals, leads),
    expiringCount,
    renewedCount,
    expiryCancel: sumBy(derived, (row) => row.expiryCancel),
    renewalRate: ratio(renewedCount, expiringCount),
    paidLeads,
    organicLeads: sumBy(derived, (row) => row.organicLeads),
    paidShare: ratio(paidLeads, leads),
    newDealRevenue: sumBy(derived, (row) => row.newDealRevenue),
    renewalRevenue: sumBy(derived, (row) => row.renewalRevenue),
    paidCpl,
    openingOnline: sumBy(derived, (row) => row.openingOnline),
    closingOnline: sumBy(derived, (row) => row.closingOnline),
  };
}

function buildPlan(args: {
  month: PlanMonthId;
  targetIncrement: number;
  products: ProductInput[];
  rate: MonthSnapshot;
  scenario: ScenarioConfig;
  conversionBuffer: number;
  organicLeadCapacity: number;
  previousPaidLeadCost: number;
  frontendCount: number;
  backendCount: number;
  avgLeadsPerFrontend: number;
}): MonthPlan {
  const incrementShares = allocateByWeight(
    args.targetIncrement,
    args.rate.products.map((product) => product.strategicWeight),
  );

  const targetProducts: ProductTarget[] = args.rate.products.map((product, index) => {
    const source = args.products.find((row) => row.id === product.id);
    const plannedExpiry = source?.plannedExpiry[args.month] ?? 0;
    const effectiveRetention = rateOr(product.newRetentionRate * args.scenario.retention, 0.8);
    const effectiveConversion = rateOr(
      product.conversionRate * args.scenario.conversion * args.conversionBuffer,
      0.08,
    );
    const effectiveRenewal = rateOr(product.renewalRate * args.scenario.renewal, 0.5);
    const nextExpiryCancel = Math.round(plannedExpiry * (1 - effectiveRenewal));
    const incrementShare = incrementShares[index] ?? 0;
    const requiredRetained = incrementShare + nextExpiryCancel;
    const requiredGrossDeals = Math.ceil(ratio(requiredRetained, effectiveRetention));
    const requiredLeads = Math.ceil(ratio(requiredGrossDeals, effectiveConversion));
    const impliedNewCancel = requiredGrossDeals - requiredRetained;
    const projectedIncrement = requiredRetained - nextExpiryCancel;
    const paidLeadsNeeded = Math.round(requiredLeads * product.paidLeadShare);
    const organicLeadsNeeded = requiredLeads - paidLeadsNeeded;

    return {
      id: product.id,
      name: product.name,
      incrementShare,
      nextExpiryCancel,
      requiredRetained,
      effectiveRetention,
      requiredGrossDeals,
      effectiveConversion,
      requiredLeads,
      paidLeadsNeeded,
      organicLeadsNeeded,
      projectedIncrement,
      projectedClosing: product.closingOnline + projectedIncrement,
      impliedNewCancel: Math.max(0, impliedNewCancel),
    };
  });

  const nextExpiring = sumBy(args.products, (row) => row.plannedExpiry[args.month]);
  const nextExpiryCancel = sumBy(targetProducts, (row) => row.nextExpiryCancel);
  const requiredRetained = sumBy(targetProducts, (row) => row.requiredRetained);
  const requiredGrossDeals = sumBy(targetProducts, (row) => row.requiredGrossDeals);
  const requiredLeads = sumBy(targetProducts, (row) => row.requiredLeads);
  const paidLeadsByMix = sumBy(targetProducts, (row) => row.paidLeadsNeeded);
  const organicCapacity = Math.max(0, args.organicLeadCapacity);
  const organicLeadsPlanned = Math.min(organicCapacity, requiredLeads);
  const paidLeadsByResidual = Math.max(0, requiredLeads - organicLeadsPlanned);
  const projectedIncrement = sumBy(targetProducts, (row) => row.projectedIncrement);
  const frontendCapacity = args.avgLeadsPerFrontend * args.scenario.capacity;
  const frontendNeeded = ratio(requiredLeads, frontendCapacity);
  const backendNeeded = ratio(requiredGrossDeals, args.rate.newDeals) * args.backendCount;
  const historicalCpl = args.rate.paidCpl;
  const paidCostOriginal = ratio(paidLeadsByMix, args.rate.leads) * args.previousPaidLeadCost;
  const paidCostCorrectedMix = paidLeadsByMix * historicalCpl;
  const paidCostCorrectedResidual = paidLeadsByResidual * historicalCpl;

  return {
    month: args.month,
    label: monthLabel(args.month),
    products: targetProducts,
    targetIncrement: args.targetIncrement,
    nextExpiring,
    nextExpiryCancel,
    requiredRetained,
    requiredGrossDeals,
    requiredLeads,
    paidLeadsByMix,
    paidLeadsByResidual,
    organicLeadsPlanned,
    projectedIncrement,
    projectedClosing: args.rate.closingOnline + projectedIncrement,
    frontendNeeded,
    frontendNeededCeil: Math.ceil(frontendNeeded),
    backendNeeded,
    backendNeededCeil: Math.ceil(backendNeeded),
    paidCostOriginal,
    paidCostCorrectedMix,
    paidCostCorrectedResidual,
    recommendedPaidLeads: paidLeadsByResidual,
    recommendedPaidCost: paidCostCorrectedResidual,
    openingOnline: args.rate.closingOnline,
    targetClosing: args.rate.closingOnline + args.targetIncrement,
  };
}

export function buildOkrModel(state: OkrState): OkrModel {
  const scenario = SCENARIOS[state.company.scenario] ?? SCENARIOS.base;
  const rateMonth: ReferenceMonthId = state.company.rateMonth === "2026-07" ? "2026-07" : "2026-08";
  const paidLeadsRate = sumBy(state.products, (product) => {
    const actual = product.actuals[rateMonth];
    return actual.leads * actual.paidLeadShare;
  });
  const historicalCpl = ratio(state.company.previousPaidLeadCost, paidLeadsRate);

  const july = snapshotFor("2026-07", state.products, historicalCpl);
  const august = snapshotFor("2026-08", state.products, historicalCpl);
  const references = [july, august];
  const baseline = rateMonth === "2026-07" ? july : august;

  const counted = state.people.filter(countsTowardPeopleStats);
  const frontend = counted.filter((person) => person.role === "frontend");
  const backend = counted.filter((person) => person.role === "backend");
  const frontendActive = frontend.filter((person) => person.employment !== "departed");
  const frontendDeparted = frontend.filter((person) => person.employment === "departed");
  const frontendFte = frontendActive.length + frontendDeparted.length / 2;
  const julyLeads = sumBy(counted, (person) => person.julyLeads);
  const augustLeads = sumBy(counted, (person) => person.augustLeads);
  const julyDeals = sumBy(counted, (person) => person.julyDeals);
  const augustDeals = sumBy(counted, (person) => person.augustDeals);
  const leadsHandled = sumBy(counted, (person) => personLeadsIn(person, rateMonth));
  const dealsHandled = sumBy(counted, (person) => personDealsIn(person, rateMonth));
  const avgLeadsPerFrontend = ratio(leadsHandled, frontendFte);
  const avgDealsPerFrontend = ratio(dealsHandled, frontendFte);
  const conversionRate = ratio(dealsHandled, leadsHandled);

  const plans = PLAN_MONTHS.map((row) =>
    buildPlan({
      month: row.id,
      targetIncrement: state.company.monthTargets[row.id] ?? row.defaultTarget,
      products: state.products,
      rate: baseline,
      scenario,
      conversionBuffer: state.company.conversionBuffer,
      organicLeadCapacity: state.company.organicLeadCapacity,
      previousPaidLeadCost: state.company.previousPaidLeadCost,
      frontendCount: frontendFte,
      backendCount: backend.length,
      avgLeadsPerFrontend,
    }),
  );

  const planningMonth: PlanMonthId = PLAN_MONTHS.some((row) => row.id === state.company.planningMonth)
    ? state.company.planningMonth
    : "2026-09";
  const target = plans.find((plan) => plan.month === planningMonth) ?? plans[0];

  return {
    july,
    august,
    references,
    baseline,
    people: {
      list: counted,
      frontend,
      backend,
      frontendCount: frontendFte,
      frontendFte,
      frontendActiveCount: frontendActive.length,
      frontendDepartedCount: frontendDeparted.length,
      backendCount: backend.length,
      leadsHandled,
      avgLeadsPerFrontend,
      avgDealsPerFrontend,
      conversionRate,
      julyLeads,
      augustLeads,
      julyDeals,
      augustDeals,
    },
    plans,
    target,
    audit: buildAudit(state.company, [july, august], counted, leadsHandled, baseline.leads),
    scenario,
  };
}

function buildAudit(
  company: CompanyInput,
  months: MonthSnapshot[],
  people: PersonInput[],
  leadsHandled: number,
  productLeads: number,
): AuditItem[] {
  const items: AuditItem[] = [];

  months.forEach((snapshot) => {
    snapshot.products.forEach((product) => {
      const identity = product.newRetained - product.expiryCancel;
      items.push({
        id: `inc-${snapshot.month}-${product.id}`,
        ok: identity === product.increment,
        label: `${snapshot.label}${product.name} 增量恒等式`,
        detail: `新成交留存 ${product.newRetained} − 到期解约 ${product.expiryCancel} = ${identity}，表内增量为 ${product.increment}`,
      });
      items.push({
        id: `renew-${snapshot.month}-${product.id}`,
        ok: product.renewedCount + product.expiryCancel === product.expiringCount,
        label: `${snapshot.label}${product.name} 到期分流`,
        detail: `续费 ${product.renewedCount} + 到期解约 ${product.expiryCancel} = ${product.renewedCount + product.expiryCancel}，到期 ${product.expiringCount}`,
      });
      items.push({
        id: `new-${snapshot.month}-${product.id}`,
        ok: product.newRetained + product.newCancel === product.newDeals,
        label: `${snapshot.label}${product.name} 新成交分流`,
        detail: `留存 ${product.newRetained} + 解约 ${product.newCancel} = ${product.newRetained + product.newCancel}，新成交 ${product.newDeals}`,
      });
    });

    items.push({
      id: `company-increment-${snapshot.month}`,
      ok: snapshot.increment === snapshot.newRetained - snapshot.expiryCancel,
      label: `${snapshot.label}公司级增量恒等式`,
      detail: `新成交留存 ${snapshot.newRetained} − 到期解约 ${snapshot.expiryCancel} = ${snapshot.newRetained - snapshot.expiryCancel}，合计增量 ${snapshot.increment}`,
    });
  });

  items.push({
    id: "lead-match",
    ok: Math.abs(leadsHandled - productLeads) <= Math.max(20, productLeads * 0.08),
    label: "线索口径对齐",
    detail: `销售承接线索合计 ${leadsHandled}（按进线条数，费率月），产品线索合计 ${productLeads}（按业务类型，多产品进线可重复计）。`,
  });

  items.push({
    id: "frontend-exists",
    ok: people.some((person) => person.role === "frontend"),
    label: "前端编制",
    detail: "至少需要 1 名前端（销售）才能测算人均承接与编制。",
  });

  const targets = PLAN_MONTHS.map((row) => company.monthTargets[row.id] ?? 0);
  items.push({
    id: "targets-positive",
    ok: targets.every((value) => value > 0),
    label: "分月增量目标",
    detail: `9/10/11 月目标净增分别为 ${targets.join(" / ")}。`,
  });

  return items;
}

export function personConversion(leads: number, deals: number): number {
  return ratio(deals, leads);
}

export { monthLabel, PLAN_MONTHS, REFERENCE_MONTHS };
