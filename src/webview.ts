export function getWebviewHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>SentinelAI</title>

<style>
*{
  box-sizing:border-box;
  margin:0;
  padding:0;
}

body{
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
  background:var(--vscode-editor-background);
  color:var(--vscode-editor-foreground);
  padding:16px;
  font-size:13px;
  line-height:1.5;
}

.header-bar{
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-bottom:16px;
  padding-bottom:12px;
  border-bottom:1px solid var(--vscode-panel-border);
}

.header-title{
  display:flex;
  align-items:center;
  gap:8px;
}

.header-title h1{
  font-size:16px;
  font-weight:700;
}

.sub{
  color:var(--vscode-descriptionForeground);
  font-size:11px;
  margin-top:2px;
}

.btn{
  padding:6px 14px;
  border-radius:4px;
  border:none;
  font-size:11px;
  font-weight:600;
  cursor:pointer;
  display:inline-flex;
  align-items:center;
  gap:6px;
  transition:all .15s ease;
}

.btn-primary{
  background:var(--vscode-button-background);
  color:var(--vscode-button-foreground);
}

.btn-primary:hover{
  background:var(--vscode-button-hoverBackground);
}

.btn-secondary{
  background:var(
    --vscode-button-secondaryBackground,
    #333
  );
  color:var(
    --vscode-button-secondaryForeground,
    #ccc
  );
}

.btn-secondary:hover{
  opacity:.85;
}

.btn-danger{
  background:#f14c4c;
  color:#fff;
}

.btn-danger:hover{
  background:#d33838;
}

.btn-success{
  background:#23d18b;
  color:#111;
  font-weight:700;
}

.btn-success:hover{
  background:#1eb879;
}

.btn-outline{
  background:transparent;
  border:1px solid var(--vscode-panel-border);
  color:var(--vscode-editor-foreground);
}

.btn-outline:hover{
  background:var(--vscode-list-hoverBackground);
}

.state{
  padding:32px 20px;
  text-align:center;
  border:1px dashed var(--vscode-panel-border);
  border-radius:8px;
  color:var(--vscode-descriptionForeground);
  background:var(
    --vscode-editor-inactiveSelectionBackground
  );
}

.spin{
  display:inline-block;
  animation:spin 1s linear infinite;
}

@keyframes spin{
  to{
    transform:rotate(360deg);
  }
}

/* Runtime */

.runtime-card{
  border:1px solid var(--vscode-panel-border);
  border-radius:8px;
  margin-bottom:16px;
  overflow:hidden;
  background:var(--vscode-editor-background);
}

.runtime-header{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:10px 14px;
  background:var(
    --vscode-editor-inactiveSelectionBackground
  );
  border-bottom:1px solid var(--vscode-panel-border);
}

.runtime-title{
  display:flex;
  align-items:center;
  gap:8px;
  font-size:11px;
  font-weight:700;
  text-transform:uppercase;
  letter-spacing:.6px;
}

.runtime-body{
  padding:14px;
}

.runtime-main{
  display:flex;
  align-items:center;
  gap:10px;
  margin-bottom:14px;
}

.runtime-icon{
  width:36px;
  height:36px;
  border-radius:7px;
  display:flex;
  align-items:center;
  justify-content:center;
  background:rgba(55,148,255,.12);
  border:1px solid rgba(55,148,255,.3);
  font-size:17px;
}

.runtime-name{
  font-size:14px;
  font-weight:700;
}

.runtime-url{
  font-family:Consolas,Monaco,monospace;
  font-size:11px;
  color:var(--vscode-descriptionForeground);
  margin-top:2px;
  word-break:break-all;
}

.runtime-status{
  margin-left:auto;
  font-size:9px;
  font-weight:700;
  padding:3px 8px;
  border-radius:10px;
  text-transform:uppercase;
}

.runtime-status.online{
  color:#23d18b;
  background:rgba(35,209,139,.12);
  border:1px solid rgba(35,209,139,.35);
}

.runtime-status.offline{
  color:#f14c4c;
  background:rgba(241,76,76,.12);
  border:1px solid rgba(241,76,76,.35);
}

.runtime-grid{
  display:grid;
  grid-template-columns:1fr 1fr 1fr;
  gap:8px;
  margin-bottom:12px;
}

.runtime-field{
  padding:8px 10px;
  border:1px solid var(--vscode-panel-border);
  border-radius:5px;
  background:rgba(0,0,0,.08);
}

.runtime-label{
  font-size:9px;
  text-transform:uppercase;
  letter-spacing:.6px;
  color:var(--vscode-descriptionForeground);
  font-weight:700;
  margin-bottom:2px;
}

.runtime-value{
  font-family:monospace;
  font-size:11px;
  font-weight:600;
}

.runtime-actions{
  display:flex;
  gap:8px;
  flex-wrap:wrap;
}

/* Summary */

.summary{
  display:flex;
  gap:8px;
  margin-bottom:16px;
  flex-wrap:wrap;
  align-items:center;
}

.pill{
  padding:3px 10px;
  border-radius:20px;
  font-size:11px;
  font-weight:600;
  letter-spacing:.3px;
}

.pill.High{
  background:rgba(241,76,76,.15);
  color:#f14c4c;
  border:1px solid rgba(241,76,76,.4);
}

.pill.Medium{
  background:rgba(204,167,0,.15);
  color:#cca700;
  border:1px solid rgba(204,167,0,.4);
}

.pill.Low{
  background:rgba(55,148,255,.15);
  color:#3794ff;
  border:1px solid rgba(55,148,255,.4);
}

/* Finding cards */

.card{
  border:1px solid var(--vscode-panel-border);
  border-radius:6px;
  margin-bottom:12px;
  overflow:hidden;
  background:var(--vscode-editor-background);
}

.card-head{
  display:flex;
  align-items:center;
  gap:10px;
  padding:10px 14px;
  cursor:pointer;
  user-select:none;
  background:var(
    --vscode-editor-inactiveSelectionBackground
  );
}

.card-head:hover{
  background:var(--vscode-list-hoverBackground);
}

.badge{
  font-size:10px;
  font-weight:700;
  padding:2px 7px;
  border-radius:3px;
  text-transform:uppercase;
  letter-spacing:.4px;
}

.badge.High{
  background:rgba(241,76,76,.2);
  color:#f14c4c;
  border:1px solid rgba(241,76,76,.4);
}

.badge.Medium{
  background:rgba(204,167,0,.2);
  color:#cca700;
  border:1px solid rgba(204,167,0,.4);
}

.badge.Low{
  background:rgba(55,148,255,.2);
  color:#3794ff;
  border:1px solid rgba(55,148,255,.4);
}

.card-title{
  font-weight:600;
  flex:1;
  font-size:13px;
  display:flex;
  align-items:center;
  gap:8px;
}

.card-file{
  font-size:11px;
  color:var(--vscode-descriptionForeground);
  font-family:monospace;
}

