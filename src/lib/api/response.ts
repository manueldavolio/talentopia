export function apiError(err: unknown, status = 500): Response {
  const message = err instanceof Error ? err.message : String(err);
  return Response.json({ success: false, error: message }, { status });
}
