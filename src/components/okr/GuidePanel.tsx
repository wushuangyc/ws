export function GuidePanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">口径词典</h3>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
          <li>
            <strong className="text-slate-800">在网数（不去重）</strong>
            ：按产品席位计，一人多产品计多次。+175 是席位净增，不是独立用户净增。
          </li>
          <li>
            <strong className="text-slate-800">新进量</strong>
            ：本期新成交并进入在网的订单数，与新成交量同口径。
          </li>
          <li>
            <strong className="text-slate-800">线索量 / 转化率</strong>
            ：进线线索与成交单量之比。转化率由成交 ÷ 线索反算，避免手工填率与件数打架。
          </li>
          <li>
            <strong className="text-slate-800">新成交留存 / 解约</strong>
            ：仅统计「本期新成交后在统计期内又解约」的部分，不与到期解约重叠。
          </li>
          <li>
            <strong className="text-slate-800">到期量 / 续费 / 到期解约</strong>
            ：到期日历内的席位。续费不增加在网，到期解约才减少在网。
          </li>
          <li>
            <strong className="text-slate-800">对接数</strong>
            ：群聊客户数 + 私聊客户数，衡量销售触达负荷，不是消息条数。
          </li>
        </ul>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">对原始公式的修正</h3>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
          <li>「新成交增量」改为「新成交留存量」，避免和净增目标混用。</li>
          <li>
            净增恒等式统一为：<code>增量 = 新成交留存 − 到期解约</code>。到期续费只是保有，不进增量。
          </li>
          <li>
            「新应成交总量」拆成两层：需净留存成交 = 175 + 到期解约；需毛成交 = 需净留存 ÷ 留存率。
          </li>
          <li>原文中的「%」按除法实现：线索 = 毛成交 ÷ 转化率，前端人数 = 线索 ÷ 人均承接。</li>
          <li>到期量改用下周期到期日历，而不是直接复用上期到期数。</li>
          <li>增量 175 按战略权重拆到产品，再分别倒推线索，避免用公司平均转化率失真。</li>
          <li>付费成本改为「付费缺口 × 上期付费 CPL」，并保留原公式作对照。</li>
        </ul>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">建议 OKR 结构</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          <strong className="text-slate-800">O：</strong>
          9–10 月在网席位净增 175，期末在网达到目标值，且不靠牺牲续费或抬高付费 CPL 换量。
        </p>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm leading-6 text-slate-600">
          <li>KR1 新成交留存完成需净留存成交（覆盖到期解约后仍净增 175）。</li>
          <li>KR2 到期续费率不低于基线，杜绝「前面进、后面漏」。</li>
          <li>KR3 综合转化率不低于基线情景值（保守方案可设为基线的 90%）。</li>
          <li>KR4 付费 CPL 不高于上期，预算落在推荐成本带内。</li>
          <li>KR5 前端人均线索与对接负荷不超过基线人效的 110%，避免靠加班堆量。</li>
        </ol>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">使用方法</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-600">
          <li>把 7/1–8/31 真实数据替换假设表；个人台账线索合计应与产品线索对齐。</li>
          <li>用到期日历填「下期到期」，不要估算。这是净增目标能否成立的最大变量。</li>
          <li>先看基准情景能不能靠现有人效打到 +175；不能则看编制与付费预算，而不是先加转化率。</li>
          <li>战略权重往高客单、高留存产品倾斜；体验课只承担获客，不扛净增。</li>
          <li>承诺用保守或基准，冲刺用进取。三个情景的线索差，就是需要准备的弹性预算。</li>
        </ol>
      </article>
    </div>
  );
}
