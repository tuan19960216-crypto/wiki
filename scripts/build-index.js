const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

function getHtmlFiles(dir, base = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const rel = path.join(base, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getHtmlFiles(path.join(dir, entry.name), rel));
    } else if (entry.name.endsWith('.html') && entry.name !== 'index.html') {
      const stat = fs.statSync(path.join(dir, entry.name));
      // Extract title from HTML
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

// Group by folder
const groups = {};
for (const f of files) {
  if (!groups[f.folder]) groups[f.folder] = [];
  groups[f.folder].push(f);
}

const folderSections = Object.entries(groups)
  .map(([folder, items]) => {
    const folderName = folder === 'root' ? 'General' : folder.replace(/\//g, ' / ');
    const links = items
      .map(f => {
        const date = f.modified.toISOString().split('T')[0];
        const href = '/' + f.path.replace(/\.html$/, '');
        return `        <li><a href="${href}">${f.title}</a> <span class="date">${date}</span></li>`;
      })
      .join('\n');
    return `      <section>
        <h2>${folderName}</h2>
        <ul>
${links}
        </ul>
      </section>`;
  })
  .join('\n');

const totalCount = files.length;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>upio.ai wiki</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 720px; margin: 0 auto; padding: 2rem 1rem; color: #1a1a1a; background: #fafafa; }
    h1 { font-size: 1.5rem; margin-bottom: 0.25rem; }
    .subtitle { color: #666; font-size: 0.875rem; margin-bottom: 2rem; }
    h2 { font-size: 1.1rem; color: #333; margin-bottom: 0.75rem; padding-bottom: 0.25rem; border-bottom: 1px solid #e5e5e5; }
    section { margin-bottom: 2rem; }
    ul { list-style: none; }
    li { padding: 0.4rem 0; display: flex; justify-content: space-between; align-items: center; }
    a { color: #0969da; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .date { color: #999; font-size: 0.8rem; white-space: nowrap; margin-left: 1rem; }
    .empty { color: #999; text-align: center; padding: 4rem 0; }
  </style>
</head>
<body>
  <h1>upio.ai wiki</h1>
  <p class="subtitle">${totalCount} documents</p>
${totalCount > 0 ? folderSections : '  <p class="empty">No documents yet. Add HTML files to the public/ directory.</p>'}
</body>
</html>`;

fs.writeFileSync(path.join(publicDir, 'index.html'), html);
console.log(`Built index with ${totalCount} documents`);
