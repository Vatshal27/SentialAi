export function getWebviewScriptRuntime(): string {
  return `/* Runtime UI */
function renderRuntimeCard(
  runtime
) {
  if (!runtime) {
    return;
  }
  const existing =
    document.getElementById(
      'runtime-card'
    );
  const html =
    buildRuntimeCard(
      runtime
    );
  if (existing) {
    existing.outerHTML =
      html;
  } else {
    root.insertAdjacentHTML(
      'afterbegin',
      html
    );
  }
}
function buildRuntimeCard(
  runtime
) {
  const online =
    runtime.reachable !== false;
  return (
    '<div class="runtime-card" id="runtime-card">' +
      '<div class="runtime-header">' +
        '<div class="runtime-title">' +
          '🌐 Project Runtime' +
        '</div>' +
        '<span class="runtime-status ' +
        (
          online
            ? 'online'
            : 'offline'
        ) +
        '">' +
        (
          online
            ? '● Online'
            : '● Offline'
        ) +
        '</span>' +
      '</div>' +
      '<div class="runtime-body">' +
        '<div class="runtime-main">' +
          '<div class="runtime-icon">⚙️</div>' +
          '<div>' +
            '<div class="runtime-name">' +
              esc(
                runtime.runtime ||
                'HTTP Application'
              ) +
            '</div>' +
            '<div class="runtime-url">' +
              esc(
                runtime.url ||
                ''
              ) +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="runtime-grid">' +
          '<div class="runtime-field">' +
            '<div class="runtime-label">Runtime</div>' +
            '<div class="runtime-value">' +
              esc(
                runtime.runtime ||
                'HTTP Application'
              ) +
            '</div>' +
          '</div>' +
          '<div class="runtime-field">' +
            '<div class="runtime-label">Port</div>' +
            '<div class="runtime-value">' +
              esc(
                String(
                  runtime.port ||
                  extractPort(
                    runtime.url
                  ) ||
                  '—'
                )
              ) +
            '</div>' +
          '</div>' +
          '<div class="runtime-field">' +
            '<div class="runtime-label">HTTP Status</div>' +
            '<div class="runtime-value">' +
              esc(
                String(
                  runtime.statusCode ||
                  (
                    online
                      ? 'Online'
                      : 'Offline'
                  )
                )
              ) +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="runtime-actions">' +
          '<button class="btn btn-primary" onclick="openRuntime()">' +
            '↗ Open Runtime' +
          '</button>' +
          '<button class="btn btn-outline" onclick="redetectRuntime()">' +
            '⟳ Re-detect' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</div>'
  );
}
function redetectRuntime() {
  vscode.postMessage({
    type:
      'detectRuntime'
  });
}
function openRuntime() {
  vscode.postMessage({
    type:
      'openRuntime'
  });
}
function extractPort(
  url
) {
  if (!url) {
    return null;
  }
  try {
    const parsed =
      new URL(url);
    if (parsed.port) {
      return Number(
        parsed.port
      );
    }
    return parsed.protocol ===
      'https:'
      ? 443
      : 80;
  } catch {
    return null;
  }
}
function inferRuntime(
  url
) {
  return 'HTTP Application';
}`;
}
