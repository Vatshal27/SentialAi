export function getWebviewScriptValidation(): string {
  return `/* Runtime security scan */
function showConsentBox() {
  const findingCount=Array.isArray(lastFindings)?lastFindings.length:0;
  const runtimeText=selectedRuntime
    ? esc(selectedRuntime.runtime)+' @ '+esc(selectedRuntime.url)
    : 'Runtime will be detected automatically.';
  const runtimeDetail=selectedRuntime
    ? 'Port '+(selectedRuntime.port||extractPort(selectedRuntime.url))
    : 'No runtime selected yet';
  const findingText=findingCount>0
    ? findingCount+' existing security finding(s) will be included in targeted runtime testing.'
    : 'No static or AI findings are currently available. Runtime discovery will still run independently.';
  sandboxRoot.innerHTML=
    '<div class="consent">'+
      '<div class="consent-title">'+
        '🐳 Runtime Security Scan'+
      '</div>'+
      '<p>'+
        'SentinelAI will inspect and test application runtime behavior using Docker-based security tooling. Runtime scanning can discover exposed endpoints, sensitive data leakage, authentication problems, unsafe services, and exploitable behavior even when static analysis or AI reports no findings.'+
      '</p>'+
      '<div style="margin-top:10px;padding:10px;border:1px solid var(--vscode-panel-border);border-radius:5px;background:var(--vscode-editor-background)">'+
        '<div style="font-size:10px;color:var(--vscode-descriptionForeground)">'+
          findingText+
        '</div>'+
      '</div>'+
      '<div class="mode-selection">'+
        '<div style="font-weight:700;font-size:11px;margin-bottom:8px">'+
          'Runtime Target'+
        '</div>'+
        '<div style="padding:10px;border:1px solid var(--vscode-panel-border);border-radius:5px;margin-bottom:10px">'+
          '<div style="font-size:11px;font-weight:700">'+
            runtimeText+
          '</div>'+
          '<div style="font-size:10px;color:var(--vscode-descriptionForeground);margin-top:3px">'+
            runtimeDetail+
          '</div>'+
        '</div>'+
        '<div class="mode-options">'+
          '<div class="mode-option">'+
            '<input type="radio" id="mode-simulation" name="attack-mode" value="simulation" checked>'+
            '<label for="mode-simulation">'+
              'Safe Simulation'+
              '<div style="font-size:10px;opacity:.7;margin-top:2px">'+
                'Runs SentinelAI security tooling against the controlled synthetic target inside Docker.'+
              '</div>'+
            '</label>'+
          '</div>'+
          '<div class="mode-option">'+
            '<input type="radio" id="mode-project" name="attack-mode" value="project-validation">'+
            '<label for="mode-project">'+
              'Project Validation'+
              '<div style="font-size:10px;opacity:.7;margin-top:2px">'+
                'Tests the actual locally running project using Docker-based validator tooling.'+
              '</div>'+
            '</label>'+
          '</div>'+
        '</div>'+
      '</div>'+
      '<div style="padding:10px;border:1px solid rgba(204,167,0,.35);border-radius:5px;background:rgba(204,167,0,.06);font-size:10px;color:var(--vscode-descriptionForeground)">'+
        'Runtime tests are controlled and local. SentinelAI will report observed evidence separately from static or AI-generated findings.'+
      '</div>'+
      '<div style="display:flex;gap:10px;margin-top:14px">'+
        '<button class="btn btn-danger" onclick="startSandbox()">'+
          '▶ Start Runtime Scan'+
        '</button>'+
        '<button class="btn btn-secondary" onclick="dismissSandbox()">'+
          'Cancel'+
        '</button>'+
      '</div>'+
    '</div>';
  sandboxRoot.scrollIntoView({
    behavior:'smooth'
  });
}
function startSandbox() {
  const modeInput=document.querySelector('input[name="attack-mode"]:checked');
  const mode=modeInput?modeInput.value:'simulation';
  const findings=Array.isArray(lastFindings)?lastFindings:[];
  sandboxRoot.innerHTML=
    '<div class="state">'+
      '<span class="spin">⟳</span>'+
      '&nbsp; Starting Docker runtime security analysis...'+
    '</div>';
  vscode.postMessage({
    type:'runSandbox',
    findings,
    mode
  });
}
function dismissSandbox() {
  sandboxRoot.innerHTML='';
}`;
}