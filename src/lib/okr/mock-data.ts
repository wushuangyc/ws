import type {
  CompanyInput,
  OkrState,
  PersonInput,
  ProductInput,
  ProductMonthInput,
  ReferenceMonthId,
} from "./types";
import { uid } from "./format";

/** Bump when default snapshot shape changes so localStorage does not keep a two-month lump. */
export const STORAGE_KEY = "okr-workbench-v3-monthly";

function month(
  leads: number,
  newDeals: number,
  expiringCount: number,
  renewedCount: number,
  paidLeadShare: number,
): ProductMonthInput {
  return {
    leads,
    newDeals,
    newCancel: 0,
    expiringCount,
    renewedCount,
    paidLeadShare,
  };
}

/**
 * Monthly actuals from MOBIUS业绩表格.xlsx. July and August are independent
 * calendar months, not one combined baseline period.
 *
 * 线索：客户进线（电力/号卡/WIFI/宽带，多业务可记到多个产品）
 * 新成交：业务成交的新购+复购（续约另记到期续费）
 * WIFI 到期：在网设备终止日落在该自然月、且未标解约
 * 付费线索：进线渠道 = 广告投放
 * 解约表最新到 2026-06，7/8 月新成交解约按 0
 */
export function createDefaultProducts(): ProductInput[] {
  return [
    {
      id: "electricity",
      name: "电力",
      ticketPrice: 0,
      openingOnline: 82,
      strategicWeight: 1.6,
      actuals: {
        "2026-07": month(107, 57, 0, 0, 0),
        "2026-08": month(59, 63, 0, 0, 0),
      },
      plannedExpiry: { "2026-09": 0, "2026-10": 0, "2026-11": 0 },
    },
    {
      id: "wifi",
      name: "WIFI",
      ticketPrice: 57000,
      openingOnline: 407,
      strategicWeight: 1.2,
      actuals: {
        "2026-07": month(97, 22, 29, 11, 56 / 97),
        "2026-08": month(109, 41, 37, 22, 31 / 109),
      },
      plannedExpiry: { "2026-09": 47, "2026-10": 40, "2026-11": 26 },
    },
    {
      id: "sim",
      name: "号卡",
      ticketPrice: 12000,
      openingOnline: 121,
      strategicWeight: 1,
      actuals: {
        "2026-07": month(21, 8, 0, 0, 9 / 21),
        "2026-08": month(44, 38, 0, 0, 8 / 44),
      },
      plannedExpiry: { "2026-09": 0, "2026-10": 0, "2026-11": 0 },
    },
    {
      id: "broadband",
      name: "宽带",
      ticketPrice: 34000,
      openingOnline: 28,
      strategicWeight: 0.5,
      actuals: {
        "2026-07": month(26, 4, 0, 0, 3 / 26),
        "2026-08": month(50, 5, 0, 0, 0),
      },
      plannedExpiry: { "2026-09": 0, "2026-10": 0, "2026-11": 0 },
    },
  ];
}

export function createDefaultPeople(): PersonInput[] {
  return [
    { id: "p1", name: "王迎", role: "frontend", julyLeads: 68, augustLeads: 75, groupChats: 0 },
    { id: "p2", name: "张菁菁", role: "frontend", julyLeads: 107, augustLeads: 18, groupChats: 0 },
    { id: "p3", name: "张丽俐", role: "frontend", julyLeads: 70, augustLeads: 27, groupChats: 0 },
    { id: "p4", name: "陈语", role: "frontend", julyLeads: 0, augustLeads: 73, groupChats: 0 },
    { id: "p5", name: "易惠宁", role: "frontend", julyLeads: 0, augustLeads: 69, groupChats: 0 },
    { id: "p6", name: "徐楚郁", role: "frontend", julyLeads: 7, augustLeads: 0, groupChats: 0 },
    { id: "p7", name: "陈艳云", role: "frontend", julyLeads: 3, augustLeads: 3, groupChats: 0 },
    { id: "p8", name: "汤亚君", role: "backend", julyLeads: 0, augustLeads: 0, groupChats: 0 },
    { id: "p9", name: "曹洪燕", role: "backend", julyLeads: 0, augustLeads: 0, groupChats: 0 },
    { id: "p10", name: "彭慧泉", role: "backend", julyLeads: 0, augustLeads: 0, groupChats: 0 },
  ];
}

export function createDefaultCompany(): CompanyInput {
  return {
    planningMonth: "2026-09",
    rateMonth: "2026-08",
    monthTargets: {
      "2026-09": 175,
      "2026-10": 200,
      "2026-11": 225,
    },
    previousPaidLeadCost: 0,
    organicLeadCapacity: 223,
    conversionBuffer: 1,
    scenario: "base",
  };
}

export function createDefaultState(): OkrState {
  return {
    company: createDefaultCompany(),
    products: createDefaultProducts(),
    people: createDefaultPeople(),
  };
}

function emptyMonth(): ProductMonthInput {
  return month(0, 0, 0, 0, 0.5);
}

export function blankProduct(): ProductInput {
  return {
    id: uid("prod"),
    name: "新产品",
    ticketPrice: 1999,
    openingOnline: 0,
    strategicWeight: 1,
    actuals: {
      "2026-07": emptyMonth(),
      "2026-08": emptyMonth(),
    },
    plannedExpiry: { "2026-09": 0, "2026-10": 0, "2026-11": 0 },
  };
}

export function blankPerson(role: PersonInput["role"] = "frontend"): PersonInput {
  return {
    id: uid("psn"),
    name: "新同事",
    role,
    julyLeads: 0,
    augustLeads: 0,
    groupChats: 0,
  };
}

export function personLeadsIn(person: PersonInput, month: ReferenceMonthId): number {
  return month === "2026-07" ? person.julyLeads : person.augustLeads;
}
