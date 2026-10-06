export function getWebviewScriptSandbox(): string {
  return `/* Sandbox report */
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
}`;
}
