export type SurveyMethod = "电话" | "微信文字";

export type ExperienceCode =
  | "非常满意-电费下降"
  | "还行-没感觉变化";

export type CustomerRecord = {
  id: string;
  row: number;
  alias: string;
  method: SurveyMethod;
  experience: ExperienceCode;
  q1Category: "满意" | null;
  q1Quote: string;
  referralReaction: string;
  referralBand: "高意愿 8-10 分";
  q2Quote: string;
  segment: "A类-铁粉" | null;
  followUp: string;
  flags: string[];
};

export const SURVEY_META = {
  title: "电力客户回访试点分析",
  wave: "第 1 轮试点",
  date: "2026-09-03",
  n: 5,
  purpose: "用小样本校准问题、编码规则与话术，再放大到下一轮",
} as const;

export const customers: CustomerRecord[] = [
  {
    id: "C06",
    row: 6,
    alias: "柴田",
    method: "微信文字",
    experience: "非常满意-电费下降",
    q1Category: "满意",
    q1Quote: "用得很满意，电费应该是下降了。",
    referralReaction: "愿意 / 没问题",
    referralBand: "高意愿 8-10 分",
    q2Quote: "没问题，用得很好，很满意。",
    segment: "A类-铁粉",
    followUp: "本次无需跟进",
    flags: ["电费为推测，未核对账单"],
  },
  {
    id: "C07",
    row: 7,
    alias: "WU",
    method: "微信文字",
    experience: "非常满意-电费下降",
    q1Category: "满意",
    q1Quote:
      "还没有对比过费用，但缴费方便很多。可以在微信小程序看到明细。最重要的是可以用中文沟通，对不懂日语的人是巨大便利。",
    referralReaction: "愿意 / 没问题",
    referralBand: "高意愿 8-10 分",
    q2Quote: "愿意，有机会的话。",
    segment: "A类-铁粉",
    followUp: "本次无需跟进",
    flags: ["被标成电费下降，但本人明确说没对比过", "中文服务是核心驱动"],
  },
  {
    id: "C08",
    row: 8,
    alias: "李",
    method: "电话",
    experience: "非常满意-电费下降",
    q1Category: "满意",
    q1Quote: "用得很满意，服务态度很好，有需求都能及时解决。",
    referralReaction: "愿意 / 没问题",
    referralBand: "高意愿 8-10 分",
    q2Quote: "没问题，希望能有转介绍费。",
    segment: "A类-铁粉",
    followUp: "本次无需跟进",
    flags: ["主动要转介绍激励，却标成无需跟进"],
  },
  {
    id: "C09",
    row: 9,
    alias: "金",
    method: "微信文字",
    experience: "还行-没感觉变化",
    q1Category: null,
    q1Quote: "没什么，和以前一样，没什么差别，只要不停电就行。",
    referralReaction: "愿意 / 没问题",
    referralBand: "高意愿 8-10 分",
    q2Quote: "会的。",
    segment: null,
    followUp: "本次无需跟进",
    flags: ["中性体验被写成 #N/A", "推荐意愿仍高，分层规则缺口"],
  },
  {
    id: "C10",
    row: 10,
    alias: "王",
    method: "微信文字",
    experience: "非常满意-电费下降",
    q1Category: "满意",
    q1Quote:
      "和以前的东北电力比，这是无敌的存在。沟通及时方便，客服响应快。",
    referralReaction: "愿意 / 没问题",
    referralBand: "高意愿 8-10 分",
    q2Quote:
      "会推荐给朋友。不需要折扣因为服务好。如果 Wi-Fi 能降价就完美了。",
    segment: "A类-铁粉",
    followUp: "本次无需跟进",
    flags: ["服务本身即可驱动推荐", "交叉销售线索未跟进"],
  },
];

export const kpis = [
  {
    label: "有效样本",
    value: "5",
    hint: "同日回访，只够校准工具，不够下结论",
  },
  {
    label: "微信文字占比",
    value: "4 / 5",
    hint: "放大后大概率仍以微信为主，题量必须能用文字答完",
  },
  {
    label: "被标「非常满意」",
    value: "4 / 5",
    hint: "其中 1 人明确没对比过电费，标签被用偏了",
  },
  {
    label: "转介绍高意愿",
    value: "5 / 5",
    hint: "8–10 分全员封顶，题目没有区分度",
  },
] as const;

