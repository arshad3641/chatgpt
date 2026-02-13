export type AuthMode = "cookie" | "token" | "kerberos" | "unknown";

export type DataSource =
  | "spark-app-api"
  | "spark-history-api"
  | "yarn-rm-api"
  | "browser-fallback";

export interface ProbeResult {
  source: DataSource;
  reachable: boolean;
  authenticated: boolean;
  authorized: boolean;
  schemaValid: boolean;
  latencyMs: number;
  authHints: string[];
}

export interface CapabilityMatrix {
  appId: string;
  authMode: AuthMode;
  selectedSource: DataSource;
  results: ProbeResult[];
  confidenceScore: number;
}

export interface Finding {
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  impactScore: number;
  confidence: number;
  recommendation: string;
  evidence: Record<string, number | string>;
}

export interface AnalysisResult {
  applicationId: string;
  source: DataSource;
  healthScore: number;
  findings: Finding[];
  authMode: AuthMode;
  traceId: string;
}
