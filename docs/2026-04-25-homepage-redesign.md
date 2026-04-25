# upio.ai 首页改版 — 团队知识库门面

**日期**: 2026-04-25
**范围**: 仅首页（`scripts/build-index.js` 一处文件）

## 目标

把 upio.ai 首页从"标题 + 文档列表"的极简存储页，升级为传达"团队知识库"定位的门面，并为未来按项目划分的子知识库预留视觉占位。

## 非目标

- 不动 `public/` 下任何已有 HTML 文件
- 不动 `vercel.json`、构建链路、域名 / DNS
- 不引入新依赖（保持 Node 内置 + 单文件构建脚本）
- 不做项目子目录、不做导航/搜索、不做 AI 问答

## 信息结构

页面从上到下三段：

1. **Header**
   - 主标题：`upio.ai`
   - 副标题：「团队知识库 · Team Knowledge Base」

2. **项目卡片区**（3 列网格，移动端单列）
   - **Vivi** — Telegram 上的 AI 梦境社交 mini-app
   - **Softie** — AI 图片/视频生成工作流
   - **Akke** — 抖音全屋定制智能获客
   - 每卡右上角灰色角标「敬请期待」
   - 整卡不可点击，无 hover 指针变化

3. **通用指南**
   - 标题：「通用指南」
   - 内容：当前 `build-index.js` 自动扫描生成的文档列表，样式适配深色主题
   - 现有文档：Claude Code Windows 攻略、VPN 教程、hello

## 视觉调性

- 深色主题（与 `claude-code-windows-guide.html` / `vpn-quick-start.html` 一致）
- 系统字体栈，无外部字体/图标依赖
- 主色：蓝紫渐变用于标题与卡片高亮
- 桌面 + 移动端响应式

## 改动清单

| 操作 | 文件 |
|------|------|
| 修改 | `scripts/build-index.js` —— 重写 HTML 模板，增加 hero 与项目卡片区，深色主题 |
| 新增 | 无 |
| 删除 | 无 |

## 部署与验证

1. 本地跑 `node scripts/build-index.js`，打开 `public/index.html` 视觉验证
2. `git push`，等待 Vercel 部署完成
3. `curl https://upio.ai/` 验证生产环境 HTML 含项目卡片区与「敬请期待」角标
