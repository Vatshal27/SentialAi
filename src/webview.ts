import { getWebviewStyles } from './webview/styles';
import { getWebviewBody } from './webview/body';
import { getWebviewScriptCore } from './webview/script-core';
import { getWebviewScriptTheme } from './webview/script-theme';
import { getWebviewScriptResults } from './webview/script-results';
import { getWebviewScriptRuntime } from './webview/script-runtime';
import { getWebviewScriptScan } from './webview/script-scan';
import { getWebviewScriptInteractions } from './webview/script-interactions';
import { getWebviewScriptValidation } from './webview/script-validation';
import { getWebviewScriptSandbox } from './webview/script-sandbox';
import { getWebviewScriptHelpers } from './webview/script-helpers';
export function getWebviewHtml(): string {
  const script=[
    getWebviewScriptCore(),
    getWebviewScriptTheme(),
    getWebviewScriptResults(),
    getWebviewScriptRuntime(),
    getWebviewScriptScan(),
    getWebviewScriptInteractions(),
    getWebviewScriptValidation(),
    getWebviewScriptSandbox(),
    getWebviewScriptHelpers()
  ].join('\n');
  return `<!DOCTYPE html>
<html lang="en" data-sentinel-theme="dark">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>SentinelAI</title>
<style>${getWebviewStyles()}</style>
</head>
<body>
${getWebviewBody()}
<script>${script}</script>
</body>
</html>`;
}
