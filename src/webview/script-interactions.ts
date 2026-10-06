export function getWebviewScriptInteractions(): string {
  return `/* Card interactions */
function toggleCard(i) {
  const elem =
    document.getElementById(
      'card-' + i
    );
  if (elem) {
    elem.classList.toggle(
      'open'
    );
  }
}
function toggleConfirmBox(i) {
  const elem =
    document.getElementById(
      'confirm-box-' + i
    );
  if (elem) {
    elem.classList.toggle(
      'open'
    );
  }
}
function applyFix(i) {
  const finding =
    lastFindings[i];
  if (!finding) {
    return;
  }
  const confirmElem =
    document.getElementById(
      'confirm-box-' + i
    );
  if (confirmElem) {
    confirmElem.innerHTML =
      '<div style="display:flex;align-items:center;gap:8px">' +
      '<span class="spin" style="font-size:14px">&#x27F3;</span>' +
      '<span style="font-size:11px">Applying fix...</span>' +
      '</div>';
    confirmElem.classList.add(
      'open'
    );
  }
  vscode.postMessage({
    type:
      'applyFix',
    finding
  });
}
function openDiffInEditor(i) {
  const finding =
    lastFindings[i];
  if (!finding) {
    return;
  }
  vscode.postMessage({
    type:
      'openDiff',
    finding
  });
}
function reviewAllFixes() {
  if (!lastFindings || lastFindings.length===0) {
    return;
  }
  const existing=document.getElementById('fix-review-panel');
  if (existing) {
    existing.remove();
    return;
  }
  let html='<div id="fix-review-panel" class="review-panel">';
  html+='<div class="review-header"><div><div class="review-title">🔎 Recommended Fixes</div><div class="review-subtitle">'+esc(lastFindings.length)+' issue(s) detected. Review only; no workspace files are changed.</div></div><button class="btn btn-outline" style="font-size:10px" onclick="closeFixReview()">Close</button></div>';
  lastFindings.forEach((finding,index)=>{
    const title=finding.type||'Security Issue';
    const severity=finding.severity||'Unknown';
    const file=finding.file||'Unknown file';
    const line=finding.line||'';
    const explanation=finding.explanation||finding.message||'No explanation was provided for this finding.';
    const fix=finding.fix||finding.remediation||finding.recommendation||'Review this finding and apply an appropriate secure coding change.';
    html+='<div class="review-item"><div class="review-item-head"><span class="badge '+esc(severity)+'">'+esc(severity)+'</span><span class="review-item-title">'+esc((index+1)+'. '+title)+'</span></div><div class="review-location">'+esc(file)+(line?' : L'+esc(line):'')+'</div><div class="label">Why this is an issue</div><p class="review-text">'+esc(explanation)+'</p><div class="label">Recommended fix</div><div class="fix-box">'+esc(fix)+'</div>';
    if (finding.fixedCode) {
      html+='<div class="label">Secure Code Example</div><div class="code-block" style="border-left:3px solid #23d18b">'+esc(finding.fixedCode)+'</div>';
    }
    html+='<div class="review-actions"><button class="btn btn-outline copy-review-btn" data-review-index="'+index+'">Copy Recommendation</button></div></div>';
    finding.__reviewCopyText='Issue: '+title+'\\\\nSeverity: '+severity+'\\\\nFile: '+file+(line?' : L'+line:'')+'\\\\n\\\\nWhy this is an issue:\\\\n'+explanation+'\\\\n\\\\nRecommended fix:\\\\n'+fix;
  });
  html+='</div>';
  const summary=root.querySelector('.summary');
  if (summary) {
    summary.insertAdjacentHTML('afterend',html);
  } else {
    root.insertAdjacentHTML('afterbegin',html);
  }
  const panel=document.getElementById('fix-review-panel');
  if (panel) {
    panel.scrollIntoView({behavior:'smooth',block:'start'});
  }
}
function closeFixReview() {
  const panel=document.getElementById('fix-review-panel');
  if (panel) {
    panel.remove();
  }
}
document.addEventListener('click',event=>{
  const button=event.target.closest('.copy-review-btn');
  if (!button) {
    return;
  }
  const index=Number(button.getAttribute('data-review-index'));
  const finding=lastFindings[index];
  if (!finding || !finding.__reviewCopyText) {
    return;
  }
  navigator.clipboard.writeText(finding.__reviewCopyText).then(()=>{
    const original=button.innerText;
    button.innerText='Copied!';
    setTimeout(()=>{button.innerText=original;},1500);
  }).catch(error=>console.error('Clipboard copy failed:',error));
});`;
}
