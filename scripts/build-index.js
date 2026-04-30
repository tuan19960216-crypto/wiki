const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

const PROJECTS = [
  { name: 'Vivi', tagline: 'Telegram Mini App · AI 角色 RP 对话', href: '/vivi/' },
  { name: 'Softie', tagline: 'AI 陪伴聊天 · 美国市场（含 Web + Android）', href: '/softie/' },
  { name: 'Akke', tagline: '抖音全屋定制智能获客', href: '/akke/' },
];

function getHtmlFiles(dir, base = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const rel = path.join(base, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getHtmlFiles(path.join(dir, entry.name), rel));
    } else if (entry.name.endsWith('.html') && entry.name !== 'index.html') {
      const stat = fs.statSync(path.join(dir, entry.name));
      const content = fs.readFileSync(path.join(dir, entry.name), 'utf-8');
      const titleMatch = content.match(/<title>(.*?)<\/title>/i);
      const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
      const title = titleMatch ? titleMatch[1] : h1Match ? h1Match[1].replace(/<[^>]*>/g, '') : entry.name.replace('.html', '');
      files.push({
        path: rel,
        title,
        modified: stat.mtime,
        folder: base || 'root',
      });
    }
  }
  return files;
}

const files = getHtmlFiles(publicDir);
files.sort((a, b) => b.modified - a.modified);

const groups = {};
for (const f of files) {
  if (!groups[f.folder]) groups[f.folder] = [];
  groups[f.folder].push(f);
}

const FOLDER_LABELS = {
  root: '通用指南',
  softie: 'Softie 项目',
  akke: 'Akke 项目',
  vivi: 'Vivi 项目',
};

const folderSections = Object.entries(groups)
  .map(([folder, items]) => {
    const folderName = FOLDER_LABELS[folder] || folder.replace(/\//g, ' / ');
    const links = items
      .map(f => {
        const date = f.modified.toISOString().split('T')[0];
        const href = '/' + f.path.replace(/\.html$/, '');
        return `          <li><a href="${href}">${f.title}</a><span class="date">${date}</span></li>`;
      })
      .join('\n');
    return `      <section class="docs-section">
        <h2>${folderName}</h2>
        <ul class="doc-list">
${links}
        </ul>
      </section>`;
  })
  .join('\n');

const projectCards = PROJECTS.map(p => {
  if (p.href) {
    return `        <a class="project-card project-card--live" href="${p.href}">
          <span class="badge badge--live">进入</span>
          <h3>${p.name}</h3>
          <p>${p.tagline}</p>
        </a>`;
  }
  return `        <article class="project-card">
          <span class="badge">敬请期待</span>
          <h3>${p.name}</h3>
          <p>${p.tagline}</p>
        </article>`;
}).join('\n');

const totalCount = files.length;

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>upio.ai · 团队知识库</title>
  <style>
    :root {
      --bg: #0b0d12;
      --bg-elevated: #141821;
      --border: #242a38;
      --text: #e4e7ed;
      --text-dim: #9ba3b4;
      --text-muted: #6b7384;
      --accent: #8b5cf6;
      --accent-2: #60a5fa;
      --accent-soft: rgba(139, 92, 246, 0.15);
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      padding: 0;
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-size: 16px;
      line-height: 1.7;
      -webkit-font-smoothing: antialiased;
      min-height: 100vh;
    }
    .container {
      max-width: 960px;
      margin: 0 auto;
      padding: 64px 24px 120px;
    }
    header.hero {
      padding: 32px 0 56px;
      border-bottom: 1px solid var(--border);
      margin-bottom: 56px;
    }
    .hero h1 {
      margin: 0 0 12px;
      font-size: 44px;
      font-weight: 700;
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero p {
      margin: 0;
      color: var(--text-dim);
      font-size: 16px;
      letter-spacing: 0.02em;
    }
    h2 {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-muted);
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin: 0 0 20px;
    }
    .projects {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 64px;
    }
    .project-card {
      position: relative;
      display: block;
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px 22px 22px;
      transition: border-color 0.2s ease, transform 0.15s ease;
      text-decoration: none;
      color: inherit;
    }
    .project-card:hover {
      border-color: #2f3647;
    }
    .project-card--live:hover {
      border-color: var(--accent);
      transform: translateY(-1px);
    }
    .project-card h3 {
      margin: 0 0 8px;
      font-size: 18px;
      font-weight: 600;
      color: var(--text);
    }
    .project-card p {
      margin: 0;
      font-size: 13.5px;
      color: var(--text-dim);
      line-height: 1.55;
    }
    .badge {
      position: absolute;
      top: 14px;
      right: 14px;
      font-size: 11px;
      font-weight: 500;
      padding: 3px 8px;
      border-radius: 999px;
      background: rgba(155, 163, 180, 0.1);
      color: var(--text-muted);
      letter-spacing: 0.04em;
    }
    .badge--live {
      background: var(--accent-soft);
      color: var(--accent);
    }
    .docs-section {
      margin-bottom: 36px;
    }
    .doc-list {
      list-style: none;
      padding: 0;
      margin: 0;
      border-top: 1px solid var(--border);
    }
    .doc-list li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 4px;
      border-bottom: 1px solid var(--border);
      gap: 16px;
    }
    .doc-list a {
      color: var(--text);
      text-decoration: none;
      font-size: 15px;
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      transition: color 0.15s ease;
    }
    .doc-list a:hover {
      color: var(--accent);
    }
    .date {
      color: var(--text-muted);
      font-size: 12.5px;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
    .empty {
      color: var(--text-muted);
      text-align: center;
      padding: 4rem 0;
    }
    footer {
      margin-top: 80px;
      padding-top: 24px;
      border-top: 1px solid var(--border);
      color: var(--text-muted);
      font-size: 12.5px;
      text-align: center;
    }
    @media (max-width: 720px) {
      .container { padding: 40px 20px 80px; }
      .hero h1 { font-size: 34px; }
      .projects { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="hero">
      <h1>upio.ai</h1>
      <p>团队知识库 · Team Knowledge Base</p>
    </header>

    <section>
      <h2>项目团队</h2>
      <div class="projects">
${projectCards}
      </div>
    </section>

${totalCount > 0 ? folderSections : '    <p class="empty">暂无文档。把 HTML 文件放到 public/ 目录即可。</p>'}

    <footer>${totalCount} documents · upio.ai</footer>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(publicDir, 'index.html'), html);
console.log(`Built index with ${totalCount} documents`);
