export function getWebviewScriptResults(): string {
  return `/* Results */
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
    '<button class="btn btn-success" style="margin-left:auto;font-size:10px" onclick="reviewAllFixes()">' +
    '🔎 Review All Fixes' +
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
            .split('\\\\n')
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
            .split('\\\\n')
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
}`;
}
