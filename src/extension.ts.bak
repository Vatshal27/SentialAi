import * as vscode from 'vscode';

import {
  analyzeProject,
  checkBackend,
  checkSandbox,
  collectWorkspaceFiles,
  isSupportedDocument,
  runSandbox,
  stopSandbox,
  discoverRuntimes,
  checkRuntime,
  RuntimeInfo,
} from './services';

import {
  Finding,
  SandboxMode,
  SandboxReport,
} from './types';

import {
  getWebviewHtml,
} from './webview';

let scanDebounceTimer:
  | ReturnType<typeof setTimeout>
  | null = null;

const DEBOUNCE_MS = 1500;

let cachedResults: {
  findings: Finding[];
  filesScanned: number;
  fileNames: string[];
} | null = null;

let cachedSandboxReport:
  | SandboxReport
  | null = null;

/*
 * Stores the runtime detected by the backend.
 *
 * IMPORTANT:
 * The framework is NOT hard-coded here.
 * The backend runtime detector determines whether
 * the project is Flask, Django, Express, Vite, etc.
 */
let selectedRuntime:
  | RuntimeInfo
  | undefined;

let fixDocCounter = 0;

const fixContentStore =
  new Map<string, string>();

const fixContentProvider:
  vscode.TextDocumentContentProvider = {
    provideTextDocumentContent(
      uri: vscode.Uri
    ): string {
      return (
        fixContentStore.get(
          uri.path
        ) || ''
      );
    },
  };

function createFixUri(
  label: string,
  content: string
): vscode.Uri {
  const key =
    `/fix-${++fixDocCounter}-${label.replace(
      /[^a-zA-Z0-9._-]/g,
      '_'
    )}`;

  fixContentStore.set(
    key,
    content
  );

  return vscode.Uri.parse(
    `sentinelai-fix:${key}`
  );
}

/*
 * Detect the actual project runtime.
 *
 * No framework is preferred or hard-coded here.
 * discoverRuntimes() performs the actual detection.
 */
async function resolveProjectRuntime(): Promise<RuntimeInfo> {
  const runtimes =
    await discoverRuntimes();

  if (!runtimes.length) {
    throw new Error(
      'No local HTTP application was detected. Start your project development server first.'
    );
  }

  /*
   * discoverRuntimes() is responsible for detection
   * and ranking. We simply use its first detected
   * runtime.
   */
  const runtime =
    runtimes[0];

  const checked =
    await checkRuntime(
      runtime.url
    );

  if (!checked.reachable) {
    throw new Error(
      `Detected runtime is not reachable: ${runtime.url}`
    );
  }

  selectedRuntime = {
    ...runtime,
    reachable: true,
    statusCode:
      checked.statusCode,
  };

  return selectedRuntime;
}

async function openProjectRuntime(): Promise<void> {
  const runtime =
    selectedRuntime ||
    await resolveProjectRuntime();

  await vscode.env.openExternal(
    vscode.Uri.parse(
      runtime.url
    )
  );
}

