export function getWebviewScriptValidation(): string {
  return `/* Runtime validation */
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
}`;
}