.card-body{
  padding:14px;
  display:none;
  border-top:1px solid var(--vscode-panel-border);
}

.card-body.open{
  display:block;
}

.label{
  font-size:10px;
  text-transform:uppercase;
  letter-spacing:.7px;
  font-weight:700;
  color:var(--vscode-descriptionForeground);
  margin:14px 0 6px;
}

.label:first-child{
  margin-top:0;
}

.code-block{
  font-family:Consolas,Monaco,'Courier New',monospace;
  font-size:11px;
  background:rgba(0,0,0,.25);
  padding:10px;
  border-radius:4px;
  border:1px solid var(--vscode-panel-border);
  white-space:pre-wrap;
  word-break:break-all;
  margin-top:4px;
  max-height:220px;
  overflow-y:auto;
  line-height:1.4;
}

.step{
  display:flex;
  gap:10px;
  margin-bottom:6px;
  align-items:flex-start;
}

.step-n{
  width:18px;
  height:18px;
  border-radius:50%;
  flex-shrink:0;
  background:rgba(241,76,76,.2);
  color:#f14c4c;
  font-size:10px;
  font-weight:700;
  display:flex;
  align-items:center;
  justify-content:center;
  margin-top:2px;
}

.fix-box{
  background:var(--vscode-textBlockQuote-background);
  border-left:3px solid #3794ff;
  border-radius:0 4px 4px 0;
  padding:10px 12px;
  font-size:12px;
}

.clean{
  padding:24px;
  border:1px solid rgba(35,209,139,.4);
  border-radius:8px;
  background:rgba(35,209,139,.1);
  color:#23d18b;
  text-align:center;
  font-weight:500;
}

.meta{
  color:var(--vscode-descriptionForeground);
  font-size:11px;
  margin-bottom:12px;
}

/* Diff */

.diff-section{
  margin-top:14px;
  padding:14px;
  background:rgba(0,0,0,.15);
  border-radius:6px;
  border:1px solid var(--vscode-panel-border);
}

.diff-header{
  font-size:11px;
  font-weight:700;
  text-transform:uppercase;
  letter-spacing:.6px;
  color:#3794ff;
  margin-bottom:10px;
}

.diff-block{
  font-family:Consolas,Monaco,'Courier New',monospace;
  font-size:11px;
  border-radius:4px;
  overflow:hidden;
  border:1px solid var(--vscode-panel-border);
  max-height:260px;
  overflow-y:auto;
}

.diff-line{
  padding:3px 10px;
  white-space:pre-wrap;
  word-break:break-all;
  line-height:1.4;
  display:flex;
  gap:10px;
}

.diff-line-num{
  color:var(--vscode-descriptionForeground);
  user-select:none;
  min-width:16px;
  text-align:right;
  font-weight:700;
}

.diff-del{
  background:rgba(241,76,76,.12);
  color:#f14c4c;
  border-left:3px solid #f14c4c;
}

.diff-add{
  background:rgba(35,209,139,.12);
  color:#23d18b;
  border-left:3px solid #23d18b;
}

.diff-actions{
  display:flex;
  gap:10px;
  margin-top:12px;
  flex-wrap:wrap;
  align-items:center;
}

.confirm-box{
  margin-top:12px;
  padding:12px 14px;
  background:rgba(204,167,0,.08);
  border:1px solid rgba(204,167,0,.4);
  border-radius:6px;
  display:none;
}

.confirm-box.open{
  display:block;
}

.confirm-title{
  font-weight:700;
  font-size:12px;
  color:#cca700;
  margin-bottom:6px;
}

.applied-badge{
  display:inline-flex;
  align-items:center;
  gap:6px;
  background:rgba(35,209,139,.18);
  color:#23d18b;
  border:1px solid rgba(35,209,139,.4);
  padding:5px 12px;
  border-radius:6px;
  font-size:11px;
  font-weight:700;
}

/* Scan */

.scan-progress{
  text-align:left;
  padding:20px;
  border:1px solid #3794ff;
  background:rgba(55,148,255,.06);
  border-radius:8px;
}

.scan-progress-header{
  display:flex;
  align-items:center;
  gap:12px;
  margin-bottom:16px;
}

.scan-step{
  display:flex;
  align-items:center;
  gap:12px;
  font-size:12px;
  padding:10px 14px;
  border-radius:6px;
  margin-bottom:6px;
  border:1px solid transparent;
}

.scan-step.active{
  background:rgba(55,148,255,.12);
  border-color:#3794ff;
}

.scan-step.done{
  background:rgba(35,209,139,.08);
}

.scan-step.queued{
  opacity:.5;
}

.scan-step-label{
  font-weight:700;
  flex:1;
}

.scan-step-status{
  font-size:10px;
  font-weight:700;
}

/* Attack */

.attack-section{
  margin-top:12px;
  padding:12px;
  background:var(--vscode-textBlockQuote-background);
  border-radius:6px;
  border-left:3px solid #f14c4c;
}

.attack-section-title{
  font-size:11px;
  font-weight:700;
  text-transform:uppercase;
  letter-spacing:.7px;
  margin-bottom:8px;
  color:#f14c4c;
  display:flex;
  align-items:center;
  gap:6px;
}

.payload-item{
  margin-bottom:8px;
}

.payload-box{
  font-family:Consolas,Monaco,monospace;
  font-size:11px;
  background:rgba(0,0,0,.3);
  padding:6px 10px;
  border-radius:4px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:10px;
  border:1px solid rgba(255,255,255,.05);
}

.payload-text{
  flex:1;
  word-break:break-all;
}

.copy-btn{
  background:var(
    --vscode-button-secondaryBackground,
    #333
  );
  color:var(
    --vscode-button-secondaryForeground,
    #ccc
  );
  border:none;
  padding:3px 8px;
  border-radius:3px;
  font-size:10px;
  cursor:pointer;
  font-weight:600;
  flex-shrink:0;
}

.copy-btn:hover{
  background:var(--vscode-button-hoverBackground);
}

.attack-type-badge{
  display:inline-block;
  padding:2px 6px;
  border-radius:3px;
  font-size:9px;
  font-weight:700;
  text-transform:uppercase;
  background:rgba(241,76,76,.2);
  color:#f14c4c;
  margin-left:6px;
}

/* Consent */

.consent{
  padding:18px;
  border:1px solid rgba(204,167,0,.4);
  border-radius:8px;
  background:rgba(204,167,0,.08);
  margin-bottom:16px;
}

.consent-title{
  font-weight:700;
  font-size:13px;
  margin-bottom:8px;
  color:#cca700;
  display:flex;
  align-items:center;
  gap:6px;
}

.mode-selection{
  margin:12px 0;
  padding:12px;
  background:var(--vscode-editor-background);
  border-radius:6px;
  border:1px solid var(--vscode-panel-border);
}

