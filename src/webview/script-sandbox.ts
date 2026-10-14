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

    const isSimulation =
      report.mode ===
      'simulation';

    const isProjectValidation =
      report.mode ===
      'project-validation';

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

    const observedExposures =
      validations.filter(
        v =>
          v.result ===
          'observed_exposure'
      ).length;

    const failed =
      attacks.filter(
        attack =>
          attack.status ===
          'failed'
      ).length;

    const executed =
      attacks.length;

    let html =
      '<div style="margin-top:20px;padding-top:16px;border-top:2px solid var(--vscode-panel-border)">';

    /* -------------------------------- */
    /* Completion banner                */
    /* -------------------------------- */

    if (isSimulation) {
      if (
        confirmed ===
        validations.length &&
        validations.length > 0
      ) {
        html +=
          '<div style="padding:12px;background:rgba(35,209,139,.15);color:#23d18b;border:1px solid rgba(35,209,139,.4);border-radius:6px;font-weight:700;text-align:center">' +
          '✓ SAFE SIMULATION COMPLETE: ' +
          confirmed +
          '/' +
          validations.length +
          ' controlled fixture(s) detected.' +
          '</div>';
      } else {
        html +=
          '<div style="padding:12px;background:rgba(204,167,0,.15);color:#cca700;border:1px solid rgba(204,167,0,.4);border-radius:6px;font-weight:700;text-align:center">' +
          '⚠ SAFE SIMULATION COMPLETE: ' +
          confirmed +
          '/' +
          validations.length +
          ' controlled fixture(s) detected.' +
          '</div>';
      }
    } else {
      if (
        confirmed > 0
      ) {
        html +=
          '<div style="padding:12px;background:rgba(241,76,76,.15);color:#f14c4c;border:1px solid rgba(241,76,76,.4);border-radius:6px;font-weight:700;text-align:center">' +
          '🚨 VALIDATION COMPLETE: ' +
          confirmed +
          ' runtime vulnerability finding(s) confirmed.' +
          '</div>';
      } else {
        html +=
          '<div style="padding:12px;background:rgba(35,209,139,.15);color:#23d18b;border:1px solid rgba(35,209,139,.4);border-radius:6px;font-weight:700;text-align:center">' +
          '✓ VALIDATION COMPLETE: No vulnerabilities were detected in the runtime checks performed.' +
          '</div>';
      }
    }

    /* -------------------------------- */
    /* Runtime target                   */
    /* -------------------------------- */

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
      '<h2>' +
      (
        isSimulation
          ? '🧪 Safe Simulation Runtime'
          : '🌐 Project Runtime'
      ) +
      '</h2>' +
      '<p style="font-size:11px;opacity:.7;margin-top:3px">' +
      (
        isSimulation
          ? 'Controlled synthetic runtime-engine self-test'
          : 'Authorized project runtime validation target'
      ) +
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
      (
        isProjectValidation
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

    /* -------------------------------- */
    /* Summary                          */
    /* -------------------------------- */

    html +=
      '<div class="label">' +
      (
        isSimulation
          ? 'Safe Simulation Summary'
          : 'Runtime Validation Summary'
      ) +
      '</div>';

    html +=
      '<div class="validation-summary">';

    if (isSimulation) {
      html +=
        '<div class="validation-stat">' +
        '<div class="validation-stat-value">' +
        esc(
          String(
            validations.length ||
            executed
          )
        ) +
        '</div>' +
        '<div class="validation-stat-label">Controlled Fixtures</div>' +
        '</div>';

      html +=
        '<div class="validation-stat">' +
        '<div class="validation-stat-value" style="color:#23d18b">' +
        confirmed +
        '</div>' +
        '<div class="validation-stat-label">Detected</div>' +
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
        '<div class="validation-stat-value" style="color:#f14c4c">' +
        failed +
        '</div>' +
        '<div class="validation-stat-label">Failed</div>' +
        '</div>';
    } else {
      html +=
        '<div class="validation-stat">' +
        '<div class="validation-stat-value">' +
        executed +
        '</div>' +
        '<div class="validation-stat-label">Probes Executed</div>' +
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
        '<div class="validation-stat-value" style="color:#d18616">' +
        observedExposures +
        '</div>' +
        '<div class="validation-stat-label">Observed Exposures</div>' +
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
        '<div class="validation-stat">' +
        '<div class="validation-stat-value">' +
        failed +
        '</div>' +
        '<div class="validation-stat-label">Failed</div>' +
        '</div>';
    }

    html +=
      '</div>';

    /* -------------------------------- */
    /* Timeline                         */
    /* -------------------------------- */

    html +=
      '<div class="timeline">';

    html +=
      '<div class="label">' +
      (
        isSimulation
          ? 'Safe Simulation Execution'
          : 'Project Validation Execution'
      ) +
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

    /* -------------------------------- */
    /* Runtime evidence                 */
    /* -------------------------------- */

    html +=
      '<div style="margin-top:14px">';

    html +=
      '<div class="label">' +
      (
        isSimulation
          ? 'Controlled Fixture Evidence'
          : 'Runtime Probe Evidence'
      ) +
      '</div>';

    if (
      attacks.length === 0
    ) {
      html +=
        '<div class="state">' +
        (
          isSimulation
            ? 'No controlled fixture requests were executed.'
            : 'No runtime probes were executed.'
        ) +
        '</div>';
    }

    attacks.forEach(
      attack => {
        const status =
          attack.status ||
          'inconclusive';

        const matchingValidation =
          validations.find(
            validation =>
              validation.attackId ===
                attack.id ||
              validation.findingId ===
                attack.findingId
          );

        const verdict =
          matchingValidation
            ? (
                matchingValidation.result ||
                'inconclusive'
              )
            : (
                status ===
                'success'
                  ? (
                      isSimulation
                        ? 'confirmed'
                        : 'inconclusive'
                    )
                  : status
              );

        const cssClass =
          verdict ===
          'confirmed'
            ? 'success'
            : verdict ===
              'not_reproduced'
              ? 'not-reproduced'
              : 'inconclusive';

        html +=
          '<div class="attack-card ' +
          cssClass +
          '">';

        html +=
          '<div class="attack-tool">' +
          (
            verdict ===
            'confirmed'
              ? (
                  isSimulation
                    ? '🧪'
                    : '💥'
                )
              : verdict ===
                'not_reproduced'
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
          (
            isSimulation
              ? 'Fixture type: '
              : 'Probe type: '
          ) +
          esc(
            attack.attackType ||
            'unknown'
          ) +
          ' · Verdict: ' +
          esc(
            isSimulation &&
            verdict ===
            'confirmed'
              ? 'detected'
              : verdict.replace(
                  /_/g,
                  ' '
                )
          ) +
          '</div>';

        if (
          attack.payload
        ) {
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

    /* -------------------------------- */
    /* Validation verdicts              */
    /* -------------------------------- */

    if (
      validations.length
    ) {
      html +=
        '<div style="margin-top:14px">';

      html +=
        '<div class="label">' +
        (
          isSimulation
            ? 'Controlled Fixture Verdicts'
            : 'Runtime Validation Verdicts'
        ) +
        '</div>';

      validations.forEach(
        validation => {
          const verdict =
            validation.result ||
            'inconclusive';

          const color =
            verdict ===
            'confirmed'
              ? (
                  isSimulation
                    ? '#23d18b'
                    : '#f14c4c'
                )
              : verdict ===
                'not_reproduced'
                ? '#23d18b'
                : verdict ===
                  'observed_exposure'
                  ? '#d18616'
                  : '#cca700';

          const displayVerdict =
            isSimulation &&
            verdict ===
            'confirmed'
              ? 'DETECTED'
              : verdict
                  .replace(
                    /_/g,
                    ' '
                  )
                  .toUpperCase();

          let rationale =
            validation.rationale ||
            '';

          if (
            isSimulation &&
            verdict ===
            'confirmed'
          ) {
            const linkedAttack =
              attacks.find(
                attack =>
                  validation.attackId ===
                    attack.id ||
                  validation.findingId ===
                    attack.findingId
              );

            const attackType =
              linkedAttack
                ? linkedAttack.attackType
                : '';

            rationale =
              attackType
                ? (
                    'Expected ' +
                    attackType
                      .replace(
                        /_/g,
                        ' '
                      ) +
                    ' fixture behavior was reproduced.'
                  )
                : (
                    'Expected controlled vulnerability behavior was reproduced.'
                  );
          }

          html +=
            '<div style="padding:10px 12px;margin-bottom:6px;border:1px solid var(--vscode-panel-border);border-left:3px solid ' +
            color +
            ';border-radius:5px">' +
            '<div style="font-weight:700;font-size:11px">' +
            esc(
              displayVerdict
            ) +
            '</div>' +
            '<div style="font-size:11px;margin-top:4px">' +
            esc(
              rationale
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