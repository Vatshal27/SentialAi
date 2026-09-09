export type ValidationStatus =
  | 'queued'
  | 'running'
  | 'success'
  | 'failed'
  | 'inconclusive';

export type ValidationVerdict =
  | 'confirmed'
  | 'inconclusive'
  | 'not_reproduced';

export type SandboxMode =
  | 'simulation'
  | 'project-validation';

export type Validator =
  | 'sqlmap'
  | 'zap'
  | 'nuclei'
  | 'custom';

export interface Finding {
  id: string;
  type: string;
  severity: 'High' | 'Medium' | 'Low';
  file: string;
  line: string;
  explanation: string;
  attackStory: string[];
  fix: string;
  attackType?: string;
  attackPayloads?: string[];
  attackScript?: string;
  vulnerableCode?: string;
  fixedCode?: string;
  applied?: boolean;
}

export interface ValidationPlan {
  findingId: string;
  attackType: string;
  validator: Validator;
  target: string;
  rationale: string;
}

export interface Evidence {
  id: string;
  type:
    | 'request'
    | 'response'
    | 'log'
    | 'database'
    | 'finding';
  timestamp: string;
  source: string;
  content: string;
}

export interface AttackRequest {
  method: string;
  url: string;
  body?: string;
}

export interface AttackResponse {
  statusCode?: number;
  body?: string;
}

export interface AttackResult {
  id: string;
  findingId: string;
  tool: Validator;
  attackType: string;
  target: string;
  status: ValidationStatus;
  payload?: string;
  request?: AttackRequest;
  response?: AttackResponse;
  evidence: Evidence[];
  startedAt: string;
  finishedAt?: string;
}

export interface ValidationResult {
  findingId: string;
  result: ValidationVerdict;
  confidence: number;
  rationale: string;
  attackId?: string;
}

export interface ContainerInfo {
  id: string;
  name: string;
  role: 'target' | 'attacker' | 'scanner';
  image: string;
  status: string;
}

export interface TargetInfo {
  name: string;
  url: string;
  containerId: string;
  status: string;
}

export type SandboxStage =
  | 'initialization'
  | 'network'
  | 'target'
  | 'attack'
  | 'evidence'
  | 'cleanup';

export type SandboxEventStatus =
  | 'started'
  | 'running'
  | 'success'
  | 'warning'
  | 'failed';

export interface SandboxEvent {
  id: string;
  step: number;
  timestamp: string;
  stage: SandboxStage;
  tool?: Validator;
  status: SandboxEventStatus;
  description: string;
  findingId?: string;
}

export interface SandboxSummary {
  findings: number;
  tested: number;
  confirmed: number;
  inconclusive: number;
  notReproduced: number;
  durationMs: number;
}

export interface MockFrontend {
  html: string;
  vulnerabilities: Array<{
    type: string;
    severity: string;
    file: string;
  }>;
}

export interface DataLeak {
  type: string;
  payload: string;
  evidence: string;
  output: string;
}

export interface SandboxReport {
  sandboxId: string;
  mode: SandboxMode;
  startedAt: string;
  finishedAt: string;
  target: TargetInfo;
  containers: ContainerInfo[];
  events: SandboxEvent[];
  attacks: AttackResult[];
  validations: ValidationResult[];
  summary: SandboxSummary;
  mockFrontend?: MockFrontend;
  dataLeak?: DataLeak[];
}

export interface ProjectFile {
  path: string;
  code: string;
}

export interface ProjectAnalysisResponse {
  findings: Finding[];
  filesScanned: number;
} 