.mode-options{
  display:flex;
  gap:10px;
  flex-wrap:wrap;
}

.mode-option{
  flex:1;
  min-width:160px;
}

.mode-option input{
  display:none;
}

.mode-option label{
  display:block;
  padding:10px;
  background:var(
    --vscode-button-secondaryBackground
  );
  color:var(
    --vscode-button-secondaryForeground
  );
  border:2px solid transparent;
  border-radius:6px;
  cursor:pointer;
  font-size:11px;
  text-align:center;
}

.mode-option input:checked + label{
  border-color:#3794ff;
  background:rgba(55,148,255,.12);
  color:#3794ff;
  font-weight:700;
}

/* Runtime browser */

.mock-browser{
  border:1px solid var(--vscode-panel-border);
  border-radius:8px;
  overflow:hidden;
  margin-top:14px;
  background:#1e1e1e;
  box-shadow:0 4px 16px rgba(0,0,0,.3);
}

.mock-browser-bar{
  background:#2d2d2d;
  padding:8px 12px;
  display:flex;
  align-items:center;
  gap:12px;
  border-bottom:1px solid #3c3c3c;
}

.mock-dots{
  display:flex;
  gap:6px;
}

.mock-dot{
  width:10px;
  height:10px;
  border-radius:50%;
}

