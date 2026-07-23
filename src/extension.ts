import * as vscode from 'vscode';

import {
  analyzeProject,
  checkBackend,
  checkSandbox,
  collectWorkspaceFiles,
  isSupportedDocument,
  runSandbox,
  stopSandbox,
} from './services';

import {
  Finding,
  SandboxReport,
} from './types';

import { getWebviewHtml } from './webview';

export async function activate(
  context: vscode.ExtensionContext
): Promise<void> {
  let panel: vscode.WebviewPanel | null = null;

  const statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );

  statusBar.text = '$(shield) SentinelAI';
  statusBar.tooltip = 'Click to open security report';
  statusBar.command = 'sentinelai.openPanel';
  statusBar.show();

  context.subscriptions.push(statusBar);

  function getPanel(): vscode.WebviewPanel {
    if (!panel) {
      panel = vscode.window.createWebviewPanel(
        'sentinelai',
        'SentinelAI — Security Report',
        vscode.ViewColumn.Beside,
        {
          enableScripts: true,
        }
      );

      panel.webview.html = getWebviewHtml();

      panel.onDidDispose(() => {
        panel = null;
      });

      panel.webview.onDidReceiveMessage(async message => {
        if (!panel) {
          return;
        }

        if (message.type === 'runSandbox') {
          await runSandboxAttack(
            panel,
            statusBar,
            message.findings
          );
        }

        if (message.type === 'stopSandbox') {
          try {
            await stopSandbox();
          } catch {
            // Preserve the existing silent failure behavior.
          }
        }
      });
    } else {
      panel.reveal();
    }

    return panel;
  }

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'sentinelai.openPanel',
      () => {
        getPanel();
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'sentinelai.scan',
      async () => {
        await scanWorkspace(
          getPanel(),
          statusBar
        );
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'sentinelai.sandbox',
      () => {
        const currentPanel = getPanel();

        currentPanel.webview.postMessage({
          type: 'showConsent',
        });
      }
    )
  );

  if (vscode.workspace.workspaceFolders) {
    const answer = await vscode.window.showInformationMessage(
      '🛡 SentinelAI: Scan this project for security vulnerabilities?',
      'Yes, scan now',
      'Not now'
    );

    if (answer === 'Yes, scan now') {
      await scanWorkspace(
        getPanel(),
        statusBar
      );
    }
  }

  context.subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders(async () => {
      if (!vscode.workspace.workspaceFolders) {
        return;
      }

      const answer = await vscode.window.showInformationMessage(
        '🛡 SentinelAI: New folder detected. Scan for security vulnerabilities?',
        'Yes, scan now',
        'Not now'
      );

      if (answer === 'Yes, scan now') {
        await scanWorkspace(
          getPanel(),
          statusBar
        );
      }
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument(async document => {
      if (!isSupportedDocument(document)) {
        return;
      }

      await scanWorkspace(
        getPanel(),
        statusBar
      );
    })
  );
}

async function scanWorkspace(
  panel: vscode.WebviewPanel,
  statusBar: vscode.StatusBarItem
): Promise<void> {
  statusBar.text =
    '$(sync~spin) SentinelAI: Scanning...';

  panel.webview.postMessage({
    type: 'scanning',
  });

  try {
    await checkBackend();
  } catch {
    statusBar.text = '$(shield) SentinelAI';

    panel.webview.postMessage({
      type: 'error',
      message:
        'Backend not running. Open a terminal in the BACKEND folder and run: node server.js',
    });

    return;
  }

  let files;

  try {
    files = await collectWorkspaceFiles();
  } catch (error: unknown) {
    statusBar.text = '$(shield) SentinelAI';

    const message =
      error instanceof Error
        ? error.message
        : 'Unknown file-reading error';

    panel.webview.postMessage({
      type: 'error',
      message: `Could not read workspace files: ${message}`,
    });

    return;
  }

  if (files.length === 0) {
    statusBar.text = '$(shield) SentinelAI';

    panel.webview.postMessage({
      type: 'noFiles',
    });

    return;
  }

  try {
    const response = await analyzeProject(files);

    const {
      findings,
      filesScanned,
    } = response;

    statusBar.text =
      findings.length > 0
        ? `$(warning) SentinelAI: ${findings.length} issue${
            findings.length > 1 ? 's' : ''
          }`
        : '$(check) SentinelAI: Clean';

    panel.webview.postMessage({
      type: 'results',
      findings,
      filesScanned,
      fileNames: files.map((file: { path: any; }) => file.path),
    });
  } catch (error: unknown) {
    statusBar.text = '$(shield) SentinelAI';

    const message =
      error instanceof Error
        ? error.message
        : 'Unknown analysis error';

    panel.webview.postMessage({
      type: 'error',
      message: `Analysis failed: ${message}`,
    });
  }
}

async function runSandboxAttack(
  panel: vscode.WebviewPanel,
  statusBar: vscode.StatusBarItem,
  findings: Finding[]
): Promise<void> {
  try {
    await checkSandbox();
  } catch (error: any) {
    panel.webview.postMessage({
      type: 'sandboxError',
      message:
        error.response?.data?.error ||
        'Docker not available. Install Docker Desktop and ensure it is running.',
    });

    return;
  }

  statusBar.text =
    '$(debug-alt) SentinelAI: Attack running...';

  panel.webview.postMessage({
    type: 'sandboxStarted',
  });

  try {
    const report: SandboxReport =
      await runSandbox(findings);

    statusBar.text =
      `$(warning) SentinelAI: ${findings.length} issues`;

    panel.webview.postMessage({
      type: 'sandboxResults',
      report,
    });
  } catch (error: any) {
    statusBar.text =
      `$(warning) SentinelAI: ${findings.length} issues`;

    panel.webview.postMessage({
      type: 'sandboxError',
      message: `Attack demo failed: ${error.message}`,
    });
  }
}

export function deactivate(): void {}