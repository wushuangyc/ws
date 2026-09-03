export type ScenarioId = "conservative" | "base" | "aggressive";

export type PersonRole = "frontend" | "backend";

export type PersonEmployment = "active" | "departed";

export type ReferenceMonthId = "2026-07" | "2026-08";

export type PlanMonthId = "2026-09" | "2026-10" | "2026-11";

export type ProductMonthInput = {
  leads: number;
  newDeals: number;
  newCancel: number;
  expiringCount: number;
  renewedCount: number;
  paidLeadShare: number;
};

export type ProductInput = {
  id: string;
  name: string;
  ticketPrice: number;
  openingOnline: number;
  strategicWeight: number;
  actuals: Record<ReferenceMonthId, ProductMonthInput>;
  plannedExpiry: Record<PlanMonthId, number>;
};

export type PersonInput = {
  id: string;
  name: string;
  role: PersonRole;
  employment: PersonEmployment;
  julyLeads: number;
  augustLeads: number;
  julyDeals: number;
  augustDeals: number;
};

export type CompanyInput = {
  planningMonth: PlanMonthId;
  rateMonth: ReferenceMonthId;
  monthTargets: Record<PlanMonthId, number>;
  previousPaidLeadCost: number;
  organicLeadCapacity: number;
  conversionBuffer: number;
  scenario: ScenarioId;
};

export type ScenarioConfig = {
  id: ScenarioId;
  label: string;
  hint: string;
  conversion: number;
  retention: number;
  renewal: number;
  capacity: number;
};

export type OkrState = {
  company: CompanyInput;
  products: ProductInput[];
  people: PersonInput[];
};

export type ProductBaseline = ProductMonthInput & {
  id: string;
  name: string;
  ticketPrice: number;
  openingOnline: number;
  strategicWeight: number;
  conversionRate: number;
  newCancelRate: number;
  newRetained: number;
  newRetentionRate: number;
  expiryCancel: number;
  expiryCancelRate: number;
  renewalRate: number;
  increment: number;
  closingOnline: number;
  paidLeads: number;
  organicLeads: number;
  newDealRevenue: number;
  renewalRevenue: number;
};

export type ProductTarget = {
  id: string;
  name: string;
  incrementShare: number;
  nextExpiryCancel: number;
  requiredRetained: number;
  effectiveRetention: number;
  requiredGrossDeals: number;
  effectiveConversion: number;
  requiredLeads: number;
  paidLeadsNeeded: number;
  organicLeadsNeeded: number;
  projectedIncrement: number;
  projectedClosing: number;
  impliedNewCancel: number;
};

export type AuditItem = {
  id: string;
  ok: boolean;
  label: string;
  detail: string;
};

export type MonthSnapshot = {
  month: ReferenceMonthId;
  label: string;
  products: ProductBaseline[];
  increment: number;
  leads: number;
  newDeals: number;
  newCancel: number;
  newRetained: number;
  newRetentionRate: number;
  conversionRate: number;
  expiringCount: number;
  renewedCount: number;
  expiryCancel: number;
  renewalRate: number;
  paidLeads: number;
  organicLeads: number;
  paidShare: number;
  newDealRevenue: number;
  renewalRevenue: number;
  paidCpl: number;
  openingOnline: number;
  closingOnline: number;
};

export type MonthPlan = {
  month: PlanMonthId;
  label: string;
  products: ProductTarget[];
  targetIncrement: number;
  nextExpiring: number;
  nextExpiryCancel: number;
  requiredRetained: number;
  requiredGrossDeals: number;
  requiredLeads: number;
  paidLeadsByMix: number;
  paidLeadsByResidual: number;
  organicLeadsPlanned: number;
  projectedIncrement: number;
  projectedClosing: number;
  frontendNeeded: number;
  frontendNeededCeil: number;
  backendNeeded: number;
  backendNeededCeil: number;
  paidCostOriginal: number;
  paidCostCorrectedMix: number;
  paidCostCorrectedResidual: number;
  recommendedPaidLeads: number;
  recommendedPaidCost: number;
  openingOnline: number;
  targetClosing: number;
};

export type OkrModel = {
  july: MonthSnapshot;
  august: MonthSnapshot;
  references: MonthSnapshot[];
  baseline: MonthSnapshot;
  people: {
    list: PersonInput[];
    frontend: PersonInput[];
    backend: PersonInput[];
    frontendCount: number;
    frontendFte: number;
    frontendActiveCount: number;
    frontendDepartedCount: number;
    backendCount: number;
    leadsHandled: number;
    avgLeadsPerFrontend: number;
    avgDealsPerFrontend: number;
    conversionRate: number;
    julyLeads: number;
    augustLeads: number;
    julyDeals: number;
    augustDeals: number;
  };
  plans: MonthPlan[];
  target: MonthPlan;
  audit: AuditItem[];
  scenario: ScenarioConfig;
};
