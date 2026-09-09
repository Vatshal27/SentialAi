import * as vscode from 'vscode';
import axios from 'axios';

import {
  Finding,
  ProjectAnalysisResponse,
  ProjectFile,
  SandboxReport,
  SandboxMode,
} from './types';

const SERVER_URL = 'http://localhost:3000';

const CODE_EXTENSIONS = [
  '.js',
  '.ts',
  '.py',
  '.go',
  '.java',
  '.php',
  '.rb',
  '.cs',
  '.cpp',
  '.c',
  '.rs',
  '.html',
  '.css',
  '.jsx',
  '.tsx',
  '.vue',
  '.svelte',
  '.sql',
  '.sh',
  '.env',
];

const MAX_CHARS_PER_FILE = 8_000;
const MAX_FILES = 50;

const FILE_GLOB =
  '**/*.{js,ts,py,go,php,java,rb,cs,cpp,c,rs,html,css,jsx,tsx,vue,svelte,sql,sh,env}';

const EXCLUDE_GLOB =
  '**/{node_modules,dist,out,.git,build,vendor,coverage,.next}/**';

function getExtension(
  filePath: string
): string {
  const lastDot =
    filePath.lastIndexOf('.');

  if (lastDot === -1) {
    return '';
  }

  return filePath
    .slice(lastDot)
    .toLowerCase();
}

export function isSupportedDocument(
  document: vscode.TextDocument
): boolean {
  return CODE_EXTENSIONS.includes(
    getExtension(
      document.fileName
    )
  );
}

export async function checkBackend(): Promise<void> {
  await axios.get(
    `${SERVER_URL}/health`,
    {
      timeout: 10_000,
    }
  );
}

export async function collectWorkspaceFiles(): Promise<ProjectFile[]> {
  const uris =
    await vscode.workspace.findFiles(
      FILE_GLOB,
      EXCLUDE_GLOB
    );

  const files: ProjectFile[] = [];

  for (const uri of uris) {
    if (
      files.length >= MAX_FILES
    ) {
      break;
    }

    const extension =
      getExtension(uri.fsPath);

    if (
      !CODE_EXTENSIONS.includes(
        extension
      )
    ) {
      continue;
    }

    try {
      const bytes =
        await vscode.workspace.fs.readFile(
          uri
        );

      const code =
        Buffer.from(bytes)
          .toString('utf8')
          .slice(
            0,
            MAX_CHARS_PER_FILE
          );

      if (
        code.trim().length <= 30
      ) {
        continue;
      }

      files.push({
        path:
          vscode.workspace.asRelativePath(
            uri
          ),
        code,
      });
    } catch (error) {
      console.error(
        `[SentinelAI] Failed to read ${uri.fsPath}:`,
        error
      );
    }
  }

  return files;
}

export interface RuntimeInfo {
  reachable: boolean;
  protocol: string;
  port: number;
  statusCode?: number;
  url: string;
  runtime: string;
}

export async function discoverRuntimes(): Promise<RuntimeInfo[]> {
  const response =
    await axios.get(
      `${SERVER_URL}/runtime/discover`,
      {
        timeout: 15_000,
      }
    );

  if (
    !response.data ||
    response.data.ok !== true
  ) {
    throw new Error(
      response.data?.error ||
        'Runtime discovery failed.'
    );
  }

  return response.data.runtimes || [];
}

export async function checkRuntime(
  targetUrl: string
): Promise<RuntimeInfo> {
  const response =
    await axios.post(
      `${SERVER_URL}/runtime/check`,
      {
        targetUrl,
      },
      {
        timeout: 10_000,
      }
    );

  if (
    !response.data ||
    response.data.ok !== true
  ) {
    throw new Error(
      response.data?.error ||
        'Runtime check failed.'
    );
  }

  return response.data;
}

export async function analyzeProject(
  files: ProjectFile[]
): Promise<ProjectAnalysisResponse> {
  const response =
    await axios.post<ProjectAnalysisResponse>(
      `${SERVER_URL}/analyze-project`,
      { files },
      {
        timeout: 660_000,
      }
    );

  if (
    !Array.isArray(
      response.data.findings
    )
  ) {
    throw new Error(
      'The backend returned an invalid findings response.'
    );
  }

  return response.data;
}

export async function checkSandbox(): Promise<void> {
  await axios.get(
    `${SERVER_URL}/sandbox/check`,
    {
      timeout: 15_000,
    }
  );
}

export async function runSandbox(
  findings: Finding[],
  mode: SandboxMode = 'simulation',
  targetUrl?: string
): Promise<SandboxReport> {
  const response =
    await axios.post(
      `${SERVER_URL}/sandbox/run`,
      {
        findings,
        mode,
        targetUrl,
      },
      {
        timeout: 660_000,
      }
    );

  return response.data;
}

export async function stopSandbox(): Promise<void> {
  await axios.post(
    `${SERVER_URL}/sandbox/stop`,
    {},
    {
      timeout: 30_000,
    }
  );
}