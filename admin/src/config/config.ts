class Config {
  // BASIC
  readonly baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:5001";
  readonly apiDelay = Number(process.env.NEXT_PUBLIC_API_DELAY ?? 0);
}

export const config = new Config();
