export function getWebviewScriptScan(): string {
  return `/* Scan progress */
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
}`;
}