export async function activate(
  context: vscode.ExtensionContext
): Promise<void> {
  let panel:
    | vscode.WebviewPanel
    | null = null;

  context.subscriptions.push(
    vscode.workspace.registerTextDocumentContentProvider(
      'sentinelai-fix',
      fixContentProvider
    )
  );

  const statusBar =
    vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      100
    );

  statusBar.text =
    '$(shield) SentinelAI';

  statusBar.tooltip =
    'Click to open security report';

  statusBar.command =
    'sentinelai.openPanel';

  statusBar.show();

  context.subscriptions.push(
    statusBar
  );

  function getPanel(): vscode.WebviewPanel {
    if (!panel) {
      panel =
        vscode.window.createWebviewPanel(
          'sentinelai',
          'SentinelAI — Security Report',
          vscode.ViewColumn.Beside,
          {
            enableScripts: true,
            retainContextWhenHidden: true,
          }
        );

      panel.webview.html =
        getWebviewHtml();

      panel.onDidDispose(() => {
        panel = null;
      });

      panel.webview.onDidReceiveMessage(
        async message => {
          if (!panel) {
            return;
          }

          /*
           * Webview is ready.
           */
          if (
            message.type ===
            'ready'
          ) {
            if (cachedResults) {
              panel.webview.postMessage({
                type: 'results',
                ...cachedResults,
              });
            }

            if (
              cachedSandboxReport
            ) {
              panel.webview.postMessage({
                type:
                  'sandboxResults',
                report:
                  cachedSandboxReport,
              });
            }

            /*
             * If a runtime was already detected,
             * restore it when the Webview reloads.
             */
            if (
              selectedRuntime
            ) {
              panel.webview.postMessage({
                type:
                  'runtimeSelected',
                targetUrl:
                  selectedRuntime.url,
                runtime:
                  selectedRuntime.runtime,
                port:
                  selectedRuntime.port,
                statusCode:
                  selectedRuntime.statusCode,
                reachable:
                  selectedRuntime.reachable,
              });
            }
          }

          /*
           * Scan workspace.
           */
          if (
            message.type ===
            'requestScan'
          ) {
            await scanWorkspace(
              panel,
              statusBar
            );
          }

          /*
           * Open vulnerable/fixed diff.
           */
          if (
            message.type ===
            'openDiff'
          ) {
            const finding:
              Finding =
                message.finding;

            if (
              finding &&
              finding.fixedCode
            ) {
              try {
                const fileName =
                  finding.file ||
                  'file';

                const leftUri =
                  createFixUri(
                    `vulnerable-${fileName}`,
                    finding.vulnerableCode ||
                      '// Original code not available'
                  );

                const rightUri =
                  createFixUri(
                    `fixed-${fileName}`,
                    finding.fixedCode
                  );

                await vscode.commands.executeCommand(
                  'vscode.diff',
                  leftUri,
                  rightUri,
                  `🛡️ ${finding.type} — ${fileName} (Vulnerable ↔ Fixed)`
                );
              } catch (error) {
                const errorMessage =
                  error instanceof Error
                    ? error.message
                    : String(error);

                vscode.window.showErrorMessage(
                  `SentinelAI: Could not open diff view — ${errorMessage}`
                );
              }
            } else {
              vscode.window.showWarningMessage(
                'SentinelAI: No fixed code available for this finding.'
              );
            }
          }

          /*
           * Apply single fix.
           */
          if (
            message.type ===
            'applyFix'
          ) {
            const finding:
              Finding =
                message.finding;

            if (
              finding &&
              finding.vulnerableCode &&
              finding.fixedCode &&
              finding.file
            ) {
              const workspaceFiles =
                await vscode.workspace.findFiles(
                  `**/${finding.file}`,
                  '**/node_modules/**',
                  1
                );

              if (
                workspaceFiles.length >
                0
              ) {
                const doc =
                  await vscode.workspace.openTextDocument(
                    workspaceFiles[0]
                  );

                const text =
                  doc.getText();

                const vulnerable =
                  finding.vulnerableCode.trim();

                const index =
                  text.indexOf(
                    vulnerable
                  );

                if (
                  index !== -1
                ) {
                  const edit =
                    new vscode.WorkspaceEdit();

                  const start =
                    doc.positionAt(
                      index
                    );

                  const end =
                    doc.positionAt(
                      index +
                        vulnerable.length
                    );

                  edit.replace(
                    workspaceFiles[0],
                    new vscode.Range(
                      start,
                      end
                    ),
                    finding.fixedCode
                  );

                  await vscode.workspace.applyEdit(
                    edit
                  );

                  await doc.save();

                  vscode.window.showInformationMessage(
                    `🛡️ SentinelAI: Fix applied to ${finding.file}`
                  );

                  panel.webview.postMessage({
                    type:
                      'fixApplied',
                    findingId:
                      finding.id,
                  });
                } else {
                  vscode.window.showWarningMessage(
                    `🛡️ SentinelAI: Could not locate vulnerable code in ${finding.file}.`
                  );

                  panel.webview.postMessage({
                    type:
                      'fixFailed',
                    findingId:
                      finding.id,
                    message:
                      'Vulnerable code pattern not found in file.',
                  });
                }
              }
            }
          }

          /*
           * Apply all fixes.
           */
          if (
            message.type ===
            'applyAllFixes'
          ) {
            const findings:
              Finding[] =
                message.findings ||
                [];

            const fixable =
              findings.filter(
                finding =>
                  finding.vulnerableCode &&
                  finding.fixedCode &&
                  finding.file &&
                  !finding.applied
              );

            if (
              fixable.length ===
              0
            ) {
              vscode.window.showInformationMessage(
                'SentinelAI: No applicable fixes found.'
              );

              return;
            }

            let applied = 0;
            let failed = 0;

            for (
              const finding of fixable
            ) {
              try {
                const files =
                  await vscode.workspace.findFiles(
                    `**/${finding.file}`,
                    '**/node_modules/**',
                    1
                  );

                if (
                  files.length ===
                  0
                ) {
                  failed++;
                  continue;
                }

                const doc =
                  await vscode.workspace.openTextDocument(
                    files[0]
                  );

                const text =
                  doc.getText();

                const vulnerable =
                  finding.vulnerableCode!
                    .trim();

                const index =
                  text.indexOf(
                    vulnerable
                  );

                if (
                  index === -1
                ) {
                  failed++;
                  continue;
                }

                const edit =
                  new vscode.WorkspaceEdit();

                edit.replace(
                  files[0],
                  new vscode.Range(
                    doc.positionAt(
                      index
                    ),
                    doc.positionAt(
                      index +
                        vulnerable.length
                    )
                  ),
                  finding.fixedCode!
                );

                await vscode.workspace.applyEdit(
                  edit
                );

                await doc.save();

                applied++;

                panel.webview.postMessage({
                  type:
                    'fixApplied',
                  findingId:
                    finding.id,
                });
              } catch {
                failed++;
              }
            }

            vscode.window.showInformationMessage(
              `🛡️ SentinelAI: Applied ${applied} fix(es)` +
                (
                  failed > 0
                    ? `, ${failed} could not be applied`
                    : ''
                )
            );
          }

          /*
           * Run sandbox validation.
           */
          if (
            message.type ===
            'runSandbox'
          ) {
            const sandboxMode:
              SandboxMode =
                message.mode ===
                'project-validation'
                  ? 'project-validation'
                  : 'simulation';

            await runSandboxAttack(
              panel,
              statusBar,
              message.findings || [],
              sandboxMode
            );
          }

          /*
           * Stop sandbox.
           */
          if (
            message.type ===
            'stopSandbox'
          ) {
            try {
              await stopSandbox();
            } catch {
              // Preserve silent stop behavior.
            }
          }

          /*
           * Detect project runtime.
           *
           * The backend determines the framework.
           * Nothing is hard-coded here.
           */
          if (
            message.type ===
            'detectRuntime'
          ) {
            try {
              const runtime =
                await resolveProjectRuntime();

              panel.webview.postMessage({
                type:
                  'runtimeSelected',
                targetUrl:
                  runtime.url,
                runtime:
                  runtime.runtime,
                port:
                  runtime.port,
                statusCode:
                  runtime.statusCode,
                reachable:
                  runtime.reachable,
              });

              vscode.window.showInformationMessage(
                `SentinelAI runtime detected: ${runtime.runtime} on port ${runtime.port}`
              );
            } catch (error) {
              vscode.window.showErrorMessage(
                error instanceof Error
                  ? error.message
                  : String(error)
              );
            }
          }

          /*
           * Open detected runtime.
           */
          if (
            message.type ===
            'openRuntime'
          ) {
            try {
              await openProjectRuntime();
            } catch (error) {
              vscode.window.showErrorMessage(
                error instanceof Error
                  ? error.message
                  : String(error)
              );
            }
          }
        }
      );
    } else {
      panel.reveal(
        vscode.ViewColumn.Beside
      );

      if (cachedResults) {
        panel.webview.postMessage({
          type: 'results',
          ...cachedResults,
        });
      }

      if (cachedSandboxReport) {
        panel.webview.postMessage({
          type:
            'sandboxResults',
          report:
            cachedSandboxReport,
        });
      }

      /*
       * Restore detected runtime.
       */
      if (selectedRuntime) {
        panel.webview.postMessage({
          type:
            'runtimeSelected',
          targetUrl:
            selectedRuntime.url,
          runtime:
            selectedRuntime.runtime,
          port:
            selectedRuntime.port,
          statusCode:
            selectedRuntime.statusCode,
          reachable:
            selectedRuntime.reachable,
        });
      }
    }

    return panel;
  }

  /*
   * Open SentinelAI panel.
   */
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'sentinelai.openPanel',
      () => {
        getPanel();
      }
    )
  );

  /*
   * Scan command.
   */
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

  /*
   * Sandbox command.
   */
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'sentinelai.sandbox',
      () => {
        getPanel().webview.postMessage({
          type:
            'showConsent',
        });
      }
    )
  );

  /*
   * Runtime detection command.
   */
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'sentinelai.detectRuntime',
      async () => {
        try {
          const runtime =
            await resolveProjectRuntime();

          vscode.window.showInformationMessage(
            `SentinelAI runtime detected: ${runtime.runtime} on port ${runtime.port}`
          );
        } catch (error) {
          vscode.window.showErrorMessage(
            error instanceof Error
              ? error.message
              : String(error)
          );
        }
      }
    )
  );

  /*
   * Open runtime command.
   */
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'sentinelai.openRuntime',
      async () => {
        try {
          await openProjectRuntime();
        } catch (error) {
          vscode.window.showErrorMessage(
            error instanceof Error
              ? error.message
              : String(error)
          );
        }
      }
    )
  );

  /*
   * Auto-rescan on save.
   */
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument(
      document => {
        if (
          !isSupportedDocument(
            document
          )
        ) {
          return;
        }

        if (scanDebounceTimer) {
          clearTimeout(
            scanDebounceTimer
          );
        }

        scanDebounceTimer =
          setTimeout(
            async () => {
              scanDebounceTimer =
                null;

              await scanWorkspace(
                getPanel(),
                statusBar
              );
            },
            DEBOUNCE_MS
          );
      }
    )
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
    statusBar.text =
      '$(shield) SentinelAI';

    panel.webview.postMessage({
      type: 'error',
      message:
        'Backend not running. Start the SentinelAI backend first.',
    });

    return;
  }

  panel.webview.postMessage({
    type: 'scanStage',
    stage: 1,
    message:
      'Collecting workspace files & running static analysis...',
  });

  let files;

  try {
    files =
      await collectWorkspaceFiles();
  } catch (error) {
    statusBar.text =
      '$(shield) SentinelAI';

    panel.webview.postMessage({
      type: 'error',
      message:
        `Could not read workspace files: ${
          error instanceof Error
            ? error.message
            : String(error)
        }`,
    });

    return;
  }

  if (
    files.length ===
    0
  ) {
    statusBar.text =
      '$(shield) SentinelAI';

    panel.webview.postMessage({
      type: 'noFiles',
    });

    return;
  }

  panel.webview.postMessage({
    type: 'scanStage',
    stage: 2,
    message:
      'Running AI security analysis & vulnerability modeling...',
  });

  try {
    const response =
      await analyzeProject(
        files
      );

    const {
      findings,
      filesScanned,
    } = response;

    const fileNames =
      files.map(
        file => file.path
      );

    cachedResults = {
      findings,
      filesScanned,
      fileNames,
    };

    panel.webview.postMessage({
      type: 'scanStage',
      stage: 3,
      message:
        'Generating exploit commands & remediation report...',
    });

    statusBar.text =
      findings.length > 0
        ? `$(warning) SentinelAI: ${findings.length} issue${
            findings.length > 1
              ? 's'
              : ''
          }`
        : '$(check) SentinelAI: Clean';

    panel.webview.postMessage({
      type: 'results',
      findings,
      filesScanned,
      fileNames,
    });
  } catch (error) {
    statusBar.text =
      '$(shield) SentinelAI';

    panel.webview.postMessage({
      type: 'error',
      message:
        `Analysis failed: ${
          error instanceof Error
            ? error.message
            : String(error)
        }`,
    });
  }
}

