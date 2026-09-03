import { formatInt } from "@/lib/okr/format";
import type { PlanMonthId } from "@/lib/okr/types";

const DEFAULT_TARGETS: Record<PlanMonthId, number> = {
  "2026-09": 175,
  "2026-10": 200,
  "2026-11": 225,
};

export function GuidePanel({
  monthTargets = DEFAULT_TARGETS,
}: {
  monthTargets?: Record<PlanMonthId, number>;
}) {
  const targets = {
    "2026-09": monthTargets["2026-09"] ?? DEFAULT_TARGETS["2026-09"],
    "2026-10": monthTargets["2026-10"] ?? DEFAULT_TARGETS["2026-10"],
    "2026-11": monthTargets["2026-11"] ?? DEFAULT_TARGETS["2026-11"],
  };
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">口径词典</h3>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
          <li>
            <strong className="text-slate-800">周期按自然月</strong>
            ：7 月、8 月是两个独立参考月，用来看趋势，不是「7+8 合成上个周期」。规划月是 9、10、11 月，各有各的净增目标。
          </li>
          <li>
            <strong className="text-slate-800">净增（不去重）</strong>
            ：按产品席位计，一人多产品计多次。考核的是当月席位净增，不是独立用户，也不考核在网总量。
          </li>
          <li>
            <strong className="text-slate-800">新进量</strong>
            ：当月新成交并进入在网的订单数，与新成交量同口径。
          </li>
          <li>
            <strong className="text-slate-800">线索量 / 转化率</strong>
            ：进线线索与成交单量之比。转化率由成交 ÷ 线索反算。
          </li>
          <li>
            <strong className="text-slate-800">到期量 / 续费 / 到期解约</strong>
            ：到期日历落在该自然月的席位。续费不增加在网，到期解约才减少在网。
          </li>
          <li>
            <strong className="text-slate-800">个人线索 / 成交 / 转化率</strong>
            ：只看进线条数和成交单量，转化率 = 成交 ÷ 线索。不再统计群聊对接数。线索合计为 0 的前端视为早期离职，不进入人效。张菁菁、张丽俐为离职，两人按 1 编计。
          </li>
        </ul>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">对原始公式的修正</h3>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
          <li>「新成交增量」改为「新成交留存量」，避免和净增目标混用。</li>
          <li>
            净增恒等式统一为：<code>当月增量 = 当月新成交留存 − 当月到期解约</code>。
          </li>
          <li>
            每个规划月单独倒推：需净留存成交 = 当月目标净增 + 当月到期解约；需毛成交 = 需净留存 ÷ 留存率。
          </li>
          <li>费率默认取最近完整月（8月）；7月只作对照，不与 8 月加总。</li>
          <li>当月到期用 WIFI 设备终止日落在该月的日历，而不是复用上月到期数。</li>
          <li>付费成本改为「付费缺口 × 费率月付费 CPL」，并保留原公式作对照。</li>
        </ul>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">建议 OKR 结构</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          <strong className="text-slate-800">O：</strong>
          9 月在网用户净增 {formatInt(targets["2026-09"])}、10 月净增{" "}
          {formatInt(targets["2026-10"])}、11 月净增 {formatInt(targets["2026-11"])}
          ，且不靠牺牲续费或抬高付费 CPL 换量。不考核在网总量。
        </p>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm leading-6 text-slate-600">
          <li>KR1 各月新成交留存覆盖当月到期解约后，仍打到该月净增目标。</li>
          <li>KR2 到期续费率不低于 8 月基线，杜绝「前面进、后面漏」。</li>
          <li>KR3 综合转化率不低于费率月情景值（保守方案可设为 90%）。</li>
          <li>KR4 付费 CPL 不高于费率月，预算落在推荐成本带内。</li>
          <li>KR5 前端人均线索不超过费率月人效的 110%（离职两人计一编）。</li>
        </ol>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">使用方法</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-600">
          <li>
            顶栏切换规划月（9/10/11）。7 月和 8 月只在基线区对照趋势，不要把两月加总当成上个周期。
          </li>
          <li>
            底数来自 MOBIUS 业绩表：线索看「客户进线」，成交看「业务成交」新购+复购，WIFI
            到期看「WIFI在网设备」终止日所在自然月。
          </li>
          <li>解约表最新到 6 月，7/8 月新成交解约按 0；补上后请改对应月的「新成交解约」。</li>
          <li>表内无投放成本，付费预算需手工填「费率月付费线索总成本」才会算出金额。</li>
          <li>战略权重默认向电力、WIFI 倾斜；承诺用基准或保守，进取只作冲刺上限。</li>
        </ol>
      </article>
    </div>
  );
}
