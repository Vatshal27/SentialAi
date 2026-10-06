export function getWebviewScriptTheme(): string {
  return `/* Theme */
function applySentinelTheme(theme) {
  const normalized=theme==='light'?'light':'dark';
  document.documentElement.setAttribute('data-sentinel-theme',normalized);
  const button=document.getElementById('btn-theme');
  if (button) {
    button.textContent=normalized==='light'?'🌙 Dark':'☀️ Light';
    button.title=normalized==='light'?'Switch to dark theme':'Switch to light theme';
  }
  const state=vscode.getState()||{};
  vscode.setState({...state,sentinelTheme:normalized});
}
function toggleSentinelTheme() {
  const current=document.documentElement.getAttribute('data-sentinel-theme')||'dark';
  applySentinelTheme(current==='dark'?'light':'dark');
}
function initializeSentinelTheme() {
  const state=vscode.getState()||{};
  const stored=state.sentinelTheme;
  const vscodeKind=document.body.getAttribute('data-vscode-theme-kind');
  const initial=stored||(vscodeKind==='vscode-light'?'light':'dark');
  applySentinelTheme(initial);
  const button=document.getElementById('btn-theme');
  if (button) {
    button.addEventListener('click',toggleSentinelTheme);
  }
}
initializeSentinelTheme();`;
}
