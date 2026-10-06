export function getWebviewStyles(): string {
  return `*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:var(--vscode-editor-background);color:var(--vscode-editor-foreground);padding:16px;font-size:13px;line-height:1.5;}
.header-bar{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--vscode-panel-border);}
.header-title{display:flex;align-items:center;gap:8px;}
.header-title h1{font-size:16px;font-weight:700;}
.sub{color:var(--vscode-descriptionForeground);font-size:11px;margin-top:2px;}
.btn{padding:6px 14px;border-radius:4px;border:none;font-size:11px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all .15s ease;}
.btn-primary{background:var(--vscode-button-background);color:var(--vscode-button-foreground);}
.btn-primary:hover{background:var(--vscode-button-hoverBackground);}
.btn-secondary{background:var(--vscode-button-secondaryBackground,#333);color:var(--vscode-button-secondaryForeground,#ccc);}
.btn-secondary:hover{opacity:.85;}
.btn-danger{background:#f14c4c;color:#fff;}
.btn-danger:hover{background:#d33838;}
.btn-success{background:#23d18b;color:#111;font-weight:700;}
.btn-success:hover{background:#1eb879;}
.btn-outline{background:transparent;border:1px solid var(--vscode-panel-border);color:var(--vscode-editor-foreground);}
.btn-outline:hover{background:var(--vscode-list-hoverBackground);}
.state{padding:32px 20px;text-align:center;border:1px dashed var(--vscode-panel-border);border-radius:8px;color:var(--vscode-descriptionForeground);background:var(--vscode-editor-inactiveSelectionBackground);}
.spin{display:inline-block;animation:spin 1s linear infinite;}
@keyframes spin{to{transform:rotate(360deg);}}
/* Runtime */
.runtime-card{border:1px solid var(--vscode-panel-border);border-radius:8px;margin-bottom:16px;overflow:hidden;background:var(--vscode-editor-background);}
.runtime-header{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--vscode-editor-inactiveSelectionBackground);border-bottom:1px solid var(--vscode-panel-border);}
.runtime-title{display:flex;align-items:center;gap:8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;}
.runtime-body{padding:14px;}
.runtime-main{display:flex;align-items:center;gap:10px;margin-bottom:14px;}
.runtime-icon{width:36px;height:36px;border-radius:7px;display:flex;align-items:center;justify-content:center;background:rgba(55,148,255,.12);border:1px solid rgba(55,148,255,.3);font-size:17px;}
.runtime-name{font-size:14px;font-weight:700;}
.runtime-url{font-family:Consolas,Monaco,monospace;font-size:11px;color:var(--vscode-descriptionForeground);margin-top:2px;word-break:break-all;}
.runtime-status{margin-left:auto;font-size:9px;font-weight:700;padding:3px 8px;border-radius:10px;text-transform:uppercase;}
.runtime-status.online{color:#23d18b;background:rgba(35,209,139,.12);border:1px solid rgba(35,209,139,.35);}
.runtime-status.offline{color:#f14c4c;background:rgba(241,76,76,.12);border:1px solid rgba(241,76,76,.35);}
.runtime-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px;}
.runtime-field{padding:8px 10px;border:1px solid var(--vscode-panel-border);border-radius:5px;background:rgba(0,0,0,.08);}
.runtime-label{font-size:9px;text-transform:uppercase;letter-spacing:.6px;color:var(--vscode-descriptionForeground);font-weight:700;margin-bottom:2px;}
.runtime-value{font-family:monospace;font-size:11px;font-weight:600;}
.runtime-actions{display:flex;gap:8px;flex-wrap:wrap;}
/* Summary */
.summary{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;align-items:center;}
.pill{padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:.3px;}
.pill.High{background:rgba(241,76,76,.15);color:#f14c4c;border:1px solid rgba(241,76,76,.4);}
.pill.Medium{background:rgba(204,167,0,.15);color:#cca700;border:1px solid rgba(204,167,0,.4);}
.pill.Low{background:rgba(55,148,255,.15);color:#3794ff;border:1px solid rgba(55,148,255,.4);}
/* Finding cards */
.card{border:1px solid var(--vscode-panel-border);border-radius:6px;margin-bottom:12px;overflow:hidden;background:var(--vscode-editor-background);}
.card-head{display:flex;align-items:center;gap:10px;padding:10px 14px;cursor:pointer;user-select:none;background:var(--vscode-editor-inactiveSelectionBackground);}
.card-head:hover{background:var(--vscode-list-hoverBackground);}
.badge{font-size:10px;font-weight:700;padding:2px 7px;border-radius:3px;text-transform:uppercase;letter-spacing:.4px;}
.badge.High{background:rgba(241,76,76,.2);color:#f14c4c;border:1px solid rgba(241,76,76,.4);}
.badge.Medium{background:rgba(204,167,0,.2);color:#cca700;border:1px solid rgba(204,167,0,.4);}
.badge.Low{background:rgba(55,148,255,.2);color:#3794ff;border:1px solid rgba(55,148,255,.4);}
.card-title{font-weight:600;flex:1;font-size:13px;display:flex;align-items:center;gap:8px;}
.card-file{font-size:11px;color:var(--vscode-descriptionForeground);font-family:monospace;}
.card-body{padding:14px;display:none;border-top:1px solid var(--vscode-panel-border);}
.card-body.open{display:block;}
.label{font-size:10px;text-transform:uppercase;letter-spacing:.7px;font-weight:700;color:var(--vscode-descriptionForeground);margin:14px 0 6px;}
.label:first-child{margin-top:0;}
.code-block{font-family:Consolas,Monaco,'Courier New',monospace;font-size:11px;background:rgba(0,0,0,.25);padding:10px;border-radius:4px;border:1px solid var(--vscode-panel-border);white-space:pre-wrap;word-break:break-all;margin-top:4px;max-height:220px;overflow-y:auto;line-height:1.4;}
.step{display:flex;gap:10px;margin-bottom:6px;align-items:flex-start;}
.step-n{width:18px;height:18px;border-radius:50%;flex-shrink:0;background:rgba(241,76,76,.2);color:#f14c4c;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-top:2px;}
.fix-box{background:var(--vscode-textBlockQuote-background);border-left:3px solid #3794ff;border-radius:0 4px 4px 0;padding:10px 12px;font-size:12px;}
.clean{padding:24px;border:1px solid rgba(35,209,139,.4);border-radius:8px;background:rgba(35,209,139,.1);color:#23d18b;text-align:center;font-weight:500;}
.meta{color:var(--vscode-descriptionForeground);font-size:11px;margin-bottom:12px;}
/* Diff */
.diff-section{margin-top:14px;padding:14px;background:rgba(0,0,0,.15);border-radius:6px;border:1px solid var(--vscode-panel-border);}
.diff-header{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:#3794ff;margin-bottom:10px;}
.diff-block{font-family:Consolas,Monaco,'Courier New',monospace;font-size:11px;border-radius:4px;overflow:hidden;border:1px solid var(--vscode-panel-border);max-height:260px;overflow-y:auto;}
.diff-line{padding:3px 10px;white-space:pre-wrap;word-break:break-all;line-height:1.4;display:flex;gap:10px;}
.diff-line-num{color:var(--vscode-descriptionForeground);user-select:none;min-width:16px;text-align:right;font-weight:700;}
.diff-del{background:rgba(241,76,76,.12);color:#f14c4c;border-left:3px solid #f14c4c;}
.diff-add{background:rgba(35,209,139,.12);color:#23d18b;border-left:3px solid #23d18b;}
.diff-actions{display:flex;gap:10px;margin-top:12px;flex-wrap:wrap;align-items:center;}
.confirm-box{margin-top:12px;padding:12px 14px;background:rgba(204,167,0,.08);border:1px solid rgba(204,167,0,.4);border-radius:6px;display:none;}
.confirm-box.open{display:block;}
.confirm-title{font-weight:700;font-size:12px;color:#cca700;margin-bottom:6px;}
.applied-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(35,209,139,.18);color:#23d18b;border:1px solid rgba(35,209,139,.4);padding:5px 12px;border-radius:6px;font-size:11px;font-weight:700;}
/* Scan */
.scan-progress{text-align:left;padding:20px;border:1px solid #3794ff;background:rgba(55,148,255,.06);border-radius:8px;}
.scan-progress-header{display:flex;align-items:center;gap:12px;margin-bottom:16px;}
.scan-step{display:flex;align-items:center;gap:12px;font-size:12px;padding:10px 14px;border-radius:6px;margin-bottom:6px;border:1px solid transparent;}
.scan-step.active{background:rgba(55,148,255,.12);border-color:#3794ff;}
.scan-step.done{background:rgba(35,209,139,.08);}
.scan-step.queued{opacity:.5;}
.scan-step-label{font-weight:700;flex:1;}
.scan-step-status{font-size:10px;font-weight:700;}
/* Attack */
.attack-section{margin-top:12px;padding:12px;background:var(--vscode-textBlockQuote-background);border-radius:6px;border-left:3px solid #f14c4c;}
.attack-section-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.7px;margin-bottom:8px;color:#f14c4c;display:flex;align-items:center;gap:6px;}
.payload-item{margin-bottom:8px;}
.payload-box{font-family:Consolas,Monaco,monospace;font-size:11px;background:rgba(0,0,0,.3);padding:6px 10px;border-radius:4px;display:flex;justify-content:space-between;align-items:center;gap:10px;border:1px solid rgba(255,255,255,.05);}
.payload-text{flex:1;word-break:break-all;}
.copy-btn{background:var(--vscode-button-secondaryBackground,#333);color:var(--vscode-button-secondaryForeground,#ccc);border:none;padding:3px 8px;border-radius:3px;font-size:10px;cursor:pointer;font-weight:600;flex-shrink:0;}
.copy-btn:hover{background:var(--vscode-button-hoverBackground);}
.attack-type-badge{display:inline-block;padding:2px 6px;border-radius:3px;font-size:9px;font-weight:700;text-transform:uppercase;background:rgba(241,76,76,.2);color:#f14c4c;margin-left:6px;}
/* Consent */
.consent{padding:18px;border:1px solid rgba(204,167,0,.4);border-radius:8px;background:rgba(204,167,0,.08);margin-bottom:16px;}
.consent-title{font-weight:700;font-size:13px;margin-bottom:8px;color:#cca700;display:flex;align-items:center;gap:6px;}
.mode-selection{margin:12px 0;padding:12px;background:var(--vscode-editor-background);border-radius:6px;border:1px solid var(--vscode-panel-border);}
.mode-options{display:flex;gap:10px;flex-wrap:wrap;}
.mode-option{flex:1;min-width:160px;}
.mode-option input{display:none;}
.mode-option label{display:block;padding:10px;background:var(--vscode-button-secondaryBackground);color:var(--vscode-button-secondaryForeground);border:2px solid transparent;border-radius:6px;cursor:pointer;font-size:11px;text-align:center;}
.mode-option input:checked + label{border-color:#3794ff;background:rgba(55,148,255,.12);color:#3794ff;font-weight:700;}
/* Runtime browser */
.mock-browser{border:1px solid var(--vscode-panel-border);border-radius:8px;overflow:hidden;margin-top:14px;background:#1e1e1e;box-shadow:0 4px 16px rgba(0,0,0,.3);}
.mock-browser-bar{background:#2d2d2d;padding:8px 12px;display:flex;align-items:center;gap:12px;border-bottom:1px solid #3c3c3c;}
.mock-dots{display:flex;gap:6px;}
.mock-dot{width:10px;height:10px;border-radius:50%;}
.mock-dot.r{background:#ff5f56;}
.mock-dot.y{background:#ffbd2e;}
.mock-dot.g{background:#27c93f;}
.mock-url{flex:1;background:#1e1e1e;color:#ccc;font-family:monospace;font-size:11px;padding:4px 10px;border-radius:4px;border:1px solid #3c3c3c;display:flex;align-items:center;gap:6px;min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}
.status-pill{font-size:9px;font-weight:700;padding:2px 8px;border-radius:10px;text-transform:uppercase;}
.status-pill.green{background:rgba(39,201,63,.2);color:#27c93f;border:1px solid rgba(39,201,63,.4);}
.status-pill.red{background:rgba(255,95,86,.2);color:#ff5f56;border:1px solid rgba(255,95,86,.4);}
.mock-viewport{padding:16px;background:#181818;min-height:130px;color:#eee;}
.mock-app-header{border-bottom:1px solid #333;padding-bottom:10px;margin-bottom:12px;}
.mock-app-header h2{font-size:14px;color:#3794ff;display:flex;align-items:center;gap:6px;}
.runtime-target-info{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.runtime-target-box{padding:10px;border:1px solid #333;border-radius:5px;background:#202020;}
.runtime-target-box .small-label{font-size:9px;text-transform:uppercase;color:#888;letter-spacing:.5px;}
.runtime-target-box .small-value{font-family:monospace;font-size:11px;margin-top:2px;}
/* Timeline */
.timeline{margin-top:14px;}
.log-entry{padding:10px 12px;margin-bottom:6px;border-radius:6px;background:var(--vscode-editor-inactiveSelectionBackground);border-left:3px solid #666;font-size:11px;}
.log-entry.s1,.log-entry.s2{border-left-color:#3794ff;}
.log-entry.s3{border-left-color:#cca700;}
.log-entry.s4,.log-entry.s5{border-left-color:#23d18b;}
.log-title{font-weight:700;font-size:11px;}
/* Attack results */
.attack-card{border:1px solid var(--vscode-panel-border);border-radius:6px;margin-bottom:8px;padding:12px;background:var(--vscode-editor-background);}
.attack-card.success{border-left:4px solid #f14c4c;}
.attack-card.inconclusive{border-left:4px solid #cca700;}
.attack-card.not-reproduced{border-left:4px solid #23d18b;}
.attack-tool{font-weight:700;font-size:12px;margin-bottom:4px;display:flex;align-items:center;gap:6px;}
.attack-evidence{font-size:11px;color:var(--vscode-descriptionForeground);margin-top:6px;}
.attack-payload-badge{font-family:monospace;font-size:10px;background:rgba(0,0,0,.25);padding:3px 6px;border-radius:3px;margin-top:4px;display:inline-block;word-break:break-all;}
.evidence-box{margin-top:8px;padding:8px;border-radius:4px;background:rgba(0,0,0,.2);border:1px solid var(--vscode-panel-border);}
.evidence-title{font-size:9px;text-transform:uppercase;font-weight:700;color:var(--vscode-descriptionForeground);margin-bottom:4px;}
.evidence-content{font-family:monospace;font-size:10px;white-space:pre-wrap;word-break:break-all;max-height:150px;overflow:auto;}
/* Validation summary */
.validation-summary{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:12px;}
.validation-stat{padding:10px;border:1px solid var(--vscode-panel-border);border-radius:5px;text-align:center;}
.validation-stat-value{font-size:16px;font-weight:700;}
.validation-stat-label{font-size:9px;color:var(--vscode-descriptionForeground);text-transform:uppercase;margin-top:2px;}
/* Theme controls */
.header-actions{display:flex;align-items:center;gap:8px;}
body[data-sentinel-theme="dark"]{color-scheme:dark;background:#0d1117!important;color:#e6edf3!important;--vscode-editor-background:#0d1117!important;--vscode-editor-foreground:#e6edf3!important;--vscode-panel-border:#30363d!important;--vscode-descriptionForeground:#8b949e!important;--vscode-editor-inactiveSelectionBackground:#161b22!important;--vscode-button-background:#0e639c!important;--vscode-button-foreground:#ffffff!important;--vscode-button-hoverBackground:#1177bb!important;--vscode-button-secondaryBackground:#21262d!important;--vscode-button-secondaryForeground:#c9d1d9!important;--vscode-list-hoverBackground:#21262d!important;--vscode-textBlockQuote-background:#161b22!important;}
body[data-sentinel-theme="dark"] .runtime-field{background:rgba(255,255,255,.03);}
body[data-sentinel-theme="dark"] .diff-section{background:rgba(0,0,0,.15);}
body[data-sentinel-theme="dark"] .code-block{background:rgba(0,0,0,.25);}
body[data-sentinel-theme="dark"] .payload-box{background:rgba(0,0,0,.3);}
body[data-sentinel-theme="dark"] .evidence-box{background:rgba(0,0,0,.2);}
body[data-sentinel-theme="light"]{color-scheme:light;background:#ffffff!important;color:#24292f!important;--vscode-editor-background:#ffffff!important;--vscode-editor-foreground:#24292f!important;--vscode-panel-border:#d0d7de!important;--vscode-descriptionForeground:#57606a!important;--vscode-editor-inactiveSelectionBackground:#f6f8fa!important;--vscode-button-background:#0969da!important;--vscode-button-foreground:#ffffff!important;--vscode-button-hoverBackground:#0860ca!important;--vscode-button-secondaryBackground:#f6f8fa!important;--vscode-button-secondaryForeground:#24292f!important;--vscode-list-hoverBackground:#f3f4f6!important;--vscode-textBlockQuote-background:#f6f8fa!important;}
body[data-sentinel-theme="light"] .header-bar{border-bottom-color:#d0d7de;}
body[data-sentinel-theme="light"] .state{background:#f6f8fa;color:#57606a;border-color:#d0d7de;}
body[data-sentinel-theme="light"] .runtime-card{background:#ffffff;border-color:#d0d7de;}
body[data-sentinel-theme="light"] .runtime-header{background:#f6f8fa;border-bottom-color:#d0d7de;}
body[data-sentinel-theme="light"] .runtime-field{background:#f6f8fa;border-color:#d0d7de;}
body[data-sentinel-theme="light"] .card{background:#ffffff;border-color:#d0d7de;}
body[data-sentinel-theme="light"] .card-head{background:#f6f8fa;}
body[data-sentinel-theme="light"] .card-head:hover{background:#eef1f4;}
body[data-sentinel-theme="light"] .card-body{border-top-color:#d0d7de;}
body[data-sentinel-theme="light"] .code-block{background:#f6f8fa;border-color:#d0d7de;color:#24292f;}
body[data-sentinel-theme="light"] .fix-box{background:#f6f8fa;color:#24292f;}
body[data-sentinel-theme="light"] .diff-section{background:#f6f8fa;border-color:#d0d7de;}
body[data-sentinel-theme="light"] .diff-block{border-color:#d0d7de;}
body[data-sentinel-theme="light"] .confirm-box{background:rgba(204,167,0,.08);}
body[data-sentinel-theme="light"] .scan-progress{background:rgba(9,105,218,.04);}
body[data-sentinel-theme="light"] .scan-step.active{background:rgba(9,105,218,.08);}
body[data-sentinel-theme="light"] .scan-step.done{background:rgba(26,127,55,.08);}
body[data-sentinel-theme="light"] .attack-section{background:#f6f8fa;}
body[data-sentinel-theme="light"] .payload-box{background:#f6f8fa;border-color:#d0d7de;color:#24292f;}
body[data-sentinel-theme="light"] .consent{background:rgba(204,167,0,.06);}
body[data-sentinel-theme="light"] .mode-selection{background:#ffffff;border-color:#d0d7de;}
body[data-sentinel-theme="light"] .mock-browser{background:#ffffff;box-shadow:0 4px 16px rgba(31,35,40,.12);border-color:#d0d7de;}
body[data-sentinel-theme="light"] .mock-browser-bar{background:#f6f8fa;border-bottom-color:#d0d7de;}
body[data-sentinel-theme="light"] .mock-url{background:#ffffff;color:#24292f;border-color:#d0d7de;}
body[data-sentinel-theme="light"] .mock-viewport{background:#ffffff;color:#24292f;}
body[data-sentinel-theme="light"] .mock-app-header{border-bottom-color:#d0d7de;}
body[data-sentinel-theme="light"] .runtime-target-box{background:#f6f8fa;border-color:#d0d7de;}
body[data-sentinel-theme="light"] .runtime-target-box .small-label{color:#57606a;}
body[data-sentinel-theme="light"] .log-entry{background:#f6f8fa;}
body[data-sentinel-theme="light"] .attack-card{background:#ffffff;border-color:#d0d7de;}
body[data-sentinel-theme="light"] .attack-payload-badge{background:#f6f8fa;color:#24292f;}
body[data-sentinel-theme="light"] .evidence-box{background:#f6f8fa;border-color:#d0d7de;}
body[data-sentinel-theme="light"] .validation-stat{background:#ffffff;border-color:#d0d7de;}
body[data-sentinel-theme="light"] .review-panel{background:rgba(9,105,218,.04);border-color:rgba(9,105,218,.35);}
body[data-sentinel-theme="light"] .review-item{background:#ffffff;border-color:#d0d7de;}
.review-panel{margin-bottom:16px;padding:14px;border:1px solid rgba(55,148,255,.45);border-radius:8px;background:rgba(55,148,255,.05);}
.review-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px;}
.review-title{font-size:14px;font-weight:700;}
.review-subtitle{margin-top:3px;font-size:10px;color:var(--vscode-descriptionForeground);}
.review-item{padding:12px;margin-bottom:10px;border:1px solid var(--vscode-panel-border);border-radius:6px;background:var(--vscode-editor-background);}
.review-item:last-child{margin-bottom:0;}
.review-item-head{display:flex;align-items:center;gap:8px;}
.review-item-title{font-size:12px;font-weight:700;}
.review-location{margin-top:4px;font-size:10px;font-family:monospace;color:var(--vscode-descriptionForeground);}
.review-text{font-size:11px;line-height:1.5;}
.review-actions{display:flex;gap:8px;margin-top:10px;}`;
}