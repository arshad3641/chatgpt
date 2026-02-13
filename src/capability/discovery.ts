import { AppConfig } from "../config.js";
import { CapabilityMatrix, DataSource, ProbeResult } from "../types.js";

const sourceWeights = {
  reachable: 25,
  authenticated: 30,
  schemaValid: 25,
  latencySlo: 20
};

export class DiscoveryService {
  constructor(private readonly config: AppConfig) {}

  async discover(appId: string): Promise<CapabilityMatrix> {
    const probes: ProbeResult[] = [
      await this.mockProbe("spark-app-api", 180, ["set-cookie"]),
      await this.mockProbe("spark-history-api", 140, ["set-cookie"]),
      await this.mockProbe("yarn-rm-api", 90, ["www-authenticate:negotiate"]),
      await this.mockProbe("browser-fallback", 450, ["sso-redirect"])
    ];

    const authMode = this.inferAuthMode(probes.flatMap((p) => p.authHints));
    const scored = probes
      .map((probe) => ({ source: probe.source, score: this.scoreProbe(probe) }))
      .sort((a, b) => b.score - a.score);

    return {
      appId,
      authMode,
      selectedSource: scored[0]?.source ?? "browser-fallback",
      results: probes,
      confidenceScore: scored[0]?.score ?? 0
    };
  }

  private async mockProbe(source: DataSource, latencyMs: number, authHints: string[]): Promise<ProbeResult> {
    return {
      source,
      latencyMs,
      authHints,
      reachable: true,
      authenticated: true,
      authorized: true,
      schemaValid: source !== "browser-fallback"
    };
  }

  private inferAuthMode(hints: string[]): CapabilityMatrix["authMode"] {
    if (hints.some((h) => h.includes("negotiate"))) return "kerberos";
    if (hints.some((h) => h.includes("bearer"))) return "token";
    if (hints.some((h) => h.includes("cookie") || h.includes("sso"))) return "cookie";
    return "unknown";
  }

  private scoreProbe(probe: ProbeResult): number {
    const latencyScore = probe.latencyMs <= 500 ? sourceWeights.latencySlo : 0;
    return (
      (probe.reachable ? sourceWeights.reachable : 0) +
      (probe.authenticated ? sourceWeights.authenticated : 0) +
      (probe.schemaValid ? sourceWeights.schemaValid : 0) +
      latencyScore
    );
  }
}
