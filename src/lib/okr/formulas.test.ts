import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { allocateByWeight, buildOkrModel } from "./formulas";
import { createDefaultState } from "./mock-data";

describe("allocateByWeight", () => {
  it("keeps the integer total and prefers larger remainders", () => {
    const shares = allocateByWeight(175, [1.4, 1.1, 0.7, 1.6]);
    assert.equal(shares.reduce((sum, value) => sum + value, 0), 175);
    assert.equal(shares.length, 4);
    assert.ok(shares.every((value) => Number.isInteger(value)));
  });
});

describe("monthly baselines are independent", () => {
  const model = buildOkrModel(createDefaultState());

  it("does not treat July plus August as one previous cycle", () => {
    assert.equal(model.july.increment, 73);
    assert.equal(model.august.increment, 132);
    assert.notEqual(model.july.increment + model.august.increment, model.baseline.increment);
    assert.equal(model.baseline.month, "2026-08");
    assert.equal(model.baseline.increment, 132);
  });

  it("matches July actuals", () => {
    assert.equal(model.july.leads, 251);
    assert.equal(model.july.newDeals, 91);
    assert.equal(model.july.expiryCancel, 18);
    assert.equal(model.july.newRetained - model.july.expiryCancel, model.july.increment);
    assert.equal(model.people.julyLeads, 252);
    assert.equal(model.people.julyDeals, 127);
  });

  it("matches August actuals used as the rate month", () => {
    assert.equal(model.august.leads, 262);
    assert.equal(model.august.newDeals, 147);
    assert.equal(model.august.expiryCancel, 15);
    assert.equal(model.august.increment, 132);
    assert.equal(model.people.augustLeads, 262);
    assert.equal(model.people.augustDeals, 133);
    assert.equal(model.people.frontendActiveCount, 4);
    assert.equal(model.people.frontendDepartedCount, 2);
    assert.equal(model.people.frontendFte, 5);
    assert.equal(model.people.frontendCount, 5);
    assert.equal(model.people.backendCount, 3);
    assert.ok(!model.people.list.some((person) => person.name === "陈艳云"));
    assert.ok(model.people.list.every((person) => person.role === "backend" || person.julyLeads + person.augustLeads > 0));
  });

  it("keeps product-level identities exact in both months", () => {
    for (const snapshot of [model.july, model.august]) {
      for (const product of snapshot.products) {
        assert.equal(product.newRetained, product.newDeals - product.newCancel);
        assert.equal(product.expiryCancel, product.expiringCount - product.renewedCount);
        assert.equal(product.increment, product.newRetained - product.expiryCancel);
      }
    }
  });
});

describe("Sep/Oct/Nov reverse planning", () => {
  const model = buildOkrModel(createDefaultState());

  it("uses 175 / 200 / 225 as independent monthly net-growth targets", () => {
    assert.deepEqual(
      model.plans.map((plan) => [plan.month, plan.targetIncrement, plan.projectedIncrement]),
      [
        ["2026-09", 175, 175],
        ["2026-10", 200, 200],
        ["2026-11", 225, 225],
      ],
    );
    assert.equal(model.target.month, "2026-09");
    assert.equal(model.target.targetIncrement, 175);
  });

  it("covers each month's target after replacing that month's expiry churn", () => {
    for (const plan of model.plans) {
      const allocated = plan.products.reduce((sum, product) => sum + product.incrementShare, 0);
      assert.equal(allocated, plan.targetIncrement);
      assert.equal(plan.requiredRetained, plan.targetIncrement + plan.nextExpiryCancel);
    }
  });

  it("backs into leads from conversion and retention", () => {
    for (const product of model.target.products) {
      assert.ok(product.requiredGrossDeals >= product.requiredRetained);
      assert.ok(product.requiredLeads >= product.requiredGrossDeals);
      assert.equal(
        product.requiredRetained,
        product.incrementShare + product.nextExpiryCancel,
      );
    }
  });

  it("scales backend headcount with the selected month's deal volume", () => {
    const expected =
      (model.target.requiredGrossDeals / model.baseline.newDeals) * model.people.backendCount;
    assert.equal(model.target.backendNeeded, expected);
  });
});

describe("people roster rules", () => {
  const model = buildOkrModel(createDefaultState());
  const names = model.people.list.map((person) => person.name);

  it("drops 陈艳云 and zero-lead frontend, keeps backend", () => {
    assert.deepEqual(
      names.filter((name) => !["汤亚君", "曹洪燕", "彭慧泉"].includes(name)),
      ["王迎", "张菁菁", "张丽俐", "陈语", "易惠宁", "徐楚郁"],
    );
  });

  it("counts 张菁菁 and 张丽俐 as one FTE", () => {
    const departed = model.people.frontend.filter((person) => person.employment === "departed");
    assert.deepEqual(
      departed.map((person) => person.name).sort(),
      ["张丽俐", "张菁菁"],
    );
    assert.equal(model.people.frontendFte, 4 + 2 / 2);
  });

  it("exposes personal conversion from deals over leads", () => {
    const wang = model.people.frontend.find((person) => person.name === "王迎");
    assert.ok(wang);
    assert.equal(wang.augustLeads, 75);
    assert.equal(wang.augustDeals, 38);
    assert.equal(model.people.conversionRate, 133 / 262);
  });
});
