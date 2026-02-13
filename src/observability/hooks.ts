export const startTrace = (toolName: string): string => {
  const traceId = `trc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  console.info(JSON.stringify({ level: "info", event: "trace_start", toolName, traceId }));
  return traceId;
};

export const emitMetric = (name: string, value: number, tags: Record<string, string> = {}): void => {
  console.info(JSON.stringify({ level: "info", event: "metric", name, value, tags }));
};

export const endTrace = (traceId: string, status: "ok" | "error"): void => {
  console.info(JSON.stringify({ level: "info", event: "trace_end", traceId, status }));
};
