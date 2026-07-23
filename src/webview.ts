export function getWebviewHtml(): string {
      return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>SentinelAI</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    background:var(--vscode-editor-background);
    color:var(--vscode-editor-foreground);
    padding:20px;font-size:13px;line-height:1.6;
  }
  h1{font-size:15px;font-weight:600;margin-bottom:2px}
  .sub{color:var(--vscode-descriptionForeground);font-size:11px;margin-bottom:18px}
  .state{
    padding:24px;text-align:center;
    border:1px solid var(--vscode-panel-border);
    border-radius:6px;
    color:var(--vscode-descriptionForeground);
  }
  .spin{display:inline-block;animation:spin 1s linear infinite}
  @keyframes spin{to{transform:rotate(360deg)}}
  .summary{display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap}
  .pill{
    padding:3px 10px;border-radius:20px;
    font-size:11px;font-weight:600;letter-spacing:.3px;
  }
  .pill.High  {background:#f14c4c22;color:#f14c4c;border:1px solid #f14c4c55}
  .pill.Medium{background:#cca70022;color:#cca700;border:1px solid #cca70055}
  .pill.Low   {background:#3794ff22;color:#3794ff;border:1px solid #3794ff55}
  .card{
    border:1px solid var(--vscode-panel-border);
    border-radius:6px;margin-bottom:10px;overflow:hidden;
  }
  .card-head{
    display:flex;align-items:center;gap:8px;
    padding:9px 13px;cursor:pointer;user-select:none;
    background:var(--vscode-editor-inactiveSelectionBackground);
  }
  .card-head:hover{background:var(--vscode-list-hoverBackground)}
  .badge{
    font-size:10px;font-weight:700;padding:2px 6px;
    border-radius:3px;text-transform:uppercase;letter-spacing:.4px;
  }
  .badge.High  {background:#f14c4c22;color:#f14c4c;border:1px solid #f14c4c44}
  .badge.Medium{background:#cca70022;color:#cca700;border:1px solid #cca70044}
  .badge.Low   {background:#3794ff22;color:#3794ff;border:1px solid #3794ff44}
  .card-title{font-weight:600;flex:1;font-size:13px}
  .card-file{font-size:11px;color:var(--vscode-descriptionForeground);font-family:monospace}
  .card-body{padding:13px;display:none;border-top:1px solid var(--vscode-panel-border)}
  .card-body.open{display:block}
  .label{
    font-size:10px;text-transform:uppercase;letter-spacing:.7px;
    font-weight:600;color:var(--vscode-descriptionForeground);
    margin:12px 0 5px;
  }
  .label:first-child{margin-top:0}
  .step{display:flex;gap:8px;margin-bottom:4px;align-items:flex-start}
  .step-n{
    width:17px;height:17px;border-radius:50%;flex-shrink:0;
    background:#f14c4c22;color:#f14c4c;
    font-size:10px;font-weight:700;
    display:flex;align-items:center;justify-content:center;
    margin-top:2px;
  }
  .fix{
    background:var(--vscode-textBlockQuote-background);
    border-left:3px solid #3794ff;
    border-radius:0 4px 4px 0;
    padding:8px 11px;font-size:12px;
  }
  .clean{
    padding:18px;border:1px solid #23d18b44;
    border-radius:6px;background:#23d18b11;
    color:#23d18b;text-align:center;font-weight:500;
  }
  .meta{color:var(--vscode-descriptionForeground);font-size:11px;margin-bottom:12px}
</style>
</head>
<body>
<h1>&#x1F6E1; SentinelAI</h1>
<p class="sub">Whole-project semantic analysis — powered by codellama13b</p>
<div id="root"><div class="state">Waiting for workspace...</div></div>

<script>
const root = document.getElementById('root');

window.addEventListener('message', e => {
  const msg = e.data;

  if (msg.type === 'scanning') {
    root.innerHTML = '<div class="state"><span class="spin">&#x27F3;</span>&nbsp; Analysing with codellama13b — this may take 20–40 seconds...</div>';
    return;
  }

  if (msg.type === 'error') {
    root.innerHTML = '<div class="state" style="color:#f14c4c">' + esc(msg.message) + '</div>';
    return;
  }

  if (msg.type === 'noFiles') {
    root.innerHTML = '<div class="state">No supported source files found in this workspace.</div>';
    return;
  }

  if (msg.type === 'results') {
    const { findings, filesScanned } = msg;

    if (!findings || findings.length === 0) {
      root.innerHTML =
        '<p class="meta">Scanned ' + filesScanned + ' file(s)</p>' +
        '<div class="clean">&#x2713;&nbsp; No vulnerabilities detected</div>';
      return;
    }

    const high   = findings.filter(f => f.severity === 'High').length;
    const medium = findings.filter(f => f.severity === 'Medium').length;
    const low    = findings.filter(f => f.severity === 'Low').length;

    let html = '<p class="meta">Scanned ' + filesScanned + ' file(s) &mdash; ' + findings.length + ' issue(s) found</p>';
    html += '<div class="summary">';
    if (high)   html += '<span class="pill High">'   + high   + ' High</span>';
    if (medium) html += '<span class="pill Medium">' + medium + ' Medium</span>';
    if (low)    html += '<span class="pill Low">'    + low    + ' Low</span>';
    html += '</div>';

    findings.forEach((f, i) => {
      html += '<div class="card">';
      html += '<div class="card-head" onclick="toggle(' + i + ')">';
      html += '<span class="badge ' + f.severity + '">' + f.severity + '</span>';
      html += '<span class="card-title">' + esc(f.type) + '</span>';
      html += '<span class="card-file">' + esc(f.file) + (f.line ? ' : ' + esc(f.line) : '') + '</span>';
      html += '</div>';
      html += '<div class="card-body" id="b' + i + '">';

      html += '<div class="label">Why it is dangerous</div>';
      html += '<p>' + esc(f.explanation) + '</p>';

      if (f.attackStory && f.attackStory.length) {
        html += '<div class="label">How an attacker exploits this</div>';
        f.attackStory.forEach((step, si) => {
          html += '<div class="step"><span class="step-n">' + (si+1) + '</span><span>' + esc(step) + '</span></div>';
        });
      }

      html += '<div class="label">Fix</div>';
      html += '<div class="fix">' + esc(f.fix) + '</div>';
      html += '</div></div>';
    });

    root.innerHTML = html;
  }
});

function toggle(i) {
  document.getElementById('b' + i).classList.toggle('open');
}

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}
</script>
</body>
</html>`;
}