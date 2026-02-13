export interface AppConfig {
  sparkUiBaseUrl: string;
  yarnRmBaseUrl: string;
  sparkHistoryBaseUrl: string;
  authStrategy: "auto" | "cookie" | "token" | "kerberos";
  cookieVaultPath: string;
  sessionEncryptionKey: string;
}

export const loadConfig = (): AppConfig => ({
  sparkUiBaseUrl: process.env.SPARK_UI_BASE_URL ?? "",
  yarnRmBaseUrl: process.env.YARN_RM_BASE_URL ?? "",
  sparkHistoryBaseUrl: process.env.SPARK_HISTORY_BASE_URL ?? "",
  authStrategy: (process.env.AUTH_STRATEGY as AppConfig["authStrategy"]) ?? "auto",
  cookieVaultPath: process.env.COOKIE_VAULT_PATH ?? "./secrets/cookies.enc",
  sessionEncryptionKey: process.env.SESSION_ENCRYPTION_KEY ?? ""
});
