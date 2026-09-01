# WS

基于 **Next.js + TypeScript + Tailwind CSS** 的可运行 Web 起步项目。

## 技术栈

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- ESLint

## 快速开始

```bash
npm install
npm run dev
```

浏览器访问 [http://localhost:3000](http://localhost:3000)。

## 常用脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run start` | 启动生产服务器 |
| `npm run lint` | 运行 ESLint |

## 项目结构

```text
src/
  app/           # 路由与页面（App Router）
  components/    # 通用布局组件（Header / Footer）
.cursor/
  environment.json  # Cursor Cloud Agent 环境配置
```

## 海报资料

后续战报 / 庆祝海报以 [`docs/posters/STYLE.md`](docs/posters/STYLE.md) 和 [`docs/posters/references/mobius-fire-hero.png`](docs/posters/references/mobius-fire-hero.png) 为准。

## Cursor 环境

`.cursor/environment.json` 已配置：

- `install`: `npm install`
- `start`: `npm run dev`