export const themes = [
  {
    name: "中文沟通",
    count: 2,
    weight: "核心差异点",
    detail:
      "不懂日语的客户把中文客服当成决定性便利；对比对象是东北电力等传统公司。",
    quotes: ["最重要的是可以用中文沟通", "沟通及时方便，客服响应快"],
  },
  {
    name: "缴费与账单透明",
    count: 2,
    weight: "强便利点",
    detail: "微信小程序看明细、缴费更省心，减少「没缴费就停电」的焦虑。",
    quotes: ["缴费方便很多", "可以在微信小程序看到明细"],
  },
  {
    name: "电费下降",
    count: 1,
    weight: "被高估",
    detail:
      "只有 1 人主动说「应该下降了」，另 1 人明确没对比。现行编码却把 4 人打成「电费下降」。",
    quotes: ["电费应该是下降了", "还没有对比过费用"],
  },
  {
    name: "服务响应",
    count: 2,
    weight: "可复制卖点",
    detail: "态度好、有需求能及时解决、响应快，是相对传统电力公司的胜出点。",
    quotes: ["服务态度很好，有需求都能及时解决", "客服响应快"],
  },
  {
    name: "供电稳定",
    count: 1,
    weight: "保健因素",
    detail: "中性客户的底线是「不停电」。稳定本身不会产生惊喜，但失稳会立刻差评。",
    quotes: ["只要不停电就行"],
  },
  {
    name: "转介绍激励 / 交叉销售",
    count: 2,
    weight: "被漏跟进",
    detail: "一人要介绍费，一人说服务好到不需要折扣、但希望 Wi-Fi 降价。",
    quotes: ["希望能有转介绍费", "如果 Wi-Fi 能降价就完美了"],
  },
] as const;

export const instrumentIssues = [
  {
    id: "I1",
    title: "体验标签把「满意」和「电费下降」绑死了",
    evidence:
      "WU 原话是「还没有对比过费用」，却被记成「非常满意-电费下降」。柴田也只是「应该是下降了」。",
    risk: "下一轮会系统性高估省钱效果，低估中文服务和缴费便利。",
    fix: "满意度、电费感知、驱动因素拆成三题，禁止访问员根据印象套标签。",
  },
  {
    id: "I2",
    title: "分类过粗，中性样本变成 #N/A",
    evidence:
      "金的反馈是「还行、没感觉变化」，分类和客户分层都是 #N/A。",
    risk: "放大后中性用户会被当成脏数据丢掉，而这恰恰是需要激活的一层。",
    fix: "分类改成：非常满意 / 满意 / 一般 / 不满意；分层给「B 稳定用户」而不是空值。",
  },
  {
    id: "I3",
    title: "转介绍题没有区分度",
    evidence: "5 人全部落在「愿意 / 没问题」和「高意愿 8–10 分」。",
    risk: "社交礼貌会把真实推荐行为抬高。无法判断谁会真的介绍。",
    fix: "改 0–10 分（NPS）+「会怎么跟朋友说」+ 激励偏好，不要只问愿不愿意。",
  },
  {
    id: "I4",
    title: "后续动作全是「无需跟进」",
    evidence: "李要转介绍费，王提到 Wi-Fi 降价，金是低感知用户，三人都没有动作。",
    risk: "调研变成存档，线索无法进入运营。",
    fix: "按标签自动派发：激励敏感、交叉销售、低感知教育、风险挽回。",
  },
  {
    id: "I5",
    title: "过程字段几乎没记",
    evidence: "回访时长全部空白；5 人里 4 人是微信文字，电话只有 1 人。",
    risk: "无法判断题量是否过长，也无法比较渠道质量。",
    fix: "微信记来回条数和完成分钟；电话记时长。大样本先做微信短版。",
  },
  {
    id: "I6",
    title: "开场容易诱导「电费降了吧」",
    evidence: "体验反馈选项本身就叫「非常满意-电费下降」，访问员会按这个框去听。",
    risk: "客户会顺着说省钱，真正的中文服务、小程序便利被漏记。",
    fix: "先问整体感受，再单独问有没有对过账单。话术里禁止先提降价。",
  },
] as const;

export const nextRoundGoals = [
  {
    title: "验证真实驱动",
    text: "把「电费下降」从默认标签里拿出来，测量它和中文服务、缴费便利、响应速度谁更强。",
  },
  {
    title: "让分数能分开人",
    text: "总体满意度和推荐意愿必须能拉开档位，避免再次 5/5 封顶。",
  },
  {
    title: "把线索送进运营",
    text: "转介绍激励、Wi-Fi、低感知用户不再写「无需跟进」，每条原话对应一个动作。",
  },
] as const;