async function runSandboxAttack(
  panel: vscode.WebviewPanel,
  statusBar: vscode.StatusBarItem,
  findings: Finding[],
  mode: SandboxMode = 'simulation'
): Promise<void> {
  try {
    await checkSandbox();
  } catch (error: any) {
    panel.webview.postMessage({
      type:
        'sandboxError',
      message:
        error.response?.data?.error ||
        'Docker is unavailable. Ensure Docker is running.',
    });

    return;
  }

  if (
    !findings.length
  ) {
    panel.webview.postMessage({
      type:
        'sandboxError',
      message:
        'There are no findings to validate.',
    });

    return;
  }

  statusBar.text =
    '$(debug-alt) SentinelAI: Validation running...';

  panel.webview.postMessage({
    type:
      'sandboxStarted',
  });

  try {
    let targetUrl:
      | string
      | undefined;

    /*
     * Project validation uses the ACTUAL
     * detected local project runtime.
     */
    if (
      mode ===
      'project-validation'
    ) {
      const runtime =
        selectedRuntime ||
        await resolveProjectRuntime();

      targetUrl =
        runtime.url;

      panel.webview.postMessage({
        type:
          'runtimeSelected',
        targetUrl:
          runtime.url,
        runtime:
          runtime.runtime,
        port:
          runtime.port,
        statusCode:
          runtime.statusCode,
        reachable:
          runtime.reachable,
      });
    }

    const report =
      await runSandbox(
        findings,
        mode,
        targetUrl
      );

    cachedSandboxReport =
      report;

    statusBar.text =
      `$(warning) SentinelAI: ${findings.length} issues`;

    panel.webview.postMessage({
      type:
        'sandboxResults',
      report,
    });
  } catch (error: any) {
    statusBar.text =
      `$(warning) SentinelAI: ${findings.length} issues`;

    panel.webview.postMessage({
      type:
        'sandboxError',
      message:
        `Runtime validation failed: ${
          error.message
        }`,
    });
  }
}

export function deactivate(): void {}