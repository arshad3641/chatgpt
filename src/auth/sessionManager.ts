import { AuthMode } from "../types.js";

export interface SessionContext {
  authMode: AuthMode;
  expiresAtEpochMs: number;
  headers: Record<string, string>;
}

export class SessionManager {
  async getSession(authModeHint: AuthMode = "unknown"): Promise<SessionContext> {
    const authMode = authModeHint === "unknown" ? "cookie" : authModeHint;

    return {
      authMode,
      expiresAtEpochMs: Date.now() + 1000 * 60 * 60,
      headers:
        authMode === "token"
          ? { Authorization: "Bearer <opaque-token>" }
          : { Cookie: "SSO_SESSION=<encrypted-cookie-material>" }
    };
  }
}
