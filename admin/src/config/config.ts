class Config {
  // BASIC
  readonly baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:5001";
  readonly apiDelay = Number(process.env.NEXT_PUBLIC_API_DELAY ?? 0);

  // sessionStorage key
  readonly sessionStorageKey = process.env.NEXT_PUBLIC_SESSION_STORAGE_KEY ?? "test";
}

export const config = new Config();