.mock-dot.r{background:#ff5f56}
.mock-dot.y{background:#ffbd2e}
.mock-dot.g{background:#27c93f}

.mock-url{
  flex:1;
  background:#1e1e1e;
  color:#ccc;
  font-family:monospace;
  font-size:11px;
  padding:4px 10px;
  border-radius:4px;
  border:1px solid #3c3c3c;
  display:flex;
  align-items:center;
  gap:6px;
  min-width:0;
  overflow:hidden;
  white-space:nowrap;
  text-overflow:ellipsis;
}

.status-pill{
  font-size:9px;
  font-weight:700;
  padding:2px 8px;
  border-radius:10px;
  text-transform:uppercase;
}

.status-pill.green{
  background:rgba(39,201,63,.2);
  color:#27c93f;
  border:1px solid rgba(39,201,63,.4);
}

.status-pill.red{
  background:rgba(255,95,86,.2);
  color:#ff5f56;
  border:1px solid rgba(255,95,86,.4);
}

.mock-viewport{
  padding:16px;
  background:#181818;
  min-height:130px;
  color:#eee;
}

.mock-app-header{
  border-bottom:1px solid #333;
  padding-bottom:10px;
  margin-bottom:12px;
}

.mock-app-header h2{
  font-size:14px;
  color:#3794ff;
  display:flex;
  align-items:center;
  gap:6px;
}

.runtime-target-info{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:8px;
}

.runtime-target-box{
  padding:10px;
  border:1px solid #333;
  border-radius:5px;
  background:#202020;
}

.runtime-target-box .small-label{
  font-size:9px;
  text-transform:uppercase;
  color:#888;
  letter-spacing:.5px;
}

.runtime-target-box .small-value{
  font-family:monospace;
  font-size:11px;
  margin-top:2px;
}

/* Timeline */

.timeline{
  margin-top:14px;
}

.log-entry{
  padding:10px 12px;
  margin-bottom:6px;
  border-radius:6px;
  background:var(
    --vscode-editor-inactiveSelectionBackground
  );
  border-left:3px solid #666;
  font-size:11px;
}

.log-entry.s1,
.log-entry.s2{
  border-left-color:#3794ff;
}

.log-entry.s3{
  border-left-color:#cca700;
}

.log-entry.s4,
.log-entry.s5{
  border-left-color:#23d18b;
}

.log-title{
  font-weight:700;
  font-size:11px;
}

/* Attack results */

.attack-card{
  border:1px solid var(--vscode-panel-border);
  border-radius:6px;
  margin-bottom:8px;
  padding:12px;
  background:var(--vscode-editor-background);
}

.attack-card.success{
  border-left:4px solid #f14c4c;
}

.attack-card.inconclusive{
  border-left:4px solid #cca700;
}

.attack-card.not-reproduced{
  border-left:4px solid #23d18b;
}

.attack-tool{
  font-weight:700;
  font-size:12px;
  margin-bottom:4px;
  display:flex;
  align-items:center;
  gap:6px;
}

.attack-evidence{
  font-size:11px;
  color:var(--vscode-descriptionForeground);
  margin-top:6px;
}

.attack-payload-badge{
  font-family:monospace;
  font-size:10px;
  background:rgba(0,0,0,.25);
  padding:3px 6px;
  border-radius:3px;
  margin-top:4px;
  display:inline-block;
  word-break:break-all;
}

.evidence-box{
  margin-top:8px;
  padding:8px;
  border-radius:4px;
  background:rgba(0,0,0,.2);
  border:1px solid var(--vscode-panel-border);
}

.evidence-title{
  font-size:9px;
  text-transform:uppercase;
  font-weight:700;
  color:var(--vscode-descriptionForeground);
  margin-bottom:4px;
}

.evidence-content{
  font-family:monospace;
  font-size:10px;
  white-space:pre-wrap;
  word-break:break-all;
  max-height:150px;
  overflow:auto;
}

/* Validation summary */

.validation-summary{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:8px;
  margin-top:12px;
}

.validation-stat{
  padding:10px;
  border:1px solid var(--vscode-panel-border);
  border-radius:5px;
  text-align:center;
}

.validation-stat-value{
  font-size:16px;
  font-weight:700;
}

.validation-stat-label{
  font-size:9px;
  color:var(--vscode-descriptionForeground);
  text-transform:uppercase;
  margin-top:2px;
}
</style>
</head>

<body>

<div class="header-bar">
  <div class="header-title">
    <h1>🛡️ SentinelAI</h1>
  </div>

  <div>
    <button
      class="btn btn-primary"
      id="btn-scan"
    >
      <span>⚡</span>
      Scan Workspace
    </button>
  </div>
</div>

<div id="root">
  <div class="state">
    <p>Waiting for workspace scan...</p>

    <button
      class="btn btn-primary"
      style="margin-top:12px"
      onclick="triggerScan()"
    >
      Start Security Scan
    </button>
  </div>
</div>

<div id="sandbox-root"></div>

<script>
const vscode = acquireVsCodeApi();

const root =
  document.getElementById('root');

const sandboxRoot =
  document.getElementById(
    'sandbox-root'
  );

let lastFindings = [];

let selectedRuntime = null;

vscode.postMessage({
  type: 'ready'
});

document
  .getElementById('btn-scan')
  .addEventListener(
    'click',
    triggerScan
  );

function triggerScan() {
  vscode.postMessage({
    type: 'requestScan'
  });
}

document.addEventListener(
  'click',
  e => {
    const btn =
      e.target.closest(
        '[data-copy]'
      );

    if (!btn) {
      return;
    }

    const text =
      btn.getAttribute(
        'data-copy'
      );

    navigator.clipboard
      .writeText(text)
      .then(() => {
        const original =
          btn.innerText;

        btn.innerText =
          'Copied!';

        setTimeout(
          () => {
            btn.innerText =
              original;
          },
          1500
        );
      })
      .catch(
        error => {
          console.error(
            'Clipboard copy failed:',
            error
          );
        }
      );
  }
);

window.addEventListener(
  'message',
  e => {
    const msg = e.data;

    if (
      msg.type ===
      'scanning'
    ) {
      root.innerHTML =
        '<div class="state">' +
        '<span class="spin">&#x27F3;</span>' +
        '&nbsp; Scanning workspace & analyzing security findings...' +
        '</div>';

      sandboxRoot.innerHTML =
        '';

      return;
    }

    if (
      msg.type ===
      'scanStage'
    ) {
      renderScanProgress(
        msg.stage,
        msg.message
      );

      return;
    }

    if (
      msg.type ===
      'runtimeSelected'
    ) {
      selectedRuntime = {
        url:
          msg.targetUrl,
        runtime:
          msg.runtime ||
          inferRuntime(msg.targetUrl),
        port:
          extractPort(
            msg.targetUrl
          ),
        reachable: true
      };

      renderRuntimeCard(
        selectedRuntime
      );

      return;
    }

    if (
      msg.type ===
      'error'
    ) {
      root.innerHTML =
        '<div class="state" style="color:#f14c4c;border-color:#f14c4c44">' +
        esc(msg.message) +
        '</div>';

      return;
    }

    if (
      msg.type ===
      'noFiles'
    ) {
      root.innerHTML =
        '<div class="state">' +
        'No supported source files found in workspace.' +
        '</div>';

      return;
    }

    if (
      msg.type ===
      'results'
    ) {
      const findings =
        msg.findings || [];

      const filesScanned =
        msg.filesScanned || 0;

      lastFindings =
        findings;

      renderResults(
        findings,
        filesScanned
      );

      return;
    }

    if (
      msg.type ===
      'fixApplied'
    ) {
      const targetIdx =
        lastFindings.findIndex(
          f =>
            f.id ===
            msg.findingId
        );

      if (
        targetIdx !== -1
      ) {
        lastFindings[
          targetIdx
        ].applied = true;

        const actionsElem =
          document.getElementById(
            'diff-actions-' +
            targetIdx
          );

        if (actionsElem) {
          actionsElem.innerHTML =
            '<span class="applied-badge">' +
            '✅ Fix Applied to ' +
            esc(
              lastFindings[
                targetIdx
              ].file
            ) +
            '</span>' +
            '<button class="btn btn-outline" onclick="openDiffInEditor(' +
            targetIdx +
            ')">' +
            '👁️ View Side-by-Side in Editor' +
            '</button>';
        }

        const confirmElem =
          document.getElementById(
            'confirm-box-' +
            targetIdx
          );

        if (confirmElem) {
          confirmElem.classList.remove(
            'open'
          );
        }
      }

      return;
    }

    if (
      msg.type ===
      'fixFailed'
    ) {
      const targetIdx =
        lastFindings.findIndex(
          f =>
            f.id ===
            msg.findingId
        );

      const confirmElem =
        targetIdx !== -1
          ? document.getElementById(
              'confirm-box-' +
              targetIdx
            )
          : null;

      if (confirmElem) {
        confirmElem.innerHTML =
          '<div class="confirm-title" style="color:#f14c4c">' +
          '❌ Fix could not be applied' +
          '</div>' +
          '<p style="font-size:11px">' +
          esc(
            msg.message ||
            'Unknown error'
          ) +
          '</p>';

        confirmElem.classList.add(
          'open'
        );
      }

      return;
    }

    if (
      msg.type ===
      'showConsent'
    ) {
      showConsentBox();
      return;
    }

    if (
      msg.type ===
      'sandboxStarted'
    ) {
      sandboxRoot.innerHTML =
        '<div class="state">' +
        '<span class="spin">&#x27F3;</span>' +
        '&nbsp; Starting controlled runtime validation...' +
        '</div>';

      return;
    }

    if (
      msg.type ===
      'sandboxResults'
    ) {
      renderSandboxReport(
        msg.report
      );

      return;
    }

    if (
      msg.type ===
      'sandboxError'
    ) {
      sandboxRoot.innerHTML =
        '<div class="state" style="color:#f14c4c;border-color:#f14c4c44">' +
        esc(msg.message) +
        '</div>';

      return;
    }
  }
);

/* -------------------------------- */
/* Results                          */
/* -------------------------------- */

function renderResults(
  findings,
  filesScanned
) {
  let html = '';

  if (
    selectedRuntime
  ) {
    html +=
      buildRuntimeCard(
        selectedRuntime
      );
  }

  if (
    !findings ||
    findings.length === 0
  ) {
    html +=
      '<p class="meta">' +
      'Scanned ' +
      filesScanned +
      ' file(s)' +
      '</p>' +
      '<div class="clean">' +
      '&#x2713;&nbsp; No vulnerabilities detected' +
      '</div>';

    root.innerHTML =
      html;

    sandboxRoot.innerHTML =
      '';

    return;
  }

  const high =
    findings.filter(
      f =>
        f.severity ===
        'High'
    ).length;

  const medium =
    findings.filter(
      f =>
        f.severity ===
        'Medium'
    ).length;

  const low =
    findings.filter(
      f =>
        f.severity ===
        'Low'
    ).length;

  html +=
    '<div class="summary">';

  html +=
    '<span class="meta" style="margin:0;margin-right:8px">' +
    'Scanned ' +
    filesScanned +
    ' file(s) — ' +
    findings.length +
    ' issue(s)' +
    '</span>';

  if (high) {
    html +=
      '<span class="pill High">' +
      high +
      ' High</span>';
  }

  if (medium) {
    html +=
      '<span class="pill Medium">' +
      medium +
      ' Medium</span>';
  }

  if (low) {
    html +=
      '<span class="pill Low">' +
      low +
      ' Low</span>';
  }

  html +=
    '<button class="btn btn-success" style="margin-left:auto;font-size:10px" onclick="applyAllFixes()">' +
    '⚡ Apply All Fixes' +
    '</button>';

  html +=
    '<button class="btn btn-danger" style="font-size:10px" onclick="showConsentBox()">' +
    '🛡️ Validate Findings' +
    '</button>';

  html +=
    '</div>';

  findings.forEach(
    (f, i) => {
      html +=
        '<div class="card">';

      html +=
        '<div class="card-head" onclick="toggleCard(' +
        i +
        ')">';

      html +=
        '<span class="badge ' +
        esc(f.severity) +
        '">' +
        esc(f.severity) +
        '</span>';

      html +=
        '<span class="card-title">' +
        esc(f.type);

      if (f.attackType) {
        html +=
          '<span class="attack-type-badge">' +
          esc(f.attackType) +
          '</span>';
      }

      html +=
        '</span>';

      html +=
        '<span class="card-file">' +
        esc(f.file) +
        (
          f.line
            ? ' : L' +
              esc(f.line)
            : ''
        ) +
        '</span>';

      html +=
        '</div>';

      html +=
        '<div class="card-body" id="card-' +
        i +
        '">';

      html +=
        '<div class="label">Vulnerability Root Cause</div>';

      html +=
        '<p>' +
        esc(
          f.explanation
        ) +
        '</p>';

      if (
        f.vulnerableCode
      ) {
        html +=
          '<div class="label">Vulnerable Code Context</div>';

        html +=
          '<div class="code-block">' +
          esc(
            f.vulnerableCode
          ) +
          '</div>';
      }

      if (
        f.attackStory &&
        f.attackStory.length
      ) {
        html +=
          '<div class="label">Attacker Exploitation Steps</div>';

        f.attackStory.forEach(
          (
            step,
            si
          ) => {
            html +=
              '<div class="step">' +
              '<span class="step-n">' +
              (
                si + 1
              ) +
              '</span>' +
              '<span>' +
              esc(step) +
              '</span>' +
              '</div>';
          }
        );
      }

      if (
        f.attackPayloads &&
        f.attackPayloads.length
      ) {
        html +=
          '<div class="attack-section">';

        html +=
          '<div class="attack-section-title">' +
          '🔥 Targeted Exploit Payloads' +
          '</div>';

        f.attackPayloads.forEach(
          payload => {
            html +=
              '<div class="payload-item">' +
              '<div class="payload-box">' +
              '<span class="payload-text"><code>' +
              esc(payload) +
              '</code></span>' +
              '<button class="copy-btn" data-copy="' +
              esc(payload) +
              '">' +
              'Copy' +
              '</button>' +
              '</div>' +
              '</div>';
          }
        );

        html +=
          '</div>';
      }

      if (f.attackScript) {
        html +=
          '<div class="attack-section">';

        html +=
          '<div class="attack-section-title">' +
          '📱 Proof-of-Concept Exploit Script' +
          '</div>';

        html +=
          '<div class="payload-box">' +
          '<span class="payload-text"><code>' +
          esc(f.attackScript) +
          '</code></span>' +
          '<button class="copy-btn" data-copy="' +
          esc(f.attackScript) +
          '">' +
          'Copy' +
          '</button>' +
          '</div>';

        html +=
          '</div>';
      }

      html +=
        '<div class="label">Remediation & Fix</div>';

      html +=
        '<div class="fix-box">' +
        esc(f.fix) +
        '</div>';

      if (f.fixedCode) {
        html +=
          '<div class="label">Secure Code Example</div>' +
          '<div class="code-block" style="border-left:3px solid #23d18b">' +
          esc(f.fixedCode) +
          '</div>';
      }

      if (
        f.fixedCode ||
        f.vulnerableCode
      ) {
        html +=
          '<div class="diff-section">';

        html +=
          '<div class="diff-header">' +
          '📝 Proposed Code Changes' +
          '</div>';

        html +=
          '<div class="diff-block">';

        if (
          f.vulnerableCode
        ) {
          f.vulnerableCode
            .split('\\n')
            .forEach(
              line => {
                html +=
                  '<div class="diff-line diff-del">' +
                  '<span class="diff-line-num">-</span>' +
                  '<span>' +
                  esc(line) +
                  '</span>' +
                  '</div>';
              }
            );
        }

        if (f.fixedCode) {
          f.fixedCode
            .split('\\n')
            .forEach(
              line => {
                html +=
                  '<div class="diff-line diff-add">' +
                  '<span class="diff-line-num">+</span>' +
                  '<span>' +
                  esc(line) +
                  '</span>' +
                  '</div>';
              }
            );
        }

        html +=
          '</div>';

        html +=
          '<div class="diff-actions" id="diff-actions-' +
          i +
          '">';

        if (f.applied) {
          html +=
            '<span class="applied-badge">' +
            '✅ Fix Applied to ' +
            esc(f.file) +
            '</span>';
        } else {
          html +=
            '<button class="btn btn-success" onclick="toggleConfirmBox(' +
            i +
            ')">' +
            '⚡ Apply Changes to Code' +
            '</button>';
        }

        html +=
          '<button class="btn btn-outline" onclick="openDiffInEditor(' +
          i +
          ')">' +
          '👁️ View Side-by-Side in Editor' +
          '</button>';

        html +=
          '</div>';

        html +=
          '<div class="confirm-box" id="confirm-box-' +
          i +
          '">';

        html +=
          '<div class="confirm-title">' +
          '❓ Apply these secure changes to your workspace file?' +
          '</div>';

        html +=
          '<p style="margin-bottom:10px;font-size:11px">' +
          'This will update <b>' +
          esc(f.file) +
          '</b>' +
          (
            f.line
              ? ' at Line ' +
                esc(f.line)
              : ''
          ) +
          ' with the secure code above.' +
          '</p>';

        html +=
          '<div style="display:flex;gap:8px">';

        html +=
          '<button class="btn btn-success" onclick="applyFix(' +
          i +
          ')">' +
          '✅ Yes, Apply Fix' +
          '</button>';

        html +=
          '<button class="btn btn-secondary" onclick="toggleConfirmBox(' +
          i +
          ')">' +
          'Cancel' +
          '</button>';

        html +=
          '</div>';

        html +=
          '</div>';

        html +=
          '</div>';
      }

      html +=
        '</div></div>';
    }
  );

  root.innerHTML =
    html;
}

/* -------------------------------- */
/* Runtime UI                       */
/* -------------------------------- */

function renderRuntimeCard(
  runtime
) {
  if (!runtime) {
    return;
  }

  const existing =
    document.getElementById(
      'runtime-card'
    );

  const html =
    buildRuntimeCard(
      runtime
    );

  if (existing) {
    existing.outerHTML =
      html;
  } else {
    root.insertAdjacentHTML(
      'afterbegin',
      html
    );
  }
}

function buildRuntimeCard(
  runtime
) {
  const online =
    runtime.reachable !== false;

  return (
    '<div class="runtime-card" id="runtime-card">' +

      '<div class="runtime-header">' +
        '<div class="runtime-title">' +
          '🌐 Project Runtime' +
        '</div>' +

        '<span class="runtime-status ' +
        (
          online
            ? 'online'
            : 'offline'
        ) +
        '">' +
        (
          online
            ? '● Online'
            : '● Offline'
        ) +
        '</span>' +
      '</div>' +

      '<div class="runtime-body">' +

        '<div class="runtime-main">' +

          '<div class="runtime-icon">⚙️</div>' +

          '<div>' +
            '<div class="runtime-name">' +
              esc(
                runtime.runtime ||
                'HTTP Application'
              ) +
            '</div>' +

            '<div class="runtime-url">' +
              esc(
                runtime.url ||
                ''
              ) +
            '</div>' +
          '</div>' +

        '</div>' +

        '<div class="runtime-grid">' +

          '<div class="runtime-field">' +
            '<div class="runtime-label">Runtime</div>' +
            '<div class="runtime-value">' +
              esc(
                runtime.runtime ||
                'HTTP Application'
              ) +
            '</div>' +
          '</div>' +

          '<div class="runtime-field">' +
            '<div class="runtime-label">Port</div>' +
            '<div class="runtime-value">' +
              esc(
                String(
                  runtime.port ||
                  extractPort(
                    runtime.url
                  ) ||
                  '—'
                )
              ) +
            '</div>' +
          '</div>' +

          '<div class="runtime-field">' +
            '<div class="runtime-label">HTTP Status</div>' +
            '<div class="runtime-value">' +
              esc(
                String(
                  runtime.statusCode ||
                  (
                    online
                      ? 'Online'
                      : 'Offline'
                  )
                )
              ) +
            '</div>' +
          '</div>' +

        '</div>' +

        '<div class="runtime-actions">' +

          '<button class="btn btn-primary" onclick="openRuntime()">' +
            '↗ Open Runtime' +
          '</button>' +

          '<button class="btn btn-outline" onclick="redetectRuntime()">' +
            '⟳ Re-detect' +
          '</button>' +

        '</div>' +

      '</div>' +

    '</div>'
  );
}

function redetectRuntime() {
  vscode.postMessage({
    type:
      'detectRuntime'
  });
}

function openRuntime() {
  vscode.postMessage({
    type:
      'openRuntime'
  });
}

function extractPort(
  url
) {
  if (!url) {
    return null;
  }

  try {
    const parsed =
      new URL(url);

    if (parsed.port) {
      return Number(
        parsed.port
      );
    }

    return parsed.protocol ===
      'https:'
      ? 443
      : 80;
  } catch {
    return null;
  }
}

function inferRuntime(
  url
) {
  return 'HTTP Application';
}

/* -------------------------------- */
/* Scan progress                    */
/* -------------------------------- */

function renderScanProgress(
  stage,
  message
) {
  const s =
    stage || 1;

  const msg =
    message ||
    'Scanning...';

  let html =
    '<div class="scan-progress">';

  html +=
    '<div class="scan-progress-header">' +
    '<span class="spin" style="font-size:20px;color:#3794ff">&#x27F3;</span>' +
    '<div>' +
    '<div style="font-weight:700;font-size:14px">' +
    'Security Audit In Progress' +
    '</div>' +
    '<div style="font-size:11px;color:var(--vscode-descriptionForeground)">' +
    esc(msg) +
    '</div>' +
    '</div>' +
    '</div>';

  const steps = [
    {
      label:
        'Workspace Collection & Static Analysis',
      icon:
        '⚡',
      doneIcon:
        '✅'
    },
    {
      label:
        'AI Vulnerability Analysis & Attack Modeling',
      icon:
        '🧠',
      doneIcon:
        '✅'
    },
    {
      label:
        'Exploit Commands & Remediation Synthesis',
      icon:
        '🛡️',
      doneIcon:
        '✅'
    }
  ];

  steps.forEach(
    (step, i) => {
      const n =
        i + 1;

      const cls =
        s > n
          ? 'done'
          : s === n
            ? 'active'
            : 'queued';

      const icon =
        s > n
          ? step.doneIcon
          : step.icon;

      const status =
        s > n
          ? 'COMPLETED'
          : s === n
            ? 'IN PROGRESS'
            : 'QUEUED';

      const statusColor =
        s > n
          ? '#23d18b'
          : s === n
            ? '#3794ff'
            : 'var(--vscode-descriptionForeground)';

      html +=
        '<div class="scan-step ' +
        cls +
        '">' +

        '<span style="font-size:14px">' +
        icon +
        '</span>' +

        '<span class="scan-step-label">' +
        'Step ' +
        n +
        ': ' +
        step.label +
        '</span>' +

        '<span class="scan-step-status" style="color:' +
        statusColor +
        '">' +
        status +
        '</span>' +

        '</div>';
    }
  );

  html +=
    '</div>';

  root.innerHTML =
    html;

  sandboxRoot.innerHTML =
    '';
}

/* -------------------------------- */
/* Card interactions                */
/* -------------------------------- */

function toggleCard(i) {
  const elem =
    document.getElementById(
      'card-' + i
    );

  if (elem) {
    elem.classList.toggle(
      'open'
    );
  }
}

function toggleConfirmBox(i) {
  const elem =
    document.getElementById(
      'confirm-box-' + i
    );

  if (elem) {
    elem.classList.toggle(
      'open'
    );
  }
}

function applyFix(i) {
  const finding =
    lastFindings[i];

  if (!finding) {
    return;
  }

  const confirmElem =
    document.getElementById(
      'confirm-box-' + i
    );

  if (confirmElem) {
    confirmElem.innerHTML =
      '<div style="display:flex;align-items:center;gap:8px">' +
      '<span class="spin" style="font-size:14px">&#x27F3;</span>' +
      '<span style="font-size:11px">Applying fix...</span>' +
      '</div>';

    confirmElem.classList.add(
      'open'
    );
  }

  vscode.postMessage({
    type:
      'applyFix',
    finding
  });
}

function openDiffInEditor(i) {
  const finding =
    lastFindings[i];

  if (!finding) {
    return;
  }

  vscode.postMessage({
    type:
      'openDiff',
    finding
  });
}

function applyAllFixes() {
  const fixable =
    lastFindings.filter(
      f =>
        f.fixedCode &&
        f.vulnerableCode &&
        f.file &&
        !f.applied
    );

  if (
    fixable.length === 0
  ) {
    return;
  }

  vscode.postMessage({
    type:
      'applyAllFixes',
    findings:
      lastFindings
  });
}

/* -------------------------------- */
/* Runtime validation               */
/* -------------------------------- */

function showConsentBox() {
  if (
    lastFindings.length === 0
  ) {
    sandboxRoot.innerHTML =
      '<div class="state" style="color:#cca700">' +
      'Run a workspace scan first to generate security findings.' +
      '</div>';

    return;
  }

  const runtimeText =
    selectedRuntime
      ? (
        esc(
          selectedRuntime.runtime
        ) +
        ' @ ' +
        esc(
          selectedRuntime.url
        )
      )
      : 'Runtime will be detected automatically.';

  sandboxRoot.innerHTML =
    '<div class="consent">' +

      '<div class="consent-title">' +
        '🛡️ Controlled Runtime Validation' +
      '</div>' +

      '<p>' +
        'SentinelAI will validate the detected security findings against a local project runtime. ' +
        'The validator tooling runs inside Docker while the target remains your locally running application.' +
      '</p>' +

      '<div class="mode-selection">' +

        '<div style="font-weight:700;font-size:11px;margin-bottom:8px">' +
          'Validation Target' +
        '</div>' +

        '<div style="padding:10px;border:1px solid var(--vscode-panel-border);border-radius:5px;margin-bottom:10px">' +

          '<div style="font-size:11px;font-weight:700">' +
            runtimeText +
          '</div>' +

          '<div style="font-size:10px;color:var(--vscode-descriptionForeground);margin-top:3px">' +
            (
              selectedRuntime
                ? (
                  'Port ' +
                  (
                    selectedRuntime.port ||
                    extractPort(
                      selectedRuntime.url
                    )
                  )
                )
                : 'No runtime selected yet'
            ) +
          '</div>' +

        '</div>' +

        '<div class="mode-options">' +

          '<div class="mode-option">' +
            '<input type="radio" id="mode-simulation" name="attack-mode" value="simulation" checked>' +

            '<label for="mode-simulation">' +
              'Safe Simulation' +

              '<div style="font-size:10px;opacity:.7;margin-top:2px">' +
                'Uses the synthetic vulnerable target inside Docker.' +
              '</div>' +

            '</label>' +
          '</div>' +

          '<div class="mode-option">' +
            '<input type="radio" id="mode-project" name="attack-mode" value="project-validation">' +

            '<label for="mode-project">' +
              'Project Validation' +

              '<div style="font-size:10px;opacity:.7;margin-top:2px">' +
                'Tests the actual locally running project.' +
              '</div>' +

            '</label>' +
          '</div>' +

        '</div>' +

      '</div>' +

      '<div style="display:flex;gap:10px;margin-top:14px">' +

        '<button class="btn btn-danger" onclick="startSandbox()">' +
          '▶ Start Validation' +
        '</button>' +

        '<button class="btn btn-secondary" onclick="dismissSandbox()">' +
          'Cancel' +
        '</button>' +

      '</div>' +

    '</div>';

  sandboxRoot.scrollIntoView({
    behavior:
      'smooth'
  });
}

function startSandbox() {
  const modeInput =
    document.querySelector(
      'input[name="attack-mode"]:checked'
    );

  const mode =
    modeInput
      ? modeInput.value
      : 'simulation';

  vscode.postMessage({
    type:
      'runSandbox',
    findings:
      lastFindings,
    mode
  });
}

function dismissSandbox() {
  sandboxRoot.innerHTML =
    '';
}

/* -------------------------------- */
/* Sandbox report                   */
/* -------------------------------- */

function renderSandboxReport(
  report
) {
  if (!report) {
    return;
  }

  const attacks =
    report.attacks || [];

  const events =
    report.events || [];

  const validations =
    report.validations || [];

  const target =
    report.target || {};

  const summary =
    report.summary || {};

  const successfulAttacks =
    attacks.filter(
      a =>
        a.status ===
        'success'
    );

  const confirmed =
    validations.filter(
      v =>
        v.result ===
        'confirmed'
    ).length;

  const inconclusive =
    validations.filter(
      v =>
        v.result ===
        'inconclusive'
    ).length;

  const notReproduced =
    validations.filter(
      v =>
        v.result ===
        'not_reproduced'
    ).length;

  let html =
    '<div style="margin-top:20px;padding-top:16px;border-top:2px solid var(--vscode-panel-border)">';

  if (
    confirmed > 0
  ) {
    html +=
      '<div style="padding:12px;background:rgba(241,76,76,.15);color:#f14c4c;border:1px solid rgba(241,76,76,.4);border-radius:6px;font-weight:700;text-align:center">' +
      '🚨 VALIDATION COMPLETE: ' +
      confirmed +
      ' finding(s) confirmed against the runtime.' +
      '</div>';
  } else {
    html +=
      '<div style="padding:12px;background:rgba(35,209,139,.15);color:#23d18b;border:1px solid rgba(35,209,139,.4);border-radius:6px;font-weight:700;text-align:center">' +
      '✓ VALIDATION COMPLETE: No findings were confirmed by runtime testing.' +
      '</div>';
  }

  /* Runtime target */

  html +=
    '<div class="mock-browser">';

  html +=
    '<div class="mock-browser-bar">';

  html +=
    '<div class="mock-dots">' +
    '<span class="mock-dot r"></span>' +
    '<span class="mock-dot y"></span>' +
    '<span class="mock-dot g"></span>' +
    '</div>';

  html +=
    '<div class="mock-url">' +
    '🌐 ' +
    esc(
      target.url ||
      'Unknown target'
    ) +
    '</div>';

  html +=
    '<span class="status-pill ' +
    (
      target.status ===
      'running'
        ? 'green'
        : 'red'
    ) +
    '">' +
    (
      target.status ===
      'running'
        ? 'Target Online'
        : 'Target Offline'
    ) +
    '</span>';

  html +=
    '</div>';

  html +=
    '<div class="mock-viewport">';

  html +=
    '<div class="mock-app-header">' +
    '<h2>🌐 Project Runtime</h2>' +
    '<p style="font-size:11px;opacity:.7;margin-top:3px">' +
    'Controlled validation target' +
    '</p>' +
    '</div>';

  html +=
    '<div class="runtime-target-info">';

  html +=
    '<div class="runtime-target-box">' +
    '<div class="small-label">Runtime</div>' +
    '<div class="small-value">' +
    esc(
      inferReportRuntime(
        target,
        selectedRuntime
      )
    ) +
    '</div>' +
    '</div>';

  html +=
    '<div class="runtime-target-box">' +
    '<div class="small-label">Port</div>' +
    '<div class="small-value">' +
    esc(
      String(
        extractPort(
          target.url
        ) ||
        '—'
      )
    ) +
    '</div>' +
    '</div>';

  html +=
    '<div class="runtime-target-box">' +
    '<div class="small-label">Target URL</div>' +
    '<div class="small-value">' +
    esc(
      target.url ||
      'Unknown'
    ) +
    '</div>' +
    '</div>';

  html +=
    '<div class="runtime-target-box">' +
    '<div class="small-label">Validation Mode</div>' +
    '<div class="small-value">' +
    esc(
      report.mode ===
      'project-validation'
        ? 'Project Validation'
        : 'Safe Simulation'
    ) +
    '</div>' +
    '</div>';

  html +=
    '</div>';

  html +=
    '</div>';

  html +=
    '</div>';

  /* Summary */

  html +=
    '<div class="label">Validation Summary</div>';

  html +=
    '<div class="validation-summary">';

  html +=
    '<div class="validation-stat">' +
    '<div class="validation-stat-value">' +
    esc(
      String(
        summary.findings ||
        validations.length
      )
    ) +
    '</div>' +
    '<div class="validation-stat-label">Findings</div>' +
    '</div>';

  html +=
    '<div class="validation-stat">' +
    '<div class="validation-stat-value" style="color:#f14c4c">' +
    confirmed +
    '</div>' +
    '<div class="validation-stat-label">Confirmed</div>' +
    '</div>';

  html +=
    '<div class="validation-stat">' +
    '<div class="validation-stat-value" style="color:#cca700">' +
    inconclusive +
    '</div>' +
    '<div class="validation-stat-label">Inconclusive</div>' +
    '</div>';

  html +=
    '<div class="validation-stat">' +
    '<div class="validation-stat-value" style="color:#23d18b">' +
    notReproduced +
    '</div>' +
    '<div class="validation-stat-label">Not Reproduced</div>' +
    '</div>';

  html +=
    '</div>';

  /* Timeline */

  html +=
    '<div class="timeline">';

  html +=
    '<div class="label">' +
    'Validation Execution' +
    '</div>';

  events.forEach(
    ev => {
      html +=
        '<div class="log-entry s' +
        esc(
          String(
            ev.step ||
            1
          )
        ) +
        '">' +

        '<div class="log-title">' +
        'Step ' +
        esc(
          String(
            ev.step ||
            ''
          )
        ) +
        ': ' +
        esc(
          ev.description ||
          ''
        ) +
        '</div>' +

        '<div style="font-size:10px;color:var(--vscode-descriptionForeground);margin-top:3px">' +
        esc(
          ev.status ||
          ''
        ) +
        (
          ev.tool
            ? ' · ' +
              esc(
                ev.tool
              )
            : ''
        ) +
        '</div>' +

        '</div>';
    }
  );

  html +=
    '</div>';

  /* Attacks */

  html +=
    '<div style="margin-top:14px">';

  html +=
    '<div class="label">' +
    'Runtime Attack Evidence' +
    '</div>';

  if (
    attacks.length === 0
  ) {
    html +=
      '<div class="state">' +
      'No runtime attack requests were executed.' +
      '</div>';
  }

  attacks.forEach(
    attack => {
      const status =
        attack.status ||
        'inconclusive';

      const cssClass =
        status ===
        'success'
          ? 'success'
          : status ===
            'failed'
            ? 'not-reproduced'
            : 'inconclusive';

      html +=
        '<div class="attack-card ' +
        cssClass +
        '">';

      html +=
        '<div class="attack-tool">' +
        (
          status ===
          'success'
            ? '💥'
            : status ===
              'failed'
              ? '🛡️'
              : '⚠️'
        ) +
        ' ' +
        esc(
          attack.tool ||
          'Validator'
        ) +
        '</div>';

      html +=
        '<div style="font-size:11px;font-family:monospace;margin-top:2px">' +
        'Target: ' +
        esc(
          attack.target ||
          target.url ||
          ''
        ) +
        '</div>';

      html +=
        '<div style="font-size:10px;margin-top:4px;color:var(--vscode-descriptionForeground)">' +
        'Attack type: ' +
        esc(
          attack.attackType ||
          'unknown'
        ) +
        ' · Status: ' +
        esc(status) +
        '</div>';

      if (attack.payload) {
        html +=
          '<div class="attack-payload-badge">' +
          'Payload: ' +
          esc(
            attack.payload
          ) +
          '</div>';
      }

      if (
        attack.request
      ) {
        html +=
          '<div class="evidence-box">' +
          '<div class="evidence-title">Request</div>' +
          '<div class="evidence-content">' +
          esc(
            JSON.stringify(
              attack.request,
              null,
              2
            )
          ) +
          '</div>' +
          '</div>';
      }

      if (
        attack.response
      ) {
        html +=
          '<div class="evidence-box">' +
          '<div class="evidence-title">Response</div>' +
          '<div class="evidence-content">' +
          esc(
            JSON.stringify(
              attack.response,
              null,
              2
            )
          ) +
          '</div>' +
          '</div>';
      }

      if (
        attack.evidence &&
        attack.evidence.length
      ) {
        html +=
          '<div class="evidence-box">' +
          '<div class="evidence-title">Evidence</div>';

        attack.evidence.forEach(
          evidence => {
            html +=
              '<div style="margin-bottom:6px">' +
              '<div style="font-size:9px;font-weight:700;color:#3794ff">' +
              esc(
                evidence.type ||
                'evidence'
              ) +
              '</div>' +
              '<div class="evidence-content">' +
              esc(
                evidence.content ||
                ''
              ) +
              '</div>' +
              '</div>';
          }
        );

        html +=
          '</div>';
      }

      html +=
        '</div>';
    }
  );

  html +=
    '</div>';

  /* Validation verdicts */

  if (
    validations.length
  ) {
    html +=
      '<div style="margin-top:14px">';

    html +=
      '<div class="label">' +
      'Finding Validation Verdicts' +
      '</div>';

    validations.forEach(
      validation => {
        const verdict =
          validation.result ||
          'inconclusive';

        const color =
          verdict ===
          'confirmed'
            ? '#f14c4c'
            : verdict ===
              'not_reproduced'
              ? '#23d18b'
              : '#cca700';

        html +=
          '<div style="padding:10px 12px;margin-bottom:6px;border:1px solid var(--vscode-panel-border);border-left:3px solid ' +
          color +
          ';border-radius:5px">' +

          '<div style="font-weight:700;font-size:11px">' +
          esc(
            verdict.replace(
              /_/g,
              ' '
            ).toUpperCase()
          ) +
          '</div>' +

          '<div style="font-size:11px;margin-top:4px">' +
          esc(
            validation.rationale ||
            ''
          ) +
          '</div>' +

          '<div style="font-size:10px;color:var(--vscode-descriptionForeground);margin-top:4px">' +
          'Confidence: ' +
          esc(
            String(
              validation.confidence ||
              0
            )
          ) +
          '%' +
          '</div>' +

          '</div>';
      }
    );

    html +=
      '</div>';
  }

  html +=
    '</div>';

  sandboxRoot.innerHTML =
    html;

  sandboxRoot.scrollIntoView({
    behavior:
      'smooth'
  });
}

function inferReportRuntime(
  target,
  selected
) {
  if (
    selected &&
    selected.url ===
      target.url
  ) {
    return (
      selected.runtime ||
      'HTTP Application'
    );
  }

  return (
    target.runtime ||
    'HTTP Application'
  );
}

/* -------------------------------- */
/* Helpers                          */
/* -------------------------------- */

function esc(str) {
  if (
    str === null ||
    str === undefined
  ) {
    return '';
  }

  return String(str)
    .replace(
      /&/g,
      '&amp;'
    )
    .replace(
      /</g,
      '&lt;'
    )
    .replace(
      />/g,
      '&gt;'
    )
    .replace(
      /"/g,
      '&quot;'
    )
    .replace(
      /'/g,
      '&#39;'
    );
}
</script>

</body>
</html>`;
} 