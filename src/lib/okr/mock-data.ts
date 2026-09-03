import type { OkrState, PersonInput, ProductInput } from "./types";
import { uid } from "./format";

export const STORAGE_KEY = "okr-workbench-v1";

export function createDefaultProducts(): ProductInput[] {
  return [
    {
      id: "flagship",
      name: "旗舰会员（年）",
      ticketPrice: 6800,
      openingOnline: 420,
      leads: 380,
      newDeals: 55,
      newCancel: 6,
      expiringCount: 48,
      renewedCount: 37,
      nextExpiringCount: 52,
      paidLeadShare: 0.62,
      strategicWeight: 1.4,
    },
    {
      id: "advanced",
      name: "进阶课（季）",
      ticketPrice: 2980,
      openingOnline: 680,
      leads: 920,
      newDeals: 92,
      newCancel: 14,
      expiringCount: 85,
      renewedCount: 53,
      nextExpiringCount: 90,
      paidLeadShare: 0.58,
      strategicWeight: 1.1,
    },
    {
      id: "starter",
      name: "体验课（月）",
      ticketPrice: 680,
      openingOnline: 510,
      leads: 1750,
      newDeals: 140,
      newCancel: 31,
      expiringCount: 160,
      renewedCount: 77,
      nextExpiringCount: 168,
      paidLeadShare: 0.7,
      strategicWeight: 0.7,
    },
    {
      id: "enterprise",
      name: "企业服务（年）",
      ticketPrice: 28000,
      openingOnline: 86,
      leads: 72,
      newDeals: 18,
      newCancel: 1,
      expiringCount: 12,
      renewedCount: 10,
      nextExpiringCount: 14,
      paidLeadShare: 0.35,
      strategicWeight: 1.6,
    },
  ];
}

export function createDefaultPeople(): PersonInput[] {
  return [
    { id: "p1", name: "张敏", role: "frontend", newLeadsHandled: 480, groupChats: 86, privateChats: 142 },
    { id: "p2", name: "李强", role: "frontend", newLeadsHandled: 445, groupChats: 78, privateChats: 128 },
    { id: "p3", name: "王芳", role: "frontend", newLeadsHandled: 410, groupChats: 72, privateChats: 118 },
    { id: "p4", name: "赵伟", role: "frontend", newLeadsHandled: 385, groupChats: 65, privateChats: 105 },
    { id: "p5", name: "陈静", role: "frontend", newLeadsHandled: 360, groupChats: 60, privateChats: 98 },
    { id: "p6", name: "刘洋", role: "frontend", newLeadsHandled: 335, groupChats: 55, privateChats: 90 },
    { id: "p7", name: "黄蕾", role: "frontend", newLeadsHandled: 360, groupChats: 62, privateChats: 102 },
    { id: "p8", name: "马超", role: "frontend", newLeadsHandled: 347, groupChats: 58, privateChats: 95 },
    { id: "p9", name: "周宁", role: "backend", newLeadsHandled: 0, groupChats: 40, privateChats: 55 },
    { id: "p10", name: "吴磊", role: "backend", newLeadsHandled: 0, groupChats: 36, privateChats: 48 },
    { id: "p11", name: "孙悦", role: "backend", newLeadsHandled: 0, groupChats: 32, privateChats: 44 },
    { id: "p12", name: "郑浩", role: "backend", newLeadsHandled: 0, groupChats: 28, privateChats: 40 },
    { id: "p13", name: "钱峰", role: "backend", newLeadsHandled: 0, groupChats: 30, privateChats: 42 },
  ];
}

export function createDefaultState(): OkrState {
  return {
    company: {
      baselineLabel: "2026年7–8月基线",
      baselineStart: "2026-07-01",
      baselineEnd: "2026-08-31",
      targetLabel: "2026年9–10月目标周期",
      targetStart: "2026-09-01",
      targetEnd: "2026-10-31",
      targetIncrement: 175,
      previousPaidLeadCost: 186000,
      organicLeadCapacity: 1150,
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
