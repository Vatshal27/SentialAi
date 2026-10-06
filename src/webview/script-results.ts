export function getWebviewScriptResults(): string {
  return `/* Results */
function renderResults(findings,filesScanned) {
  const safeFindings=Array.isArray(findings)?findings:[];
  let html='';
  if (selectedRuntime) {
    html+=buildRuntimeCard(selectedRuntime);
  }
  const high=safeFindings.filter(f=>f.severity==='High').length;
  const medium=safeFindings.filter(f=>f.severity==='Medium').length;
  const low=safeFindings.filter(f=>f.severity==='Low').length;
  html+='<div class="summary">';
  html+='<span class="meta" style="margin:0;margin-right:8px">Scanned '+filesScanned+' file(s) — '+safeFindings.length+' issue(s)</span>';
  if (high) {
    html+='<span class="pill High">'+high+' High</span>';
  }
  if (medium) {
    html+='<span class="pill Medium">'+medium+' Medium</span>';
  }
  if (low) {
    html+='<span class="pill Low">'+low+' Low</span>';
  }
  if (safeFindings.length===0) {
    html+='<button class="btn btn-success" style="margin-left:auto;font-size:10px" onclick="showEmptyFixReview()">🔎 Review All Fixes</button>';
  } else {
    html+='<button class="btn btn-success" style="margin-left:auto;font-size:10px" onclick="reviewAllFixes()">🔎 Review All Fixes</button>';
  }
  html+='<button class="btn btn-danger" style="font-size:10px" onclick="showConsentBox()">🐳 Runtime Security Scan</button>';
  html+='</div>';
  if (safeFindings.length===0) {
    html+='<div class="clean">✓ No static or AI findings detected. Runtime security analysis may still discover exposed endpoints, sensitive data leakage, authentication problems, unsafe services, or exploitable runtime behavior.</div>';
    root.innerHTML=html;
    sandboxRoot.innerHTML='';
    return;
  }
  safeFindings.forEach((f,i)=>{
    const severity=f.severity||'Low';
    const type=f.type||'Security Issue';
    const file=f.file||'Unknown';
    const explanation=f.explanation||'Security issue detected.';
    const fix=f.fix||'Review the affected code and apply appropriate security controls.';
    html+='<div class="card">';
    html+='<div class="card-head" onclick="toggleCard('+i+')">';
    html+='<span class="badge '+esc(severity)+'">'+esc(severity)+'</span>';
    html+='<span class="card-title">'+esc(type);
    if (f.attackType) {
      html+='<span class="attack-type-badge">'+esc(f.attackType)+'</span>';
    }
    html+='</span>';
    html+='<span class="card-file">'+esc(file)+(f.line?' : L'+esc(f.line):'')+'</span>';
    html+='</div>';
    html+='<div class="card-body" id="card-'+i+'">';
    html+='<div class="label">Vulnerability Root Cause</div>';
    html+='<p>'+esc(explanation)+'</p>';
    if (f.vulnerableCode) {
      html+='<div class="label">Vulnerable Code Context</div>';
      html+='<div class="code-block">'+esc(f.vulnerableCode)+'</div>';
    }
    if (f.attackStory&&f.attackStory.length) {
      html+='<div class="label">Attacker Exploitation Steps</div>';
      f.attackStory.forEach((step,si)=>{
        html+='<div class="step">';
        html+='<span class="step-n">'+(si+1)+'</span>';
        html+='<span>'+esc(step)+'</span>';
        html+='</div>';
      });
    }
    if (f.attackPayloads&&f.attackPayloads.length) {
      html+='<div class="attack-section">';
      html+='<div class="attack-section-title">🔥 Targeted Exploit Payloads</div>';
      f.attackPayloads.forEach(payload=>{
        html+='<div class="payload-item">';
        html+='<div class="payload-box">';
        html+='<span class="payload-text"><code>'+esc(payload)+'</code></span>';
        html+='<button class="copy-btn" data-copy="'+esc(payload)+'">Copy</button>';
        html+='</div>';
        html+='</div>';
      });
      html+='</div>';
    }
    if (f.attackScript) {
      html+='<div class="attack-section">';
      html+='<div class="attack-section-title">📱 Proof-of-Concept Exploit Script</div>';
      html+='<div class="payload-box">';
      html+='<span class="payload-text"><code>'+esc(f.attackScript)+'</code></span>';
      html+='<button class="copy-btn" data-copy="'+esc(f.attackScript)+'">Copy</button>';
      html+='</div>';
      html+='</div>';
    }
    html+='<div class="label">Remediation & Fix</div>';
    html+='<div class="fix-box">'+esc(fix)+'</div>';
    if (f.fixedCode) {
      html+='<div class="label">Secure Code Example</div>';
      html+='<div class="code-block" style="border-left:3px solid #23d18b">'+esc(f.fixedCode)+'</div>';
    }
    if (f.fixedCode||f.vulnerableCode) {
      html+='<div class="diff-section">';
      html+='<div class="diff-header">📝 Proposed Code Changes</div>';
      html+='<div class="diff-block">';
      if (f.vulnerableCode) {
        f.vulnerableCode.split('\\n').forEach(line=>{
          html+='<div class="diff-line diff-del">';
          html+='<span class="diff-line-num">-</span>';
          html+='<span>'+esc(line)+'</span>';
          html+='</div>';
        });
      }
      if (f.fixedCode) {
        f.fixedCode.split('\\n').forEach(line=>{
          html+='<div class="diff-line diff-add">';
          html+='<span class="diff-line-num">+</span>';
          html+='<span>'+esc(line)+'</span>';
          html+='</div>';
        });
      }
      html+='</div>';
      html+='<div class="diff-actions" id="diff-actions-'+i+'">';
      if (f.applied) {
        html+='<span class="applied-badge">✅ Fix Applied to '+esc(file)+'</span>';
      } else {
        html+='<button class="btn btn-success" onclick="toggleConfirmBox('+i+')">⚡ Apply Changes to Code</button>';
      }
      html+='<button class="btn btn-outline" onclick="openDiffInEditor('+i+')">👁️ View Side-by-Side in Editor</button>';
      html+='</div>';
      html+='<div class="confirm-box" id="confirm-box-'+i+'">';
      html+='<div class="confirm-title">❓ Apply these secure changes to your workspace file?</div>';
      html+='<p style="margin-bottom:10px;font-size:11px">This will update <b>'+esc(file)+'</b>'+(f.line?' at Line '+esc(f.line):'')+' with the secure code above.</p>';
      html+='<div style="display:flex;gap:8px">';
      html+='<button class="btn btn-success" onclick="applyFix('+i+')">✅ Yes, Apply Fix</button>';
      html+='<button class="btn btn-secondary" onclick="toggleConfirmBox('+i+')">Cancel</button>';
      html+='</div>';
      html+='</div>';
      html+='</div>';
    }
    html+='</div>';
    html+='</div>';
  });
  root.innerHTML=html;
}
function showEmptyFixReview() {
  const existing=document.getElementById('fix-review-panel');
  if (existing) {
    existing.remove();
    return;
  }
  const reviewHtml=
    '<div id="fix-review-panel" class="review-panel">'+
      '<div class="review-header">'+
        '<div>'+
          '<div class="review-title">🔎 Recommended Fixes</div>'+
          '<div class="review-subtitle">0 issue(s) currently require code remediation.</div>'+
        '</div>'+
        '<button class="btn btn-outline" style="font-size:10px" onclick="closeFixReview()">Close</button>'+
      '</div>'+
      '<div class="clean">'+
        'No static or AI fix recommendations are currently available. This does not mean the runtime is secure. Run Runtime Security Scan to inspect the active application for exposed endpoints, data leakage, authentication problems, unsafe services, and exploitable behavior.'+
      '</div>'+
    '</div>';
  const summary=root.querySelector('.summary');
  if (summary) {
    summary.insertAdjacentHTML('afterend',reviewHtml);
  } else {
    root.insertAdjacentHTML('afterbegin',reviewHtml);
  }
  const panel=document.getElementById('fix-review-panel');
  if (panel) {
    panel.scrollIntoView({
      behavior:'smooth',
      block:'start'
    });
  }
}`;
}