class Config {
  // BASIC
  readonly baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:8000";
  readonly apiDelay = Number(process.env.NEXT_PUBLIC_API_DELAY ?? 0);
  readonly isDev = process.env.NODE_ENV !== "production";

  // sessionStorage key
  readonly sessionStorageKey = process.env.NEXT_PUBLIC_SESSION_STORAGE_KEY ?? "test";
}

export const config = new Config();
