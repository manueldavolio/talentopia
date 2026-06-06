/** Logging sicuro per route Edge / Cloudflare (solo messaggi, niente dati sensibili). */
export function edgeLog(route: string, message: string, err?: unknown): void {
  const detail =
    err instanceof Error ? err.message : err !== undefined ? String(err) : "";
  console.error(`[${route}] ${message}${detail ? `: ${detail}` : ""}`);
}
