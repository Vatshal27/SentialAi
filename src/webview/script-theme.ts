export function getWebviewScriptTheme(): string {
  return `/* Theme */
function applySentinelTheme(theme) {
  const normalized=theme==='light'?'light':'dark';
  document.documentElement.setAttribute('data-sentinel-theme',normalized);
  document.body.setAttribute('data-sentinel-theme',normalized);
  const button=document.getElementById('btn-theme');
  if (button) {
    button.textContent=normalized==='light'?'🌙 Dark':'☀️ Light';
    button.title=normalized==='light'?'Switch to dark theme':'Switch to light theme';
  }
  const state=vscode.getState()||{};
  vscode.setState({...state,sentinelTheme:normalized});
}
function toggleSentinelTheme() {
  const current=document.body.getAttribute('data-sentinel-theme')||'dark';
  applySentinelTheme(current==='dark'?'light':'dark');
}
function initializeSentinelTheme() {
  const state=vscode.getState()||{};
  const stored=state.sentinelTheme;
  const vscodeTheme=document.body.classList.contains('vscode-light')
    ? 'light'
    : 'dark';
  const initial=stored||vscodeTheme;
  applySentinelTheme(initial);
  const button=document.getElementById('btn-theme');
  if (button) {
    button.addEventListener('click',toggleSentinelTheme);
  }
}
initializeSentinelTheme();`;
}