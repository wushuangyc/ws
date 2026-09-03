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
    assert.equal(model.baseline.openingOnline, 638);
    assert.equal(model.baseline.closingOnline, 843);
    assert.equal(model.baseline.increment, 205);
    assert.equal(model.baseline.leads, 513);
    assert.equal(model.baseline.newDeals, 238);
    assert.equal(model.baseline.newCancel, 0);
    assert.equal(model.baseline.newRetained, 238);
    assert.equal(model.baseline.expiryCancel, 33);
    assert.equal(model.baseline.renewedCount, 33);
    assert.equal(model.people.leadsHandled, 520);
    assert.equal(model.people.frontendCount, 7);
    assert.equal(model.people.backendCount, 3);
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
    assert.equal(model.target.targetClosing, 843 + 175);
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
