import { NumberField, PercentField } from "@/components/okr/NumberField";
import { formatInt, formatMoney, formatPct, formatSigned } from "@/lib/okr/format";
import type { OkrModel, ProductInput, ProductMonthInput, ReferenceMonthId } from "@/lib/okr/types";

export function ProductBaselineTable({
  products,
  model,
  viewMonth,
  onChangeProduct,
  onChangeMonth,
  onRemove,
  onAdd,
}: {
  products: ProductInput[];
  model: OkrModel;
  viewMonth: ReferenceMonthId;
  onChangeProduct: (id: string, patch: Partial<ProductInput>) => void;
  onChangeMonth: (id: string, month: ReferenceMonthId, patch: Partial<ProductMonthInput>) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
}) {
  const snapshot = viewMonth === "2026-07" ? model.july : model.august;

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-[1280px] w-full border-collapse text-sm">
        <thead className="bg-slate-50 text-left text-xs tracking-wide text-slate-500">
          <tr>
            <th className="px-3 py-3 font-medium">产品</th>
            <th className="px-3 py-3 font-medium">客单价</th>
            <th className="px-3 py-3 font-medium">线索量</th>
            <th className="px-3 py-3 font-medium">新进/成交</th>
            <th className="px-3 py-3 font-medium">转化率</th>
            <th className="px-3 py-3 font-medium">新成交解约</th>
            <th className="px-3 py-3 font-medium">留存</th>
            <th className="px-3 py-3 font-medium">到期数</th>
            <th className="px-3 py-3 font-medium">续费</th>
            <th className="px-3 py-3 font-medium">到期解约</th>
            <th className="px-3 py-3 font-medium">当月净增</th>
            <th className="px-3 py-3 font-medium">9月到期</th>
            <th className="px-3 py-3 font-medium">10月到期</th>
            <th className="px-3 py-3 font-medium">11月到期</th>
            <th className="px-3 py-3 font-medium">付费占比</th>
            <th className="px-3 py-3 font-medium">战略权重</th>
            <th className="px-3 py-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const derived = snapshot.products.find((row) => row.id === product.id);
            const actual = product.actuals[viewMonth];
            if (!derived || !actual) return null;
            return (
              <tr key={product.id} className="border-t border-slate-100 align-top">
                <td className="px-3 py-3">
                  <input
                    aria-label={`${product.name}名称`}
                    className="w-36 rounded-md border border-slate-200 px-2 py-1 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                    value={product.name}
                    onChange={(event) => onChangeProduct(product.id, { name: event.target.value })}
                  />
                </td>
                <td className="px-3 py-3">
                  <NumberField
                    ariaLabel={`${product.name}客单价`}
                    value={product.ticketPrice}
                    onChange={(ticketPrice) => onChangeProduct(product.id, { ticketPrice })}
                  />
                </td>
                <td className="px-3 py-3">
                  <NumberField
                    ariaLabel={`${product.name}${snapshot.label}线索量`}
                    value={actual.leads}
                    onChange={(leads) => onChangeMonth(product.id, viewMonth, { leads })}
                  />
                </td>
                <td className="px-3 py-3">
                  <NumberField
                    ariaLabel={`${product.name}${snapshot.label}新成交`}
                    value={actual.newDeals}
                    onChange={(newDeals) => onChangeMonth(product.id, viewMonth, { newDeals })}
                  />
                </td>
                <td className="px-3 py-3 font-mono text-slate-700">
                  {formatPct(derived.conversionRate)}
                </td>
                <td className="px-3 py-3">
                  <NumberField
                    ariaLabel={`${product.name}${snapshot.label}新成交解约`}
                    value={actual.newCancel}
                    onChange={(newCancel) => onChangeMonth(product.id, viewMonth, { newCancel })}
                  />
                  <p className="mt-1 font-mono text-[11px] text-slate-500">
                    {formatPct(derived.newCancelRate)}
                  </p>
                </td>
                <td className="px-3 py-3 font-mono text-teal-800">
                  {formatInt(derived.newRetained)}
                  <p className="mt-1 text-[11px] text-slate-500">
                    {formatPct(derived.newRetentionRate)}
                  </p>
                </td>
                <td className="px-3 py-3">
                  <NumberField
                    ariaLabel={`${product.name}${snapshot.label}到期数`}
                    value={actual.expiringCount}
                    onChange={(expiringCount) =>
                      onChangeMonth(product.id, viewMonth, { expiringCount })
                    }
                  />
                </td>
                <td className="px-3 py-3">
                  <NumberField
                    ariaLabel={`${product.name}${snapshot.label}续费`}
                    value={actual.renewedCount}
                    onChange={(renewedCount) =>
                      onChangeMonth(product.id, viewMonth, { renewedCount })
                    }
                  />
                  <p className="mt-1 font-mono text-[11px] text-slate-500">
                    {formatPct(derived.renewalRate)}
                  </p>
                </td>
                <td className="px-3 py-3 font-mono text-rose-700">
                  {formatInt(derived.expiryCancel)}
                  <p className="mt-1 text-[11px] text-slate-500">
                    {formatPct(derived.expiryCancelRate)}
                  </p>
                </td>
                <td className="px-3 py-3 font-mono font-semibold text-slate-900">
                  {formatSigned(derived.increment)}
                </td>
                <td className="px-3 py-3">
                  <NumberField
                    ariaLabel={`${product.name}9月到期`}
                    value={product.plannedExpiry["2026-09"]}
                    onChange={(value) =>
                      onChangeProduct(product.id, {
                        plannedExpiry: { ...product.plannedExpiry, "2026-09": value },
                      })
                    }
                  />
                </td>
                <td className="px-3 py-3">
                  <NumberField
                    ariaLabel={`${product.name}10月到期`}
                    value={product.plannedExpiry["2026-10"]}
                    onChange={(value) =>
                      onChangeProduct(product.id, {
                        plannedExpiry: { ...product.plannedExpiry, "2026-10": value },
                      })
                    }
                  />
                </td>
                <td className="px-3 py-3">
                  <NumberField
                    ariaLabel={`${product.name}11月到期`}
                    value={product.plannedExpiry["2026-11"]}
                    onChange={(value) =>
                      onChangeProduct(product.id, {
                        plannedExpiry: { ...product.plannedExpiry, "2026-11": value },
                      })
                    }
                  />
                </td>
                <td className="px-3 py-3">
                  <PercentField
                    ariaLabel={`${product.name}${snapshot.label}付费线索占比`}
                    value={actual.paidLeadShare}
                    onChange={(paidLeadShare) =>
                      onChangeMonth(product.id, viewMonth, { paidLeadShare })
                    }
                  />
                </td>
                <td className="px-3 py-3">
                  <NumberField
                    ariaLabel={`${product.name}战略权重`}
                    value={product.strategicWeight}
                    onChange={(strategicWeight) =>
                      onChangeProduct(product.id, { strategicWeight })
                    }
                    step={0.1}
                    digits={1}
                  />
                </td>
                <td className="px-3 py-3">
                  <button
                    type="button"
                    className="text-xs text-slate-400 hover:text-rose-600"
                    onClick={() => onRemove(product.id)}
                  >
                    删除
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot className="border-t-2 border-slate-200 bg-slate-50 font-medium">
          <tr>
            <td className="px-3 py-3">{snapshot.label}合计</td>
            <td className="px-3 py-3 text-xs text-slate-500">
              新成交收入 {formatMoney(snapshot.newDealRevenue)}
            </td>
            <td className="px-3 py-3 font-mono">{formatInt(snapshot.leads)}</td>
            <td className="px-3 py-3 font-mono">{formatInt(snapshot.newDeals)}</td>
            <td className="px-3 py-3 font-mono">{formatPct(snapshot.conversionRate)}</td>
            <td className="px-3 py-3 font-mono">{formatInt(snapshot.newCancel)}</td>
            <td className="px-3 py-3 font-mono text-teal-800">
              {formatInt(snapshot.newRetained)}
            </td>
            <td className="px-3 py-3 font-mono">{formatInt(snapshot.expiringCount)}</td>
            <td className="px-3 py-3 font-mono">{formatInt(snapshot.renewedCount)}</td>
            <td className="px-3 py-3 font-mono text-rose-700">
              {formatInt(snapshot.expiryCancel)}
            </td>
            <td className="px-3 py-3 font-mono">{formatSigned(snapshot.increment)}</td>
            <td className="px-3 py-3 font-mono">
              {formatInt(
                products.reduce((sum, product) => sum + product.plannedExpiry["2026-09"], 0),
              )}
            </td>
            <td className="px-3 py-3 font-mono">
              {formatInt(
                products.reduce((sum, product) => sum + product.plannedExpiry["2026-10"], 0),
              )}
            </td>
            <td className="px-3 py-3 font-mono">
              {formatInt(
                products.reduce((sum, product) => sum + product.plannedExpiry["2026-11"], 0),
              )}
            </td>
            <td className="px-3 py-3 font-mono">{formatPct(snapshot.paidShare)}</td>
            <td className="px-3 py-3" colSpan={2}>
              <button
                type="button"
                onClick={onAdd}
                className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-white"
              >
                新增产品
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
