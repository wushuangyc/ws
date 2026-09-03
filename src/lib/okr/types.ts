export type ScenarioId = "conservative" | "base" | "aggressive";

export type PersonRole = "frontend" | "backend";

export type ProductInput = {
  id: string;
  name: string;
  ticketPrice: number;
  openingOnline: number;
  leads: number;
  newDeals: number;
  newCancel: number;
  expiringCount: number;
  renewedCount: number;
  nextExpiringCount: number;
  paidLeadShare: number;
  strategicWeight: number;
};

export type PersonInput = {
  id: string;
  name: string;
  role: PersonRole;
  newLeadsHandled: number;
  groupChats: number;
  privateChats: number;
};

export type CompanyInput = {
  baselineLabel: string;
  baselineStart: string;
  baselineEnd: string;
  targetLabel: string;
  targetStart: string;
  targetEnd: string;
  targetIncrement: number;
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

export type ProductBaseline = ProductInput & {
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

export type OkrModel = {
  baseline: {
    products: ProductBaseline[];
    openingOnline: number;
    closingOnline: number;
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
  };
  people: {
    list: PersonInput[];
    frontend: PersonInput[];
    backend: PersonInput[];
    frontendCount: number;
    backendCount: number;
    leadsHandled: number;
    avgLeadsPerFrontend: number;
    avgHandoffPerPerson: number;
    avgHandoffFrontend: number;
    totalGroup: number;
    totalPrivate: number;
    totalHandoff: number;
  };
  target: {
    products: ProductTarget[];
    openingOnline: number;
    targetClosing: number;
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
  };
  audit: AuditItem[];
  scenario: ScenarioConfig;
};
