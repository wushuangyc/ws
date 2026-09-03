import type { OkrState, PersonInput, ProductInput } from "./types";
import { uid } from "./format";

/** Bump when default snapshot changes so localStorage does not keep stale hypothetical rows. */
export const STORAGE_KEY = "okr-workbench-v2-mobius";

/**
 * 2026-07-01 ~ 2026-08-31 from MOBIUS业绩表格.xlsx
 *
 * 线索：客户进线（电力/号卡/WIFI/宽带，多业务进线可记到多个产品）
 * 新成交：业务成交的新购+复购（续约另记到期续费）
 * WIFI 期初：在网设备表 6/30 仍在网 329 + 4/25–6/30 新购复购 78
 * 号卡/宽带/电力期初：表无在网底账，用 2026 H1 新购+复购累计作可核对下限
 * 解约表最新到 2026-06，本期新成交解约按 0；WIFI 到期来自设备终止日
 */
export function createDefaultProducts(): ProductInput[] {
  return [
    {
      id: "electricity",
      name: "电力",
      ticketPrice: 0,
      openingOnline: 82,
      leads: 166,
      newDeals: 120,
      newCancel: 0,
      expiringCount: 0,
      renewedCount: 0,
      nextExpiringCount: 0,
      paidLeadShare: 0,
      strategicWeight: 1.6,
    },
    {
      id: "wifi",
      name: "WIFI",
      ticketPrice: 57000,
      openingOnline: 407,
      leads: 206,
      newDeals: 63,
      newCancel: 0,
      expiringCount: 66,
      renewedCount: 33,
      nextExpiringCount: 87,
      paidLeadShare: 87 / 206,
      strategicWeight: 1.2,
    },
    {
      id: "sim",
      name: "号卡",
      ticketPrice: 12000,
      openingOnline: 121,
      leads: 65,
      newDeals: 46,
      newCancel: 0,
      expiringCount: 0,
      renewedCount: 0,
      nextExpiringCount: 0,
      paidLeadShare: 17 / 65,
      strategicWeight: 1,
    },
    {
      id: "broadband",
      name: "宽带",
      ticketPrice: 34000,
      openingOnline: 28,
      leads: 76,
      newDeals: 9,
      newCancel: 0,
      expiringCount: 0,
      renewedCount: 0,
      nextExpiringCount: 0,
      paidLeadShare: 3 / 76,
      strategicWeight: 0.5,
    },
  ];
}

export function createDefaultPeople(): PersonInput[] {
  return [
    { id: "p1", name: "王迎", role: "frontend", newLeadsHandled: 143, groupChats: 0, privateChats: 143 },
    { id: "p2", name: "张菁菁", role: "frontend", newLeadsHandled: 125, groupChats: 0, privateChats: 125 },
    { id: "p3", name: "张丽俐", role: "frontend", newLeadsHandled: 97, groupChats: 0, privateChats: 97 },
    { id: "p4", name: "陈语", role: "frontend", newLeadsHandled: 73, groupChats: 0, privateChats: 73 },
    { id: "p5", name: "易惠宁", role: "frontend", newLeadsHandled: 69, groupChats: 0, privateChats: 69 },
    { id: "p6", name: "徐楚郁", role: "frontend", newLeadsHandled: 7, groupChats: 0, privateChats: 7 },
    { id: "p7", name: "陈艳云", role: "frontend", newLeadsHandled: 6, groupChats: 0, privateChats: 6 },
    { id: "p8", name: "汤亚君", role: "backend", newLeadsHandled: 0, groupChats: 0, privateChats: 0 },
    { id: "p9", name: "曹洪燕", role: "backend", newLeadsHandled: 0, groupChats: 0, privateChats: 0 },
    { id: "p10", name: "彭慧泉", role: "backend", newLeadsHandled: 0, groupChats: 0, privateChats: 0 },
  ];
}

export function createDefaultState(): OkrState {
  return {
    company: {
      baselineLabel: "2026年7–8月基线（MOBIUS业绩表）",
      baselineStart: "2026-07-01",
      baselineEnd: "2026-08-31",
      targetLabel: "2026年9–10月目标周期",
      targetStart: "2026-09-01",
      targetEnd: "2026-10-31",
      targetIncrement: 175,
      previousPaidLeadCost: 0,
      organicLeadCapacity: 409,
      conversionBuffer: 1,
      scenario: "base",
    },
    products: createDefaultProducts(),
    people: createDefaultPeople(),
  };
}

export function blankProduct(): ProductInput {
  return {
    id: uid("prod"),
    name: "新产品",
    ticketPrice: 1999,
    openingOnline: 0,
    leads: 0,
    newDeals: 0,
    newCancel: 0,
    expiringCount: 0,
    renewedCount: 0,
    nextExpiringCount: 0,
    paidLeadShare: 0.5,
    strategicWeight: 1,
  };
}

export function blankPerson(role: PersonInput["role"] = "frontend"): PersonInput {
  return {
    id: uid("psn"),
    name: "新同事",
    role,
    newLeadsHandled: 0,
    groupChats: 0,
    privateChats: 0,
  };
}
