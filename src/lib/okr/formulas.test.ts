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

describe("buildOkrModel baseline identities", () => {
  const model = buildOkrModel(createDefaultState());

  it("keeps product-level identities exact", () => {
    for (const product of model.baseline.products) {
      assert.equal(product.newRetained, product.newDeals - product.newCancel);
      assert.equal(product.expiryCancel, product.expiringCount - product.renewedCount);
      assert.equal(product.increment, product.newRetained - product.expiryCancel);
      assert.equal(product.closingOnline, product.openingOnline + product.increment);
    }
  });

  it("matches the designed 7-8 month snapshot", () => {
    assert.equal(model.baseline.openingOnline, 1696);
    assert.equal(model.baseline.closingOnline, 1821);
    assert.equal(model.baseline.increment, 125);
    assert.equal(model.baseline.leads, 3122);
    assert.equal(model.baseline.newDeals, 305);
    assert.equal(model.baseline.newCancel, 52);
    assert.equal(model.baseline.newRetained, 253);
    assert.equal(model.baseline.expiryCancel, 128);
    assert.equal(model.baseline.renewedCount, 177);
    assert.equal(model.people.leadsHandled, 3122);
    assert.equal(model.people.frontendCount, 8);
    assert.equal(model.people.backendCount, 5);
  });

  it("uses 新成交留存 − 到期解约 as net increment", () => {
    assert.equal(
      model.baseline.newRetained - model.baseline.expiryCancel,
      model.baseline.increment,
    );
  });
});

describe("target reverse planning", () => {
  const model = buildOkrModel(createDefaultState());

  it("covers net +175 after replacing next-period expiry churn", () => {
    const allocated = model.target.products.reduce(
      (sum, product) => sum + product.incrementShare,
      0,
    );
    assert.equal(allocated, 175);
    assert.equal(
      model.target.requiredRetained,
      model.target.targetIncrement + model.target.nextExpiryCancel,
    );
    assert.equal(model.target.projectedIncrement, 175);
    assert.equal(model.target.targetClosing, 1821 + 175);
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

  it("scales backend headcount with deal volume", () => {
    const expected =
      (model.target.requiredGrossDeals / model.baseline.newDeals) *
      model.people.backendCount;
    assert.equal(model.target.backendNeeded, expected);
  });
});
