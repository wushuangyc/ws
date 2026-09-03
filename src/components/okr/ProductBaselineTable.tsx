import { NumberField, PercentField } from "@/components/okr/NumberField";
import { formatInt, formatMoney, formatPct, formatSigned } from "@/lib/okr/format";
import type { OkrModel, ProductInput } from "@/lib/okr/types";

export function ProductBaselineTable({
  products,
  model,
  onChange,
  onRemove,
  onAdd,
}: {
  products: ProductInput[];
  model: OkrModel;
  onChange: (id: string, patch: Partial<ProductInput>) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-[1280px] w-full border-collapse text-sm">
        <thead className="bg-slate-50 text-left text-xs tracking-wide text-slate-500">
          <tr>
            <th className="px-3 py-3 font-medium">产品</th>
            <th className="px-3 py-3 font-medium">客单价</th>
            <th className="px-3 py-3 font-medium">期初在网</th>
            <th className="px-3 py-3 font-medium">线索量</th>
            <th className="px-3 py-3 font-medium">新进/成交</th>
            <th className="px-3 py-3 font-medium">转化率</th>
            <th className="px-3 py-3 font-medium">新成交解约</th>
            <th className="px-3 py-3 font-medium">留存</th>
            <th className="px-3 py-3 font-medium">到期数</th>
            <th className="px-3 py-3 font-medium">续费</th>
            <th className="px-3 py-3 font-medium">到期解约</th>
            <th className="px-3 py-3 font-medium">增量</th>
            <th className="px-3 py-3 font-medium">期末在网</th>
            <th className="px-3 py-3 font-medium">下期到期</th>
            <th className="px-3 py-3 font-medium">付费占比</th>
            <th className="px-3 py-3 font-medium">战略权重</th>
            <th className="px-3 py-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const derived = model.baseline.products.find((row) => row.id === product.id);
            if (!derived) return null;
            return (
              <tr key={product.id} className="border-t border-slate-100 align-top">
                <td className="px-3 py-3">
                  <input
                    aria-label={`${product.name}名称`}
                    className="w-36 rounded-md border border-slate-200 px-2 py-1 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                    value={product.name}
                    onChange={(event) => onChange(product.id, { name: event.target.value })}
                  />
                </td>
                <td className="px-3 py-3">
                  <NumberField
                    ariaLabel={`${product.name}客单价`}
                    value={product.ticketPrice}
                    onChange={(ticketPrice) => onChange(product.id, { ticketPrice })}
                  />
                </td>
                <td className="px-3 py-3">
                  <NumberField
                    ariaLabel={`${product.name}期初在网`}
                    value={product.openingOnline}
                    onChange={(openingOnline) => onChange(product.id, { openingOnline })}
                  />
                </td>
                <td className="px-3 py-3">
                  <NumberField
                    ariaLabel={`${product.name}线索量`}
                    value={product.leads}
                    onChange={(leads) => onChange(product.id, { leads })}
                  />
                </td>
                <td className="px-3 py-3">
                  <NumberField
                    ariaLabel={`${product.name}新成交`}
                    value={product.newDeals}
                    onChange={(newDeals) => onChange(product.id, { newDeals })}
                  />
                </td>
                <td className="px-3 py-3 font-mono text-slate-700">
                  {formatPct(derived.conversionRate)}
                </td>
                <td className="px-3 py-3">
                  <NumberField
                    ariaLabel={`${product.name}新成交解约`}
                    value={product.newCancel}
                    onChange={(newCancel) => onChange(product.id, { newCancel })}
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
                    ariaLabel={`${product.name}到期数`}
                    value={product.expiringCount}
                    onChange={(expiringCount) => onChange(product.id, { expiringCount })}
                  />
                </td>
                <td className="px-3 py-3">
                  <NumberField
                    ariaLabel={`${product.name}续费`}
                    value={product.renewedCount}
                    onChange={(renewedCount) => onChange(product.id, { renewedCount })}
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
                <td className="px-3 py-3 font-mono">{formatInt(derived.closingOnline)}</td>
                <td className="px-3 py-3">
                  <NumberField
                    ariaLabel={`${product.name}下期到期`}
                    value={product.nextExpiringCount}
                    onChange={(nextExpiringCount) => onChange(product.id, { nextExpiringCount })}
                  />
                </td>
                <td className="px-3 py-3">
                  <PercentField
                    ariaLabel={`${product.name}付费线索占比`}
                    value={product.paidLeadShare}
                    onChange={(paidLeadShare) => onChange(product.id, { paidLeadShare })}
                  />
                </td>
                <td className="px-3 py-3">
                  <NumberField
                    ariaLabel={`${product.name}战略权重`}
                    value={product.strategicWeight}
                    onChange={(strategicWeight) => onChange(product.id, { strategicWeight })}
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
            <td className="px-3 py-3">合计</td>
            <td className="px-3 py-3 text-xs text-slate-500">
              新成交收入 {formatMoney(model.baseline.newDealRevenue)}
            </td>
            <td className="px-3 py-3 font-mono">{formatInt(model.baseline.openingOnline)}</td>
            <td className="px-3 py-3 font-mono">{formatInt(model.baseline.leads)}</td>
            <td className="px-3 py-3 font-mono">{formatInt(model.baseline.newDeals)}</td>
            <td className="px-3 py-3 font-mono">{formatPct(model.baseline.conversionRate)}</td>
            <td className="px-3 py-3 font-mono">{formatInt(model.baseline.newCancel)}</td>
            <td className="px-3 py-3 font-mono text-teal-800">
              {formatInt(model.baseline.newRetained)}
            </td>
            <td className="px-3 py-3 font-mono">{formatInt(model.baseline.expiringCount)}</td>
            <td className="px-3 py-3 font-mono">{formatInt(model.baseline.renewedCount)}</td>
            <td className="px-3 py-3 font-mono text-rose-700">
              {formatInt(model.baseline.expiryCancel)}
            </td>
            <td className="px-3 py-3 font-mono">{formatSigned(model.baseline.increment)}</td>
            <td className="px-3 py-3 font-mono">{formatInt(model.baseline.closingOnline)}</td>
            <td className="px-3 py-3 font-mono">
              {formatInt(model.target.nextExpiring)}
            </td>
            <td className="px-3 py-3 font-mono">{formatPct(model.baseline.paidShare)}</td>
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
