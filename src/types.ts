export interface Finding {
  id: string;
  type: string;
  severity: 'High' | 'Medium' | 'Low';
  file: string;
  line: string;
  explanation: string;
  attackStory: string[];
  fix: string;
}

export interface AttackResult {
  tool: string;
  target: string;
  payload?: string;
  output: string;
  evidence: string;
  success: boolean;
}

export interface SandboxReport {
  sandboxId: string;
  startedAt: string;
  finishedAt: string;
  target: string;
  attacks: AttackResult[];
  summary: string;
}

export interface ProjectFile {
  path: string;
  code: string;
}

export interface ProjectAnalysisResponse {
  findings: Finding[];
  filesScanned: number;
}