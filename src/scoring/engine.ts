import { AnalysisResult, Finding } from "../types.js";

export interface RawMetrics {
  schedulerDelayP95Ms: number;
  skewRatio: number;
  spillMb: number;
  gcOverheadPct: number;
  executorLossRatePct: number;
}

export class ScoringEngine {
  analyze(appId: string, source: AnalysisResult["source"], authMode: AnalysisResult["authMode"], traceId: string, m: RawMetrics): AnalysisResult {
    const findings: Finding[] = [];

    if (m.skewRatio > 3) {
      findings.push({
        type: "data_skew",
        severity: "high",
        impactScore: 25,
        confidence: 0.88,
        recommendation: "Repartition skewed keys; enable AQE skew handling.",
        evidence: { skewRatio: m.skewRatio }
      });
    }

    if (m.gcOverheadPct > 20) {
      findings.push({
        type: "gc_pressure",
        severity: "medium",
        impactScore: 15,
        confidence: 0.82,
        recommendation: "Tune memory fractions and executor memory overhead.",
        evidence: { gcOverheadPct: m.gcOverheadPct }
      });
    }

    const penalties = findings.reduce((acc, f) => acc + f.impactScore, 0);
    const healthScore = Math.max(0, 100 - penalties);

    return {
      applicationId: appId,
      source,
      healthScore,
      findings,
      authMode,
      traceId
    };
  }
}
