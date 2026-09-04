import { CopyButton } from "@/components/CopyButton";
import {
  customers,
  droppedItems,
  instrumentIssues,
  kpis,
  nextRoundGoals,
  phoneExtraQuestions,
  segmentRules,
  SURVEY_META,
  themes,
  wechatQuestions,
} from "@/data/survey";

const wechatScript = `您好，我是XX电力的回访，不是推销。占用您大约2分钟，回几个字就行。

1）整体服务，您打几分？1–5分，5分最好。
2）哪1–2点最有感？请回序号：1电费更便宜 2缴费方便 3能看明细 4中文沟通 5客服快 6用电稳定 7其他
3）电费有没有和换之前对比过？A更便宜 B差不多 C更贵 D还没对比
4）推荐给朋友的可能性，0–10分？
5）如果介绍朋友，您更希望：A我有奖励 B双方优惠 C不用奖励 D暂不介绍
6）如果只能改一件事，最希望改什么？没有就回「没有」。

您怎么方便怎么回，谢谢。`;

const phoneScript = `开场：
您好，我是XX电力客服，今天做例行服务回访，不是推销，大概5分钟。现在方便吗？不方便的话我可以换时间。

许可后：
谢谢。我先问整体感受，您怎么想都可以，没有标准答案。

主问题：
1. 整体来说，您对现在的电力服务打几分？1分非常不满意，5分非常满意。
   （等对方先说，不要提示「是不是挺好的」。）
2. 用下来哪一点最有感？电费、缴费、中文沟通、客服、用电稳定，都可以。
3. 和换过来之前比，电费您有没有对过账单？（对比过才问更便宜还是差不多；没对比就记「未对比」，不要写成下降。）
4. 如果朋友也在找电力公司，0到10分，您有多大可能推荐我们？
5. 假如朋友来问，您会怎么介绍我们？
6. 介绍朋友的话，您更希望有奖励、双方优惠，还是服务好就行、不用奖励？
7. 如果只能改一件事，您最希望改什么？

结束：
感谢您的时间。您提到的XX我们会记下，需要跟进的话会再联系，不需要就不会打扰。`;

const forbiddenScript = `不要说：
- 「电费是不是降了呀？」
- 「那您应该很满意吧？」
- 「方便的话帮我们介绍一下朋友呗？」
- 「那我给您记非常满意、电费下降。」

改成：
- 「用下来整体什么感觉？」
- 「电费这边，您有没有和换之前对过？」
- 「如果朋友来问，您会怎么说？」
- 客户没对比过，就记「未对比」，不要写电费下降。`;

function SectionHeading({
  kicker,
  title,
  desc,
}: {
  kicker: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="mb-8 max-w-3xl">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-teal-800">
        {kicker}
      </p>
      <h2 className="font-report mt-2 text-3xl font-semibold tracking-tight text-stone-900">
        {title}
      </h2>
      {desc ? (
        <p className="mt-3 text-base leading-7 text-stone-600">{desc}</p>
      ) : null}
    </div>
  );
}

