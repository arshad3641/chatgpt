import { loadConfig } from "./config.js";
import { SessionManager } from "./auth/sessionManager.js";
import { DiscoveryService } from "./capability/discovery.js";
import { ScoringEngine } from "./scoring/engine.js";
import { endTrace, emitMetric, startTrace } from "./observability/hooks.js";

const main = async (): Promise<void> => {
  const config = loadConfig();
  const sessionManager = new SessionManager();
  const discovery = new DiscoveryService(config);
  const scoring = new ScoringEngine();

  const traceId = startTrace("analyze_spark_application");
  const appId = "application_1712345678901_1234";

  try {
    const matrix = await discovery.discover(appId);
    await sessionManager.getSession(matrix.authMode);

    const result = scoring.analyze(appId, matrix.selectedSource, matrix.authMode, traceId, {
      schedulerDelayP95Ms: 4200,
      skewRatio: 4.7,
      spillMb: 980,
      gcOverheadPct: 23,
      executorLossRatePct: 2.2
    });

    emitMetric("analysis_duration_ms", 125, { source: matrix.selectedSource });
    console.log(JSON.stringify({ capability: matrix, analysis: result }, null, 2));
    endTrace(traceId, "ok");
  } catch (error) {
    emitMetric("collector_error_count", 1, { stage: "main" });
    endTrace(traceId, "error");
    throw error;
  }
};

void main();
