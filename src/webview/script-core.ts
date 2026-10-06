export function getWebviewScriptCore(): string {
  return `/* Core */
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
function setScanButtonState(scanning) {
  const button=document.getElementById('btn-scan');
  if (!button) {
    return;
  }
  button.disabled=scanning;
  button.innerHTML=scanning?'<span class="spin">⟳</span> Scanning...':'<span>⚡</span> Scan Workspace';
}
function triggerScan() {
  setScanButtonState(true);
  renderScanProgress(1,'Collecting workspace files and preparing static analysis...');
  vscode.postMessage({
    type:'requestScan'
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
      setScanButtonState(true);
      renderScanProgress(1,msg.message||'Collecting workspace files and preparing static analysis...');
      return;
    }
    if (
      msg.type ===
      'scanStage'
    ) {
      setScanButtonState(true);
      renderScanProgress(msg.stage,msg.message);
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
      setScanButtonState(false);
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
      setScanButtonState(false);
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
      setScanButtonState(false);
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
);`;
}
