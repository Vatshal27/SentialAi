export function getWebviewBody(): string {
  return `<div class="header-bar">
  <div class="header-title">
    <h1>🛡️ SentinelAI</h1>
  </div>
  <div class="header-actions">
    <button class="btn btn-outline" id="btn-theme" title="Switch light/dark theme">🌙 Dark</button>
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
<div id="sandbox-root"></div>`;
}