export default function Home() {
  const satisfied = customers.filter((c) => c.q1Category === "满意").length;
  const aFans = customers.filter((c) => c.segment === "A类-铁粉").length;
  const wechat = customers.filter((c) => c.method === "微信文字").length;

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-24">
      <section id="overview" className="pt-14 sm:pt-16">
        <p className="text-sm font-medium text-teal-800">
          {SURVEY_META.wave} · {SURVEY_META.date} · n = {SURVEY_META.n}
        </p>
        <h1 className="font-report mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-stone-900 sm:text-[2.75rem] sm:leading-tight">
          {SURVEY_META.title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">
          这 5 条回访不能代表全部客户。它的价值是暴露现行问题和话术会把答案引向哪里，从而在放大样本前把工具修好。
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-500">
          原表中的电话与微信已隐去。客户以代号呈现。签约日期跨度约 2025-02 至 2026-06。
        </p>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <article
            key={kpi.label}
            className="rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_1px_0_rgba(28,25,23,0.04)]"
          >
            <p className="text-sm text-stone-500">{kpi.label}</p>
            <p className="mt-2 font-report text-3xl font-semibold text-stone-900">
              {kpi.value}
            </p>
            <p className="mt-2 text-sm leading-6 text-stone-600">{kpi.hint}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <p className="text-sm font-semibold text-amber-950">先记住这三件事</p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-7 text-amber-950">
          <li>
            「非常满意-电费下降」被用得太满：4/5 打了这个标签，但至少 1 人明确说没对比过费用。
          </li>
          <li>
            真正反复出现的优点是中文沟通、缴费/小程序、客服响应，不是已经核实的省钱。
          </li>
          <li>
            转介绍 5/5 都是高意愿，题目没有区分度；要介绍费和提 Wi-Fi 的人却全部记成无需跟进。
          </li>
        </ol>
      </section>

      <section className="mt-16">
        <SectionHeading
          kicker="Sample"
          title="样本长什么样"
          desc="5 人同一天回访，4 人微信文字、1 人电话。时长全部空白。这是一次工具试跑，不是市场结论。"
        />
        <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
          <table className="min-w-[920px] w-full text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-stone-500">
              <tr>
                <th className="px-4 py-3 font-medium">代号</th>
                <th className="px-4 py-3 font-medium">方式</th>
                <th className="px-4 py-3 font-medium">现行体验标签</th>
                <th className="px-4 py-3 font-medium">分层</th>
                <th className="px-4 py-3 font-medium">原话要点</th>
                <th className="px-4 py-3 font-medium">编码问题</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-stone-100 align-top last:border-0">
                  <td className="px-4 py-4 font-medium text-stone-900">
                    {c.id}
                    <span className="mt-0.5 block text-xs font-normal text-stone-500">
                      {c.alias} · 原表第 {c.row} 行
                    </span>
                  </td>
                  <td className="px-4 py-4 text-stone-700">{c.method}</td>
                  <td className="px-4 py-4 text-stone-700">{c.experience}</td>
                  <td className="px-4 py-4 text-stone-700">
                    {c.segment ?? <span className="text-rose-700">#N/A</span>}
                  </td>
                  <td className="px-4 py-4 text-stone-600 leading-6">{c.q1Quote}</td>
                  <td className="px-4 py-4">
                    <ul className="space-y-1 text-stone-600">
                      {c.flags.map((flag) => (
                        <li key={flag}>· {flag}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-stone-500">
          {satisfied}/5 被标「满意」，{aFans}/5 被标「A类-铁粉」，{wechat}/5
          走微信文字。金（C09）体验中性、仍表示会介绍，分层却是空值。
        </p>
      </section>

      <section id="findings" className="mt-20">
        <SectionHeading
          kicker="Findings"
          title="试点里真正能用的发现"
          desc="下面每条都对应原话。它们是下一轮要验证的假设，不是已经成立的市场结论。"
        />
        <div className="grid gap-5 lg:grid-cols-2">
          {themes.map((theme) => (
            <article
              key={theme.name}
              className="rounded-2xl border border-stone-200 bg-white p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-report text-xl font-semibold text-stone-900">
                  {theme.name}
                </h3>
                <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-900">
                  {theme.weight} · {theme.count} 人提到
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-stone-600">{theme.detail}</p>
              <div className="mt-4 space-y-2">
                {theme.quotes.map((quote) => (
                  <p
                    key={quote}
                    className="rounded-lg bg-stone-50 px-3 py-2 text-sm leading-6 text-stone-700"
                  >
                    「{quote}」
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {nextRoundGoals.map((goal) => (
            <article
              key={goal.title}
              className="rounded-2xl border border-teal-800/15 bg-teal-900 p-6 text-teal-50"
            >
              <h3 className="font-report text-lg font-semibold">{goal.title}</h3>
              <p className="mt-3 text-sm leading-7 text-teal-100">{goal.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="diagnosis" className="mt-20">
        <SectionHeading
          kicker="Instrument"
          title="现行问卷和记录表哪里会误导下一轮"
          desc="问题不在于这 5 个人答得不好，而在于题目、选项和结案方式会把答案提前写死。"
        />
        <div className="space-y-4">
          {instrumentIssues.map((issue) => (
            <article
              key={issue.id}
              className="grid gap-4 rounded-2xl border border-stone-200 bg-white p-6 md:grid-cols-[88px_1fr]"
            >
              <p className="font-report text-2xl font-semibold text-teal-800">{issue.id}</p>
              <div>
                <h3 className="text-lg font-semibold text-stone-900">{issue.title}</h3>
                <dl className="mt-3 grid gap-3 text-sm leading-6 text-stone-600 sm:grid-cols-3">
                  <div>
                    <dt className="font-medium text-stone-500">证据</dt>
                    <dd className="mt-1">{issue.evidence}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-stone-500">放大后的风险</dt>
                    <dd className="mt-1">{issue.risk}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-stone-500">怎么改</dt>
                    <dd className="mt-1 text-stone-800">{issue.fix}</dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-stone-200 bg-white">
          <table className="min-w-[720px] w-full text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-stone-500">
              <tr>
                <th className="px-4 py-3 font-medium">停用</th>
                <th className="px-4 py-3 font-medium">改成</th>
              </tr>
            </thead>
            <tbody>
              {droppedItems.map((item) => (
                <tr key={item.from} className="border-b border-stone-100 last:border-0">
                  <td className="px-4 py-4 text-stone-600">{item.from}</td>
                  <td className="px-4 py-4 text-stone-900">{item.to}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="next" className="mt-20">
        <SectionHeading
          kicker="Next round"
          title="下一轮：微信短版为主，电话只做加深"
          desc="试点 4/5 已经走微信文字。放大后先用 6 题短版收集可统计数据；电话只抽一部分做竞品、中文重要性和推荐语。"
        />

        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <h3 className="font-report text-xl font-semibold text-stone-900">建议抽法</h3>
          <ul className="mt-4 grid gap-3 text-sm leading-7 text-stone-600 md:grid-cols-2">
            <li>微信短版覆盖本轮全部可触达签约客户，目标先跑通 80–150 份，而不是一上来上千。</li>
            <li>按签约时长分层：3 个月内、3–12 个月、12 个月以上，避免只回访新客。</li>
            <li>中性/低感知（类似金）不要当废卷，单独看「稳定用户」占比。</li>
            <li>电话深访从微信里抽：NPS 9–10、NPS ≤6、以及提到激励/Wi-Fi 的人各若干。</li>
          </ul>
        </div>

        <h3 className="font-report mt-10 text-2xl font-semibold text-stone-900">
          微信短版 6 题
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
          控制在 2 分钟内、可以只回序号。选项来自本轮原话，不再让访问员事后概括成「电费下降」。
        </p>
        <div className="mt-6 space-y-4">
          {wechatQuestions.map((q) => (
            <article key={q.id} className="rounded-2xl border border-stone-200 bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <p className="text-xs font-semibold tracking-wide text-teal-800">{q.id}</p>
                <CopyButton text={`${q.id} ${q.ask}`} label="复制本题" />
              </div>
              <p className="mt-2 whitespace-pre-line text-base leading-7 text-stone-900">
                {q.ask}
              </p>
              <div className="mt-4 grid gap-3 text-sm leading-6 text-stone-600 sm:grid-cols-2">
                <p>
                  <span className="font-medium text-stone-500">为什么问：</span> {q.why}
                </p>
                <p>
                  <span className="font-medium text-stone-500">怎么记：</span> {q.code}
                </p>
              </div>
            </article>
          ))}
        </div>

        <h3 className="font-report mt-12 text-2xl font-semibold text-stone-900">
          电话加题（不要每通都问完）
        </h3>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {phoneExtraQuestions.map((q) => (
            <article key={q.id} className="rounded-2xl border border-stone-200 bg-white p-6">
              <p className="text-xs font-semibold tracking-wide text-teal-800">{q.id}</p>
              <p className="mt-2 text-base leading-7 text-stone-900">{q.ask}</p>
              <p className="mt-3 text-sm leading-6 text-stone-600">{q.why}</p>
            </article>
          ))}
        </div>

        <h3 className="font-report mt-12 text-2xl font-semibold text-stone-900">
          分层规则：不允许再出现 #N/A
        </h3>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-200 bg-white">
          <table className="min-w-[720px] w-full text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-stone-500">
              <tr>
                <th className="px-4 py-3 font-medium">分层 / 标签</th>
                <th className="px-4 py-3 font-medium">判定</th>
                <th className="px-4 py-3 font-medium">后续动作</th>
              </tr>
            </thead>
            <tbody>
              {segmentRules.map((rule) => (
                <tr key={rule.name} className="border-b border-stone-100 last:border-0">
                  <td className="px-4 py-4 font-medium text-stone-900">{rule.name}</td>
                  <td className="px-4 py-4 text-stone-600">{rule.when}</td>
                  <td className="px-4 py-4 text-stone-800">{rule.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="scripts" className="mt-20">
        <SectionHeading
          kicker="Talk track"
          title="下一轮话术：先听，再记，不诱导"
          desc="微信按短版逐条发；电话先拿许可。电费、推荐、激励都要等客户自己说。"
        />

        <div className="grid gap-5 lg:grid-cols-2">
          <article className="rounded-2xl border border-stone-200 bg-white p-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-report text-xl font-semibold text-stone-900">
                微信文字开场
              </h3>
              <CopyButton text={wechatScript} />
            </div>
            <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-7 text-stone-700">
              {wechatScript}
            </pre>
          </article>
          <article className="rounded-2xl border border-stone-200 bg-white p-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-report text-xl font-semibold text-stone-900">
                电话回访流程
              </h3>
              <CopyButton text={phoneScript} />
            </div>
            <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-7 text-stone-700">
              {phoneScript}
            </pre>
          </article>
        </div>

        <article className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-report text-xl font-semibold text-rose-950">
              禁止诱导，改用核对
            </h3>
            <CopyButton text={forbiddenScript} />
          </div>
          <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-7 text-rose-950">
            {forbiddenScript}
          </pre>
        </article>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-stone-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-stone-900">客户说「还行、没变化」</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              记 B 稳定用户。追问：「如果只能改一件事，您最希望改什么？」不要为了完整度硬问转介绍。
            </p>
          </article>
          <article className="rounded-2xl border border-stone-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-stone-900">客户说「希望有介绍费」</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              记激励敏感，回「我们记下了，规则确定后会再联系」。回访当时不承诺金额、不成交。
            </p>
          </article>
          <article className="rounded-2xl border border-stone-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-stone-900">客户提到 Wi-Fi / 套餐</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              记交叉销售。「需要的话后续由同事联系，今天回访到这里。」不要把调研变成推销。
            </p>
          </article>
        </div>
      </section>

      <section className="mt-20 rounded-2xl border border-stone-200 bg-white p-8">
        <h2 className="font-report text-2xl font-semibold text-stone-900">放大前的验收标准</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600">
          下一轮若仍出现这些情况，说明工具还没修好，先不要继续加量。
        </p>
        <ul className="mt-6 grid gap-3 text-sm leading-7 text-stone-700 md:grid-cols-2">
          <li>体验标签再次把「没对比过电费」写成「电费下降」。</li>
          <li>分类或分层出现 #N/A、空白、或时长仍全空。</li>
          <li>推荐意愿再次全体落在 8–10 分，没有 0–6 或 7–8。</li>
          <li>原话提到奖励 / Wi-Fi / 不满，后续动作仍是「无需跟进」。</li>
          <li>微信短版中位完成时间超过 4 分钟，或大量中途不回。</li>
          <li>访问员开场仍先问「电费降了吧」。 </li>
        </ul>
      </section>
    </div>
  );
}