export const wechatQuestions = [
  {
    id: "W1",
    ask: "整体来说，您对现在的电力服务打几分？（1–5 分，5 分最好）",
    why: "先拿总体分，不和电费绑在一起。",
    code: "1–5 整数。4–5 为正向，3 为中性，1–2 为负向。",
  },
  {
    id: "W2",
    ask: "用下来，哪 1–2 点最有感？请直接回序号：\n1 电费更便宜  2 缴费方便  3 能看账单明细  4 中文沟通  5 客服响应快  6 用电稳定  7 其他（请写一句）",
    why: "把试点里真正出现的卖点做成可统计选项，避免访问员事后脑补。",
    code: "可多选，最多 2 项。选 7 必须跟原话。",
  },
  {
    id: "W3",
    ask: "和换之前比，电费您有没有对过？\nA 对比过，明显更便宜  B 对比过，差不多  C 对比过，更贵  D 还没对比过",
    why: "把「感知省钱」从满意度里拆出来。试点里已有人没对比却被标成下降。",
    code: "单选。A 才能记「电费下降」。D 不得记下降。",
  },
  {
    id: "W4",
    ask: "如果朋友也在找电力公司，您有多大可能推荐我们？（0–10 分，10 分一定会荐）",
    why: "用 NPS 拉开档位，替代「愿不愿意」。",
    code: "9–10 推荐者，7–8 被动，0–6 贬损。",
  },
  {
    id: "W5",
    ask: "如果介绍朋友，您更希望：\nA 介绍人有奖励  B 双方都有优惠  C 不用奖励，服务好就行  D 暂时不想介绍",
    why: "试点已出现「要介绍费」和「不需要折扣」两种态度，必须能量化。",
    code: "单选。A/B 打「激励敏感」标签并进入运营跟进。",
  },
  {
    id: "W6",
    ask: "如果只能改一件事，您最希望改什么？一句话就行。没有就回「没有」。",
    why: "给中性用户开口机会；也能接到 Wi-Fi 这类交叉销售。",
    code: "原话入库。提到套餐/Wi-Fi/价格/客服则打对应标签。",
  },
] as const;

export const phoneExtraQuestions = [
  {
    id: "P1",
    ask: "您换过来之前用的是哪家？当时为什么换？",
    why: "试点已出现东北电力对比，需要结构化记录竞品和切换理由。",
  },
  {
    id: "P2",
    ask: "日语沟通方不方便？中文客服对您有多重要？（不重要 / 加分 / 没有中文就不考虑）",
    why: "中文服务可能是获客壁垒，不能只靠开放题撞到。",
  },
  {
    id: "P3",
    ask: "假如朋友来问，您会怎么介绍我们？请用您自己的话讲一句。",
    why: "比「愿不愿意」更能判断真实推荐语，也可直接用于获客话术。",
  },
  {
    id: "P4",
    ask: "除了电，生活里还有没有一起办更方便的？（例如网络 / Wi-Fi）有兴趣我们再联系，没有也完全没关系。",
    why: "王已经主动提到 Wi-Fi。要邀请，不要推销。",
  },
] as const;

export const segmentRules = [
  {
    name: "A 铁粉",
    when: "总体 4–5 分，且 NPS 9–10",
    action: "可邀请做转介绍；按 W5 决定是否给激励。",
  },
  {
    name: "B 稳定用户",
    when: "总体 3 分，或「没感觉变化」，但供电无投诉",
    action: "做账单对比和教育，不硬推介绍。禁止写成 #N/A。",
  },
  {
    name: "C 风险",
    when: "总体 1–2 分，或 NPS 0–6，或提到停电 / 账单贵 / 联系不上",
    action: "当日派给客服挽回，调研表不能结案为无需跟进。",
  },
  {
    name: "激励敏感",
    when: "W5 选 A/B，或原话提到介绍费、返现",
    action: "进入转介绍试点名单。",
  },
  {
    name: "交叉销售",
    when: "提到 Wi-Fi、网络、其他套餐",
    action: "进入生活服务跟进，不在回访里成交。",
  },
] as const;

export const droppedItems = [
  {
    from: "问题1-体验反馈 = 非常满意-电费下降",
    to: "删除该复合标签。改 W1 总分 + W2 驱动 + W3 电费核对。",
  },
  {
    from: "问题1-分类 只有「满意」或 #N/A",
    to: "改为四档：非常满意 / 满意 / 一般 / 不满意。空值不允许提交。",
  },
  {
    from: "问题2 只问愿不愿意介绍",
    to: "改为 0–10 分 + 会怎么说 + 激励偏好。",
  },
  {
    from: "后续动作默认「本次无需跟进」",
    to: "无标签才可结案。有激励 / 交叉销售 / 风险必须派单。",
  },
  {
    from: "回访时长空白",
    to: "微信记完成分钟和来回条数；电话必填秒数。超时 4 分钟要减题。",
  },
] as const;
