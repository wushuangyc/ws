# 在网增长 OKR 工作台

按自然月经营：7 月、8 月是两个独立参考月，用来看趋势，**不是**「7+8 合成上个周期」。规划月是 9、10、11 月，净增目标分别为 175、200、225。

## 在自己电脑里打开

先安装 [Node.js 20 或更新](https://nodejs.org/)（安装时勾选 npm）。然后打开终端，进入你放代码的文件夹：

```bash
git clone https://github.com/wushuangyc/ws.git
cd ws
git checkout cursor/okr-workbench-html-c8bd
npm install
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)。

如果仓库已经克隆过，改成：

```bash
cd ws
git fetch origin
git checkout cursor/okr-workbench-html-c8bd
git pull origin cursor/okr-workbench-html-c8bd
npm install
npm run dev
```

没有 Git 时，到 [这个 PR](https://github.com/wushuangyc/ws/pull/4) 点 `Code` → `Download ZIP`，解压后在该文件夹里执行 `npm install` 和 `npm run dev`。

公式自检：

```bash
npm run test:okr
```

## 页面里能做什么

- 切换规划月，编辑该月净增目标，倒推当月线索、成交和编制
- 在基线表里分别查看/编辑 7 月和 8 月件数，自动反算转化率、留存率和当月净增
- 对照 7 月 → 8 月趋势，而不是把两月加总
- 统计每个人 7 月/8 月线索承接，测算前端/后端编制
- 数据保存在浏览器本地，可导出 JSON

当前预置的是 MOBIUS 业绩表 2026 年 7 月、8 月分月实数（电力、号卡、WIFI、宽带）。
