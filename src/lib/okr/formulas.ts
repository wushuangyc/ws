import { clamp, ratio } from "./format";
import type {
  AuditItem,
  CompanyInput,
  OkrModel,
  OkrState,
  PersonInput,
  ProductBaseline,
  ProductInput,
  ProductTarget,
  ScenarioConfig,
  ScenarioId,
} from "./types";

export const SCENARIOS: Record<ScenarioId, ScenarioConfig> = {
  conservative: {
    id: "conservative",
    label: "保守",
    hint: "转化、留存、续费、人效均按历史打九折左右，用于排兵布阵留缓冲。",
    conversion: 0.9,
    retention: 0.95,
    renewal: 0.95,
    capacity: 0.9,
  },
  base: {
    id: "base",
    label: "基准",
    hint: "沿用 7–8 月转化、留存、续费与人效，作为正式 OKR 主方案。",
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

function deriveProduct(product: ProductInput): ProductBaseline {
  const conversionRate = ratio(product.newDeals, product.leads);
  const newCancelRate = ratio(product.newCancel, product.newDeals);
  const newRetained = product.newDeals - product.newCancel;
  const newRetentionRate = ratio(newRetained, product.newDeals);
  const expiryCancel = product.expiringCount - product.renewedCount;
  const expiryCancelRate = ratio(expiryCancel, product.expiringCount);
  const renewalRate = ratio(product.renewedCount, product.expiringCount);
  const increment = newRetained - expiryCancel;
  const closingOnline = product.openingOnline + increment;
  const paidLeads = product.leads * product.paidLeadShare;
  const organicLeads = product.leads - paidLeads;

  return {
    ...product,
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
    newDealRevenue: product.newDeals * product.ticketPrice,
    renewalRevenue: product.renewedCount * product.ticketPrice,
  };
}

function sumBy<T>(rows: T[], pick: (row: T) => number): number {
  return rows.reduce((acc, row) => acc + pick(row), 0);
}

function rateOr(value: number, fallback: number): number {
  return clamp(value, 0.01, 0.99) || fallback;
}

export function buildOkrModel(state: OkrState): OkrModel {
  const scenario = SCENARIOS[state.company.scenario] ?? SCENARIOS.base;
  const products = state.products.map(deriveProduct);
  const openingOnline = sumBy(products, (row) => row.openingOnline);
  const closingOnline = sumBy(products, (row) => row.closingOnline);
  const increment = sumBy(products, (row) => row.increment);
  const leads = sumBy(products, (row) => row.leads);
  const newDeals = sumBy(products, (row) => row.newDeals);
  const newCancel = sumBy(products, (row) => row.newCancel);
  const newRetained = sumBy(products, (row) => row.newRetained);
  const expiringCount = sumBy(products, (row) => row.expiringCount);
  const renewedCount = sumBy(products, (row) => row.renewedCount);
  const expiryCancel = sumBy(products, (row) => row.expiryCancel);
  const paidLeads = sumBy(products, (row) => row.paidLeads);
  const organicLeads = sumBy(products, (row) => row.organicLeads);
  const newDealRevenue = sumBy(products, (row) => row.newDealRevenue);
  const renewalRevenue = sumBy(products, (row) => row.renewalRevenue);

  const frontend = state.people.filter((person) => person.role === "frontend");
  const backend = state.people.filter((person) => person.role === "backend");
  const leadsHandled = sumBy(state.people, (person) => person.newLeadsHandled);
  const totalGroup = sumBy(state.people, (person) => person.groupChats);
  const totalPrivate = sumBy(state.people, (person) => person.privateChats);
  const totalHandoff = totalGroup + totalPrivate;
  const avgLeadsPerFrontend = ratio(leads, frontend.length);
  const avgHandoffPerPerson = ratio(totalHandoff, state.people.length);
  const avgHandoffFrontend = ratio(
    sumBy(frontend, (person) => person.groupChats + person.privateChats),
    frontend.length,
  );

  const incrementShares = allocateByWeight(
    state.company.targetIncrement,
    products.map((product) => product.strategicWeight),
  );

  const targetProducts: ProductTarget[] = products.map((product, index) => {
    const effectiveRetention = rateOr(
      product.newRetentionRate * scenario.retention,
      0.8,
    );
    const effectiveConversion = rateOr(
      product.conversionRate * scenario.conversion * state.company.conversionBuffer,
      0.08,
    );
    const effectiveRenewal = rateOr(product.renewalRate * scenario.renewal, 0.5);
    const nextExpiryCancel = Math.round(
      product.nextExpiringCount * (1 - effectiveRenewal),
    );
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

  const nextExpiring = sumBy(products, (row) => row.nextExpiringCount);
  const nextExpiryCancel = sumBy(targetProducts, (row) => row.nextExpiryCancel);
  const requiredRetained = sumBy(targetProducts, (row) => row.requiredRetained);
  const requiredGrossDeals = sumBy(targetProducts, (row) => row.requiredGrossDeals);
  const requiredLeads = sumBy(targetProducts, (row) => row.requiredLeads);
  const paidLeadsByMix = sumBy(targetProducts, (row) => row.paidLeadsNeeded);
  const organicCapacity = Math.max(0, state.company.organicLeadCapacity);
  const organicLeadsPlanned = Math.min(organicCapacity, requiredLeads);
  const paidLeadsByResidual = Math.max(0, requiredLeads - organicLeadsPlanned);
  const projectedIncrement = sumBy(targetProducts, (row) => row.projectedIncrement);
  const projectedClosing = closingOnline + projectedIncrement;

  const frontendCapacity = avgLeadsPerFrontend * scenario.capacity;
  const frontendNeeded = ratio(requiredLeads, frontendCapacity);
  const backendNeeded = ratio(requiredGrossDeals, newDeals) * backend.length;

  const paidCostOriginal = ratio(paidLeadsByMix, leads) * state.company.previousPaidLeadCost;
  const historicalCpl = ratio(state.company.previousPaidLeadCost, paidLeads);
  const paidCostCorrectedMix = paidLeadsByMix * historicalCpl;
  const paidCostCorrectedResidual = paidLeadsByResidual * historicalCpl;

  const model: OkrModel = {
    baseline: {
      products,
      openingOnline,
      closingOnline,
      increment,
      leads,
      newDeals,
      newCancel,
      newRetained,
      newRetentionRate: ratio(newRetained, newDeals),
      conversionRate: ratio(newDeals, leads),
      expiringCount,
      renewedCount,
      expiryCancel,
      renewalRate: ratio(renewedCount, expiringCount),
      paidLeads,
      organicLeads,
      paidShare: ratio(paidLeads, leads),
      newDealRevenue,
      renewalRevenue,
      paidCpl: historicalCpl,
    },
    people: {
      list: state.people,
      frontend,
      backend,
      frontendCount: frontend.length,
      backendCount: backend.length,
      leadsHandled,
      avgLeadsPerFrontend,
      avgHandoffPerPerson,
      avgHandoffFrontend,
      totalGroup,
      totalPrivate,
      totalHandoff,
    },
    target: {
      products: targetProducts,
      openingOnline: closingOnline,
      targetClosing: closingOnline + state.company.targetIncrement,
      targetIncrement: state.company.targetIncrement,
      nextExpiring,
      nextExpiryCancel,
      requiredRetained,
      requiredGrossDeals,
      requiredLeads,
      paidLeadsByMix,
      paidLeadsByResidual,
      organicLeadsPlanned,
      projectedIncrement,
      projectedClosing,
      frontendNeeded,
      frontendNeededCeil: Math.ceil(frontendNeeded),
      backendNeeded,
      backendNeededCeil: Math.ceil(backendNeeded),
      paidCostOriginal,
      paidCostCorrectedMix,
      paidCostCorrectedResidual,
      recommendedPaidLeads: paidLeadsByResidual,
      recommendedPaidCost: paidCostCorrectedResidual,
    },
    audit: buildAudit(state.company, products, state.people, leadsHandled, leads),
    scenario,
  };

  return model;
}

function buildAudit(
  company: CompanyInput,
  products: ProductBaseline[],
  people: PersonInput[],
  leadsHandled: number,
  productLeads: number,
): AuditItem[] {
  const items: AuditItem[] = [];

  products.forEach((product) => {
    const identity = product.newRetained - product.expiryCancel;
    items.push({
      id: `inc-${product.id}`,
      ok: identity === product.increment,
      label: `${product.name} 增量恒等式`,
      detail: `新成交留存 ${product.newRetained} − 到期解约 ${product.expiryCancel} = ${identity}，表内增量为 ${product.increment}`,
    });
    items.push({
      id: `renew-${product.id}`,
      ok: product.renewedCount + product.expiryCancel === product.expiringCount,
      label: `${product.name} 到期分流`,
      detail: `续费 ${product.renewedCount} + 到期解约 ${product.expiryCancel} = ${product.renewedCount + product.expiryCancel}，到期 ${product.expiringCount}`,
    });
    items.push({
      id: `new-${product.id}`,
      ok: product.newRetained + product.newCancel === product.newDeals,
      label: `${product.name} 新成交分流`,
      detail: `留存 ${product.newRetained} + 解约 ${product.newCancel} = ${product.newRetained + product.newCancel}，新成交 ${product.newDeals}`,
    });
    items.push({
      id: `neg-${product.id}`,
      ok:
        product.leads >= 0 &&
        product.newDeals >= 0 &&
        product.newCancel >= 0 &&
        product.newCancel <= product.newDeals &&
        product.renewedCount >= 0 &&
        product.renewedCount <= product.expiringCount &&
        product.paidLeadShare >= 0 &&
        product.paidLeadShare <= 1,
      label: `${product.name} 输入边界`,
      detail: "线索、成交、解约、续费、付费占比均需落在合理区间。",
    });
  });

  const increment = sumBy(products, (row) => row.increment);
  const retained = sumBy(products, (row) => row.newRetained);
  const expiryCancel = sumBy(products, (row) => row.expiryCancel);
  items.push({
    id: "company-increment",
    ok: increment === retained - expiryCancel,
    label: "公司级增量恒等式",
    detail: `全产品新成交留存 ${retained} − 到期解约 ${expiryCancel} = ${retained - expiryCancel}，合计增量 ${increment}`,
  });

  items.push({
    id: "lead-match",
    ok: Math.abs(leadsHandled - productLeads) <= Math.max(20, productLeads * 0.08),
    label: "线索口径对齐",
    detail: `销售承接线索合计 ${leadsHandled}（按进线条数），产品线索合计 ${productLeads}（按业务类型，多产品进线可重复计）。差距来自未分类进线或一客多业务，不一定是台账错误。`,
  });

  items.push({
    id: "frontend-exists",
    ok: people.some((person) => person.role === "frontend"),
    label: "前端编制",
    detail: "至少需要 1 名前端（销售）才能测算人均承接与编制。",
  });

  items.push({
    id: "target-positive",
    ok: company.targetIncrement > 0,
    label: "增量目标",
    detail: `当前目标总增量为 ${company.targetIncrement}。`,
  });

  return items;
}

export function personHandoff(person: PersonInput): number {
  return person.groupChats + person.privateChats;
}
