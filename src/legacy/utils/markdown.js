// ============================================================
//  src/utils/markdown.js — Markdown Compiler Utilities
// ============================================================

export function compileMarkdown(text) {
  if (!text) return '';
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
    
  // Code Blocks
  html = html.replace(/```(?:[a-zA-Z]+)?\n([\s\S]*?)\n```/g, '<pre style="background:rgba(0,0,0,0.4); padding:10px; border-radius:6px; font-family:var(--font-mono); font-size:0.75rem; border:1px solid var(--border); overflow-x:auto; margin-bottom:10px;"><code>$1</code></pre>');
  
  // Inline Code
  html = html.replace(/`([^`]+)`/g, '<code style="font-family:var(--font-mono); background:rgba(255,255,255,0.06); padding:2px 4px; border-radius:4px; font-size:0.75rem;">$1</code>');
  
  // Headings
  html = html.replace(/^### (.*$)/gim, '<h4>$1</h4>');
  html = html.replace(/^## (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^# (.*$)/gim, '<h2>$1</h2>');
  
  // Bold / Italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Bullet Lists
  html = html.replace(/^\s*-\s+(.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
  html = html.replace(/<\/ul>\s*<ul>/g, '');
  
  // Paragraph Spacing
  html = html.split('\n\n').map(p => {
    if (p.trim().startsWith('<h') || p.trim().startsWith('<pre') || p.trim().startsWith('<ul')) {
      return p;
    }
    return `<p style="margin-bottom:10px; line-height:1.5;">${p.replace(/\n/g, '<br>')}</p>`;
  }).join('');
  
  return html;
}

export function insertMD(openTag, closeTag = '') {
  const tx = document.getElementById('log-notes-input');
  if (!tx) return;
  const start = tx.selectionStart;
  const end = tx.selectionEnd;
  const text = tx.value;
  const selected = text.substring(start, end);
  
  let replacement = '';
  if (closeTag === '') {
    replacement = openTag + selected;
  } else {
    replacement = openTag + selected + (closeTag || openTag);
  }
  
  tx.value = text.substring(0, start) + replacement + text.substring(end);
  tx.focus();
  tx.selectionStart = start + openTag.length;
  tx.selectionEnd = start + openTag.length + selected.length;
}
