export const MCP_TOOLS = [
  {
    name: "discover_capabilities",
    description: "Probe Spark/YARN endpoints and infer auth mode with confidence score"
  },
  {
    name: "analyze_spark_application",
    description: "Analyze one Spark application and produce scored findings"
  },
  {
    name: "compare_applications",
    description: "Cross-application comparison for regressions and optimization opportunities"
  },
  {
    name: "detect_anomalies",
    description: "Detect performance anomalies over historical windows"
  },
  {
    name: "recommend_optimizations",
    description: "Generate prioritized tuning recommendations"
  }
] as const;
