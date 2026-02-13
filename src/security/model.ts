export interface SecurityControls {
  enforceLeastPrivilege: boolean;
  encryptSessionMaterial: boolean;
  redactLogs: boolean;
  signedAuditTrail: boolean;
}

export const DEFAULT_SECURITY_CONTROLS: SecurityControls = {
  enforceLeastPrivilege: true,
  encryptSessionMaterial: true,
  redactLogs: true,
  signedAuditTrail: true
};

export const redact = (value: string): string => {
  if (!value) return value;
  if (value.length <= 6) return "***";
  return `${value.slice(0, 3)}***${value.slice(-3)}`;
};
