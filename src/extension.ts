import * as vscode from 'vscode';
import axios from 'axios';

const SERVER_URL = 'http://localhost:3000';

interface Finding {
  id: string;
  type: string;
  severity: 'High' | 'Medium' | 'Low';
  file: string;
  line: string;
  explanation: string;
  attackStory: string[];
  fix: string;
}

interface AttackResult {
  tool: string;
  target: string;
  payload?: string;
  output: string;
  evidence: string;
  success: boolean;
}

interface SandboxReport {
  sandboxId: string;
  startedAt: string;
  finishedAt: string;
  target: string;
  attacks: AttackResult[];
  summary: string;
}

const CODE_EXTENSIONS = [
  '.js', '.ts', '.py', '.go', '.java', '.php', '.rb', '.cs', '.cpp', '.c', '.rs',
  '.html', '.css', '.jsx', '.tsx', '.vue', '.svelte',
  '.sql', '.sh', '.env'
];

const MAX_CHARS_PER_FILE = 500;
const MAX_FILES = 6;

export async function activate(context: vscode.ExtensionContext) {
  let panel: vscode.WebviewPanel | null = null;

  const statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left, 100
  );
  statusBar.text = '$(shield) SentinelAI';
  statusBar.tooltip = 'Click to open security report';
  statusBar.command = 'sentinelai.openPanel';
  statusBar.show();
  context.subscriptions.push(statusBar);

  function getPanel(): vscode.WebviewPanel {
    if (!panel) {
      panel = vscode.window.createWebviewPanel(
        'sentinelai',
        'SentinelAI — Security Report',
        vscode.ViewColumn.Beside,
        { enableScripts: true }
      );
      panel.webview.html = getWebviewHtml();
      panel.onDidDispose(() => { panel = null; });

      // Handle messages from webview
      panel.webview.onDidReceiveMessage(async (msg) => {
        if (msg.type === 'runSandbox') {
          await runSandboxAttack(panel!, statusBar, msg.findings);
        }
        if (msg.type === 'stopSandbox') {
          try {
            await axios.post(`${SERVER_URL}/sandbox/stop`);
          } catch {}
        }
      });
    } else {
      panel.reveal();
    }
    return panel;
  }

  context.subscriptions.push(
    vscode.commands.registerCommand('sentinelai.openPanel', () => {
      getPanel();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('sentinelai.scan', () => {
      scanWorkspace(getPanel(), statusBar);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('sentinelai.sandbox', async () => {
      const p = getPanel();
      p.webview.postMessage({ type: 'showConsent' });
    })
  );

  if (vscode.workspace.workspaceFolders) {
    const answer = await vscode.window.showInformationMessage(
      '🛡 SentinelAI: Scan this project for security vulnerabilities?',
      'Yes, scan now',
      'Not now'
    );
    if (answer === 'Yes, scan now') {
      scanWorkspace(getPanel(), statusBar);
    }
  }

  context.subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders(async () => {
      if (vscode.workspace.workspaceFolders) {
        const answer = await vscode.window.showInformationMessage(
          '🛡 SentinelAI: New folder detected. Scan for security vulnerabilities?',
          'Yes, scan now',
          'Not now'
        );
        if (answer === 'Yes, scan now') {
          scanWorkspace(getPanel(), statusBar);
        }
      }
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument((doc) => {
      const ext = doc.fileName.slice(doc.fileName.lastIndexOf('.')).toLowerCase();
      if (CODE_EXTENSIONS.includes(ext)) {
        scanWorkspace(getPanel(), statusBar);
      }
    })
  );
}

async function scanWorkspace(
  panel: vscode.WebviewPanel,
  statusBar: vscode.StatusBarItem
) {
  statusBar.text = '$(sync~spin) SentinelAI: Scanning...';
  panel.webview.postMessage({ type: 'scanning' });

  try {
    await axios.get(`${SERVER_URL}/health`);
  } catch {
    statusBar.text = '$(shield) SentinelAI';
    panel.webview.postMessage({
      type: 'error',
      message: 'Backend not running. Open a terminal in the BACKEND folder and run: node server.js'
    });
    return;
  }

  const uris = await vscode.workspace.findFiles(
    '**/*.{js,ts,py,go,php,java,rb,cs,cpp,c,rs,html,css,jsx,tsx,vue,svelte,sql,sh,env}',
    '**/node_modules/**,**/dist/**,**/out/**,**/.git/**,**/build/**,**/vendor/**'
  );

  if (uris.length === 0) {
    statusBar.text = '$(shield) SentinelAI';
    panel.webview.postMessage({ type: 'noFiles' });
    return;
  }

  const allFiles = await Promise.all(
    uris.map(async (uri) => {
      const ext = uri.fsPath.slice(uri.fsPath.lastIndexOf('.')).toLowerCase();
      if (!CODE_EXTENSIONS.includes(ext)) { return null; }
      const bytes = await vscode.workspace.fs.readFile(uri);
      const code = Buffer.from(bytes).toString('utf8').slice(0, MAX_CHARS_PER_FILE);
      return { path: vscode.workspace.asRelativePath(uri), code };
    })
  );

  const files = allFiles
    .filter((f): f is { path: string; code: string } =>
      f !== null && f.code.trim().length > 30
    )
    .slice(0, MAX_FILES);

  if (files.length === 0) {
    statusBar.text = '$(shield) SentinelAI';
    panel.webview.postMessage({ type: 'noFiles' });
    return;
  }

  try {
    const response = await axios.post(`${SERVER_URL}/analyze-project`, { files });
    const { findings, filesScanned } = response.data as {
      findings: Finding[];
      filesScanned: number;
    };

    statusBar.text = findings.length > 0
      ? `$(warning) SentinelAI: ${findings.length} issue${findings.length > 1 ? 's' : ''}`
      : '$(check) SentinelAI: Clean';

    panel.webview.postMessage({
      type: 'results',
      findings,
      filesScanned,
      fileNames: files.map(f => f.path)
    });

  } catch (err: any) {
    statusBar.text = '$(shield) SentinelAI';
    panel.webview.postMessage({
      type: 'error',
      message: `Analysis failed: ${err.message}`
    });
  }
}

async function runSandboxAttack(
  panel: vscode.WebviewPanel,
  statusBar: vscode.StatusBarItem,
  findings: Finding[]
) {
  // Check Docker is available
  try {
    await axios.get(`${SERVER_URL}/sandbox/check`);
  } catch (err: any) {
    panel.webview.postMessage({
      type: 'sandboxError',
      message: err.response?.data?.error || 'Docker not available. Install Docker Desktop and ensure it is running.'
    });
    return;
  }

  statusBar.text = '$(debug-alt) SentinelAI: Attack running...';
  panel.webview.postMessage({ type: 'sandboxStarted' });

  try {
    const response = await axios.post(`${SERVER_URL}/sandbox/run`, { findings }, {
      timeout: 300_000 // 5 min max
    });

    const report = response.data as SandboxReport;
    statusBar.text = `$(warning) SentinelAI: ${findings.length} issues`;
    panel.webview.postMessage({ type: 'sandboxResults', report });

  } catch (err: any) {
    statusBar.text = `$(warning) SentinelAI: ${findings.length} issues`;
    panel.webview.postMessage({
      type: 'sandboxError',
      message: `Attack demo failed: ${err.message}`
    });
  }
}

function getWebviewHtml(): string {
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
  .summary{display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap;align-items:center}
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
  .scanned-files{
    margin-top:14px;padding:10px 13px;
    border:1px solid var(--vscode-panel-border);
    border-radius:6px;font-size:11px;
    color:var(--vscode-descriptionForeground);
  }
  .scanned-files summary{cursor:pointer;font-weight:600;margin-bottom:4px}
  .scanned-files ul{margin-top:6px;padding-left:16px}
  .scanned-files li{font-family:monospace;font-size:11px;margin-bottom:2px}

  /* ── Sandbox / Attack Demo styles ── */
  .sandbox-btn{
    display:inline-flex;align-items:center;gap:6px;
    padding:5px 12px;border-radius:4px;border:none;cursor:pointer;
    font-size:11px;font-weight:600;letter-spacing:.3px;
    background:#f14c4c22;color:#f14c4c;border:1px solid #f14c4c55;
    transition:background .15s;
  }
  .sandbox-btn:hover{background:#f14c4c33}
  .sandbox-btn:disabled{opacity:.4;cursor:not-allowed}

  /* Consent modal */
  .modal-overlay{
    position:fixed;inset:0;
    background:rgba(0,0,0,.6);
    display:flex;align-items:center;justify-content:center;
    z-index:100;
  }
  .modal-overlay.hidden{display:none}
  .modal{
    background:var(--vscode-editor-background);
    border:1px solid var(--vscode-panel-border);
    border-radius:8px;padding:24px;max-width:440px;width:90%;
  }
  .modal h2{font-size:14px;font-weight:700;margin-bottom:10px;color:#f14c4c}
  .modal p{font-size:12px;line-height:1.7;color:var(--vscode-editor-foreground);margin-bottom:10px}
  .modal ul{padding-left:16px;font-size:12px;margin-bottom:14px}
  .modal ul li{margin-bottom:4px}
  .modal-actions{display:flex;gap:10px;justify-content:flex-end}
  .btn-cancel{
    padding:5px 14px;border-radius:4px;border:1px solid var(--vscode-panel-border);
    background:transparent;color:var(--vscode-editor-foreground);
    font-size:12px;cursor:pointer;
  }
  .btn-confirm{
    padding:5px 14px;border-radius:4px;border:none;
    background:#f14c4c;color:#fff;
    font-size:12px;font-weight:600;cursor:pointer;
  }
  .btn-confirm:hover{background:#d93030}

  /* Sandbox running state */
  .sandbox-terminal{
    background:#0d0d0d;border:1px solid #333;
    border-radius:6px;padding:14px;margin-top:14px;
    font-family:'Courier New',monospace;font-size:11px;
    color:#33ff33;max-height:240px;overflow-y:auto;
    line-height:1.8;
  }
  .sandbox-terminal .t-dim{color:#555}
  .sandbox-terminal .t-warn{color:#cca700}
  .sandbox-terminal .t-err{color:#f14c4c}
  .sandbox-terminal .t-ok{color:#23d18b}
  .terminal-cursor{
    display:inline-block;width:8px;height:13px;
    background:#33ff33;animation:blink .8s step-end infinite;
    vertical-align:middle;margin-left:2px;
  }
  @keyframes blink{50%{opacity:0}}

  /* Sandbox results */
  .attack-card{
    border:1px solid var(--vscode-panel-border);
    border-radius:6px;margin-bottom:10px;overflow:hidden;
  }
  .attack-head{
    display:flex;align-items:center;gap:8px;
    padding:9px 13px;
    background:var(--vscode-editor-inactiveSelectionBackground);
    cursor:pointer;user-select:none;
  }
  .attack-head:hover{background:var(--vscode-list-hoverBackground)}
  .attack-tool{
    font-size:10px;font-weight:700;padding:2px 7px;
    border-radius:3px;text-transform:uppercase;letter-spacing:.5px;
    font-family:monospace;
  }
  .attack-tool.sqlmap {background:#f14c4c22;color:#f14c4c;border:1px solid #f14c4c44}
  .attack-tool.zap    {background:#cca70022;color:#cca700;border:1px solid #cca70044}
  .attack-tool.nuclei {background:#c586c022;color:#c586c0;border:1px solid #c586c044}
  .attack-tool.custom {background:#3794ff22;color:#3794ff;border:1px solid #3794ff44}
  .attack-status{margin-left:auto;font-size:11px;font-weight:600}
  .attack-status.hit{color:#f14c4c}
  .attack-status.miss{color:#23d18b}
  .attack-body{padding:13px;display:none;border-top:1px solid var(--vscode-panel-border)}
  .attack-body.open{display:block}
  .evidence-box{
    background:#0d0d0d;border:1px solid #333;
    border-radius:4px;padding:10px;margin-top:8px;
    font-family:'Courier New',monospace;font-size:11px;
    color:#ddd;white-space:pre-wrap;word-break:break-all;
    max-height:180px;overflow-y:auto;
  }
  .sandbox-summary{
    padding:14px;border:1px solid #f14c4c44;
    border-radius:6px;background:#f14c4c0a;
    margin-bottom:14px;font-size:12px;line-height:1.7;
  }
  .sandbox-meta{
    font-size:11px;color:var(--vscode-descriptionForeground);
    margin-bottom:10px;display:flex;gap:14px;flex-wrap:wrap;
  }
  .sandbox-meta span{display:flex;align-items:center;gap:4px}
</style>
</head>
<body>
<h1>&#x1F6E1; SentinelAI</h1>
<p class="sub">Whole-project semantic analysis — powered by phi3:mini</p>
<div id="root"><div class="state">Waiting for workspace...</div></div>

<!-- Consent modal -->
<div class="modal-overlay hidden" id="consentModal">
  <div class="modal">
    <h2>⚠ Run Docker Attack Sandbox?</h2>
    <p>This will spin up a <strong>sandboxed Docker container</strong> on your machine and run real penetration testing tools against your project's vulnerabilities:</p>
    <ul>
      <li><strong>SQLMap</strong> — automated SQL injection exploitation</li>
      <li><strong>OWASP ZAP</strong> — active web vulnerability scanner</li>
      <li><strong>Nuclei</strong> — template-based vulnerability scanner</li>
    </ul>
    <p>The container is <strong>fully isolated</strong> and destroyed after the test. No data leaves your machine. This is for <strong>educational purposes only</strong> on code you own.</p>
    <div class="modal-actions">
      <button class="btn-cancel" onclick="hideConsent()">Cancel</button>
      <button class="btn-confirm" onclick="confirmSandbox()">I understand — Run Attack Demo</button>
    </div>
  </div>
</div>

<script>
const root = document.getElementById('root');
const vscode = acquireVsCodeApi();
let currentFindings = [];

window.addEventListener('message', e => {
  const msg = e.data;

  if (msg.type === 'scanning') {
    root.innerHTML = '<div class="state"><span class="spin">&#x27F3;</span>&nbsp; Analysing with phi3:mini — this may take 20–40 seconds...</div>';
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

  if (msg.type === 'showConsent') {
    document.getElementById('consentModal').classList.remove('hidden');
    return;
  }

  if (msg.type === 'sandboxStarted') {
    renderSandboxRunning();
    return;
  }

  if (msg.type === 'sandboxResults') {
    renderSandboxResults(msg.report);
    return;
  }

  if (msg.type === 'sandboxError') {
    appendSandboxError(msg.message);
    return;
  }

  if (msg.type === 'results') {
    const { findings, filesScanned, fileNames } = msg;
    currentFindings = findings || [];
    renderResults(findings, filesScanned, fileNames);
    return;
  }
});

function renderResults(findings, filesScanned, fileNames) {
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
  html += '<button class="sandbox-btn" style="margin-left:auto" onclick="showConsent()">&#x1F4A3; Run Attack Demo</button>';
  html += '</div>';

  findings.forEach((f, i) => {
    html += '<div class="card">';
    html += '<div class="card-head" onclick="toggle(\'b' + i + '\')">';
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

  if (fileNames && fileNames.length) {
    html += '<details class="scanned-files"><summary>Files scanned (' + fileNames.length + ')</summary><ul>';
    fileNames.forEach(name => { html += '<li>' + esc(name) + '</li>'; });
    html += '</ul></details>';
  }

  root.innerHTML = html;
}

function renderSandboxRunning() {
  const sandboxArea = document.getElementById('sandboxArea');
  if (sandboxArea) {
    sandboxArea.innerHTML = terminalHtml([
      '<span class="t-dim">[sandbox]</span> Pulling attack container image...',
      '<span class="t-dim">[sandbox]</span> Starting isolated Docker network...',
      '<span class="t-dim">[sandbox]</span> Launching attack tools...',
      '<span class="t-warn">[!]</span> Running SQLMap against detected endpoints...',
    ]);
    return;
  }
  // If no sandbox area exists yet, append it after the main content
  const div = document.createElement('div');
  div.id = 'sandboxArea';
  div.style.marginTop = '20px';
  div.innerHTML =
    '<div class="label" style="margin-bottom:8px">&#x1F4A3; Attack Sandbox</div>' +
    terminalHtml([
      '<span class="t-dim">[sandbox]</span> Checking Docker availability...',
      '<span class="t-dim">[sandbox]</span> Pulling attack container image...',
      '<span class="t-dim">[sandbox]</span> Starting isolated Docker network...',
      '<span class="t-warn">[!]</span> Running SQLMap, OWASP ZAP, Nuclei...',
    ]);
  root.appendChild(div);
}

function terminalHtml(lines) {
  return '<div class="sandbox-terminal">' +
    lines.map(l => l + '<br>').join('') +
    '<span class="terminal-cursor"></span>' +
    '</div>';
}

function appendSandboxError(msg) {
  const area = document.getElementById('sandboxArea');
  if (area) {
    area.innerHTML += '<div style="color:#f14c4c;font-size:12px;margin-top:8px">&#x26A0; ' + esc(msg) + '</div>';
  }
}

function renderSandboxResults(report) {
  let html = '';
  html += '<div style="margin-top:20px">';
  html += '<div class="label" style="margin-bottom:10px">&#x1F4A3; Attack Sandbox Results</div>';

  // Meta
  const elapsed = Math.round((new Date(report.finishedAt) - new Date(report.startedAt)) / 1000);
  html += '<div class="sandbox-meta">';
  html += '<span>&#x23F1; ' + elapsed + 's</span>';
  html += '<span>&#x1F3AF; ' + report.attacks.length + ' attack(s) run</span>';
  const hits = report.attacks.filter(a => a.success).length;
  html += '<span style="color:#f14c4c">&#x2757; ' + hits + ' exploitable</span>';
  html += '</div>';

  // Summary
  if (report.summary) {
    html += '<div class="sandbox-summary">' + esc(report.summary) + '</div>';
  }

  // Attack cards
  report.attacks.forEach((attack, i) => {
    const toolClass = attack.tool.toLowerCase().replace(/[^a-z]/g, '');
    html += '<div class="attack-card">';
    html += '<div class="attack-head" onclick="toggle(\'a' + i + '\')">';
    html += '<span class="attack-tool ' + toolClass + '">' + esc(attack.tool) + '</span>';
    html += '<span style="flex:1;font-weight:600;font-size:13px;margin-left:4px">' + esc(attack.target) + '</span>';
    html += '<span class="attack-status ' + (attack.success ? 'hit' : 'miss') + '">' +
      (attack.success ? '&#x2757; EXPLOITED' : '&#x2713; Not vulnerable') + '</span>';
    html += '</div>';
    html += '<div class="attack-body" id="a' + i + '">';
    if (attack.payload) {
      html += '<div class="label">Payload used</div>';
      html += '<div class="evidence-box">' + esc(attack.payload) + '</div>';
    }
    html += '<div class="label">Evidence</div>';
    html += '<div class="evidence-box">' + esc(attack.evidence) + '</div>';
    if (attack.output) {
      html += '<div class="label">Full output</div>';
      html += '<div class="evidence-box">' + esc(attack.output) + '</div>';
    }
    html += '</div></div>';
  });

  html += '<button class="sandbox-btn" style="margin-top:10px" onclick="showConsent()">&#x1F504; Re-run Attack Demo</button>';
  html += '</div>';

  const sandboxArea = document.getElementById('sandboxArea');
  if (sandboxArea) {
    sandboxArea.innerHTML = html;
  } else {
    const div = document.createElement('div');
    div.id = 'sandboxArea';
    div.innerHTML = html;
    root.appendChild(div);
  }
}

function showConsent() {
  document.getElementById('consentModal').classList.remove('hidden');
}
function hideConsent() {
  document.getElementById('consentModal').classList.add('hidden');
}
function confirmSandbox() {
  hideConsent();
  vscode.postMessage({ type: 'runSandbox', findings: currentFindings });
}

function toggle(id) {
  document.getElementById(id).classList.toggle('open');
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

export function deactivate() {}