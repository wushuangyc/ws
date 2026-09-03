import { formatInt, formatPct, formatSigned } from "@/lib/okr/format";
import type { OkrModel } from "@/lib/okr/types";

export function TargetPanel({ model }: { model: OkrModel }) {
  const maxLeads = Math.max(...model.target.products.map((row) => row.requiredLeads), 1);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-[1100px] w-full border-collapse text-sm">
          <thead className="bg-slate-50 text-left text-xs text-slate-500">
            <tr>
              <th className="px-3 py-3 font-medium">产品</th>
              <th className="px-3 py-3 font-medium">增量份额</th>
              <th className="px-3 py-3 font-medium">下期到期解约</th>
              <th className="px-3 py-3 font-medium">需净留存成交</th>
              <th className="px-3 py-3 font-medium">有效留存率</th>
              <th className="px-3 py-3 font-medium">需毛成交</th>
              <th className="px-3 py-3 font-medium">有效转化率</th>
              <th className="px-3 py-3 font-medium">需线索</th>
              <th className="px-3 py-3 font-medium">付费线索</th>
              <th className="px-3 py-3 font-medium">预计期末</th>
            </tr>
          </thead>
          <tbody>
            {model.target.products.map((product) => (
              <tr key={product.id} className="border-t border-slate-100">
                <td className="px-3 py-3 font-medium text-slate-900">{product.name}</td>
                <td className="px-3 py-3 font-mono">{formatSigned(product.incrementShare)}</td>
                <td className="px-3 py-3 font-mono text-rose-700">
                  {formatInt(product.nextExpiryCancel)}
                </td>
                <td className="px-3 py-3 font-mono font-semibold">
                  {formatInt(product.requiredRetained)}
                </td>
                <td className="px-3 py-3 font-mono">{formatPct(product.effectiveRetention)}</td>
                <td className="px-3 py-3 font-mono">{formatInt(product.requiredGrossDeals)}</td>
                <td className="px-3 py-3 font-mono">{formatPct(product.effectiveConversion)}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold">{formatInt(product.requiredLeads)}</span>
                    <span
                      className="h-2 rounded-full bg-teal-600/80"
                      style={{ width: `${(product.requiredLeads / maxLeads) * 96}px` }}
                    />
                  </div>
                </td>
                <td className="px-3 py-3 font-mono">{formatInt(product.paidLeadsNeeded)}</td>
                <td className="px-3 py-3 font-mono">{formatInt(product.projectedClosing)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2 border-slate-200 bg-amber-50/70 font-medium">
            <tr>
              <td className="px-3 py-3">目标合计</td>
              <td className="px-3 py-3 font-mono">{formatSigned(model.target.targetIncrement)}</td>
              <td className="px-3 py-3 font-mono">{formatInt(model.target.nextExpiryCancel)}</td>
              <td className="px-3 py-3 font-mono">{formatInt(model.target.requiredRetained)}</td>
              <td className="px-3 py-3 text-xs text-slate-500">按产品有效留存倒推</td>
              <td className="px-3 py-3 font-mono">{formatInt(model.target.requiredGrossDeals)}</td>
              <td className="px-3 py-3 text-xs text-slate-500">含转化缓冲</td>
              <td className="px-3 py-3 font-mono">{formatInt(model.target.requiredLeads)}</td>
              <td className="px-3 py-3 font-mono">{formatInt(model.target.paidLeadsByMix)}</td>
              <td className="px-3 py-3 font-mono">{formatInt(model.target.targetClosing)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="text-sm leading-6 text-slate-600">
        推演路径：目标净增 {formatInt(model.target.targetIncrement)} + 下期到期解约{" "}
        {formatInt(model.target.nextExpiryCancel)} = 需净留存成交{" "}
        {formatInt(model.target.requiredRetained)}。再按各产品留存率倒推毛成交，按转化率倒推线索。
        毛成交对留存使用向上取整，因此编制与线索会略高于理论最小值。
      </p>
    </div>
  );
}
