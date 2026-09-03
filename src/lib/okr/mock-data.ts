import type {
  CompanyInput,
  OkrState,
  PersonEmployment,
  PersonInput,
  ProductInput,
  ProductMonthInput,
  ReferenceMonthId,
} from "./types";
import { uid } from "./format";

/** Bump when people rows change so localStorage does not keep filtered or group-chat rows. */
export const STORAGE_KEY = "okr-workbench-v5-roster";

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
 *
 * 人员：陈艳云、徐楚郁、汤亚君、曹洪燕、彭慧泉不纳入统计；线索合计为 0 的前端不计入；张菁菁、张丽俐为离职，两人计 1 编。
 * 个人成交：业务成交表 7–8 月担当合计，按该人分月线索占比拆到 7/8 月。
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

export const EXCLUDED_PEOPLE_NAMES = new Set(["徐楚郁", "汤亚君", "曹洪燕", "彭慧泉", "陈艳云"]);

export function createDefaultPeople(): PersonInput[] {
  return [
    person("p1", "王迎", "active", 68, 35, 75, 38),
    person("p2", "张菁菁", "departed", 107, 61, 18, 10),
    person("p3", "张丽俐", "departed", 70, 28, 27, 11),
    person("p4", "陈语", "active", 0, 0, 73, 20),
    person("p5", "易惠宁", "active", 0, 0, 69, 54),
  ];
}

function person(
  id: string,
  name: string,
  employment: PersonEmployment,
  julyLeads: number,
  julyDeals: number,
  augustLeads: number,
  augustDeals: number,
  role: PersonInput["role"] = "frontend",
): PersonInput {
  return {
    id,
    name,
    role,
    employment,
    julyLeads,
    julyDeals,
    augustLeads,
    augustDeals,
  };
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
    employment: "active",
    julyLeads: 0,
    augustLeads: 0,
    julyDeals: 0,
    augustDeals: 0,
  };
}

export function personLeadsIn(person: PersonInput, month: ReferenceMonthId): number {
  return month === "2026-07" ? person.julyLeads : person.augustLeads;
}

export function personDealsIn(person: PersonInput, month: ReferenceMonthId): number {
  return month === "2026-07" ? person.julyDeals : person.augustDeals;
}

export function personLeadTotal(person: PersonInput): number {
  return person.julyLeads + person.augustLeads;
}

/** Drop named exclusions; zero-lead frontend also stay out of productivity math. */
export function countsTowardPeopleStats(person: PersonInput): boolean {
  if (EXCLUDED_PEOPLE_NAMES.has(person.name)) return false;
  if (person.role === "backend") return true;
  return personLeadTotal(person) > 0;
}
