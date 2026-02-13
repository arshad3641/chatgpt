# Enterprise Spark MCP Server — Architecture & Implementation Blueprint

## PHASE 1 — Capability Discovery Strategy

### Objective
Safely identify the best telemetry source without breaking enterprise security controls.

### Discovery sequence (least invasive to most invasive)
1. **Spark application REST probe**
   - Probe: `GET /api/v1/applications/<appId>/jobs`
   - Success criteria: `200` + JSON body schema match.
2. **Spark History Server probe**
   - Probe: `GET /api/v1/applications` and `GET /api/v1/applications/<appId>/stages`
   - Success criteria: app appears and stage schema validates.
3. **YARN ResourceManager probe**
   - Probe: `GET /ws/v1/cluster/apps/<appId>` and app attempts endpoint.
   - Success criteria: app state/timestamps/container diagnostics available.
4. **Authentication mode inference**
   - Cookie-based: `Set-Cookie` and redirect loops to SSO.
   - Token-based: `WWW-Authenticate: Bearer` or API gateway docs.
   - Kerberos/SPNEGO: `WWW-Authenticate: Negotiate`.
5. **Browser fallback viability**
   - Verify UI accessibility with persisted authenticated profile.

### Detection logic
- Perform `HEAD` then `GET` with strict timeout budget (2s/endpoint).
- Follow max 2 redirects; log redacted redirect host/path only.
- Classify each endpoint by: reachable, authenticated, authorized, schema-valid.
- Persist capability matrix per environment.

### Fallback hierarchy
1. Spark app REST (best fidelity, structured)
2. Spark History REST (high fidelity, historical)
3. YARN RM REST (coarser but stable)
4. Authenticated browser extraction (last resort)

---

## PHASE 2 — Architecture Alternatives

### Architecture A — Zero Browser Architecture
- API-only ingest from Spark/History/YARN.
- Pure JSON model normalization.
- Deterministic parsers with schema validation.
- Best for strong governance and predictable operations.

### Architecture B — Persistent Authenticated Browser Automation
- Playwright with persistent profile and encrypted cookies.
- Selector strategy uses `data-*` hooks first, robust semantic fallback.
- Extract tables, DAG summaries, executor metrics via DOM.
- Ideal when APIs are blocked but UI is permitted.

### Architecture C — Autonomous Spark Performance Intelligence System
- Adds metric warehouse + cross-app baselines.
- Trend and anomaly detection across jobs/teams/clusters.
- Generates ranked optimization recommendations with confidence score.
- Requires more infra but highest long-term value.

---

## PHASE 3 — Comparative Analysis

| Dimension | A: Zero Browser | B: Browser Automation | C: Autonomous Intelligence |
|---|---|---|---|
| Security risk | Lowest attack surface | Medium (browser/session material) | Medium-high (data platform footprint) |
| Stability | High if APIs stable | Medium (UI changes break selectors) | High after maturation |
| Maintainability | High | Medium-low | Medium (more components) |
| Scalability | High horizontal API polling | Moderate (browser concurrency cost) | Very high (batch+stream pipelines) |
| Performance overhead | Low | Higher CPU/memory | Moderate-high (analytics compute) |
| Auth complexity | Medium (tokens/Kerberos) | High (session lifecycle) | High (multi-system auth) |
| Failure modes | API auth/schema drift | UI redesign, anti-bot controls | Pipeline lag/model drift |
| Extensibility | High | Medium | Highest |
| MCP suitability | Excellent deterministic tools | Good fallback | Excellent for strategic assistant |

---

## PHASE 4 — Recommendation

### Primary
**Architecture A + C-light hybrid**:
- Primary ingestion via API-first discovery and normalization.
- Add lightweight historical persistence and scoring (from C) without full data platform dependency.

### Fallback
**Architecture B** only when:
- APIs are inaccessible or insufficient for required diagnostics.
- Enterprise policy allows managed browser sessions.

### Why this fits constraints
- Handles unknown API availability through phased discovery.
- Respects long-lived auth by abstract session provider.
- Scales via API collectors and worker queues.
- Avoids brittle browser-first dependency.

---

## PHASE 5 — Production-Grade Implementation Blueprint (TypeScript)

### 1) MCP server design
- `DiscoveryService`: builds capability matrix.
- `SessionManager`: obtains/refreshes auth material.
- `TelemetryCollector`: API collectors + browser collector adapter.
- `NormalizationLayer`: converts sources into common model.
- `ScoringEngine`: computes performance diagnostics.
- `RecommendationEngine`: maps findings to optimization actions.

### 2) Tool definitions
- `discover_capabilities(environment)`
- `analyze_spark_application(appId, depth)`
- `compare_applications(appIds[])`
- `detect_anomalies(window, cluster)`
- `recommend_optimizations(appId)`

### 3) Session management strategy
- `AuthProvider` interface:
  - `CookieVaultProvider` (AES-GCM encrypted at rest)
  - `TokenProvider` (OAuth/JWT refresh)
  - `KerberosProvider` (SPNEGO ticket cache integration)
- Central TTL and proactive refresh window.

### 4) Capability detection logic
- Weighted confidence per source:
  - Reachability: 25
  - Authentication success: 30
  - Schema completeness: 25
  - Latency SLO compliance: 20
- Highest score above threshold becomes primary source.

### 5) Scoring engine
- Signals:
  - Scheduler delay percentile
  - Task skew ratio (p95/p50)
  - Spill severity
  - GC overhead
  - Executor loss rate
  - Shuffle read/write imbalance
- Output:
  - `healthScore` (0–100)
  - prioritized findings with impact/confidence.

### 6) Security model
- Least-privilege service principal.
- Secret storage via external KMS/Vault.
- Redaction on logs and tool payloads.
- Signed audit events for every MCP tool call.

### 7) Example structured output
```json
{
  "applicationId": "application_1712345678901_1234",
  "source": "spark-history-api",
  "healthScore": 62,
  "findings": [
    {
      "type": "data_skew",
      "severity": "high",
      "evidence": { "taskSkewRatio": 4.7 },
      "recommendation": "Repartition join keys; enable AQE skew join handling"
    }
  ],
  "authMode": "cookie",
  "traceId": "trc_01HXYZ..."
}
```

### 8) Observability hooks
- OpenTelemetry traces per tool invocation.
- Metrics:
  - `capability_probe_latency_ms`
  - `collector_error_count`
  - `analysis_duration_ms`
  - `session_refresh_total`
- Structured logs with correlation IDs.

### 9) Folder structure
```text
src/
  index.ts
  config.ts
  types.ts
  capability/discovery.ts
  auth/sessionManager.ts
  tools/definitions.ts
  scoring/engine.ts
  security/model.ts
  observability/hooks.ts
```

### 10) Extensibility model
- Source adapters (`SparkApiAdapter`, `HistoryAdapter`, `YarnAdapter`, `BrowserAdapter`) via common interface.
- Rule packs for recommendations loaded from versioned JSON.
- Optional feature flags for advanced anomaly models.
