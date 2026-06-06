import { NextRequest } from "next/server";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "quiz-arena-admin-dev";

export function isAdminAuthorized(request: NextRequest): boolean {
  const header = request.headers.get("x-admin-secret");
  const query = request.nextUrl.searchParams.get("secret");
  const secret = header || query;
  return secret === ADMIN_SECRET;
}

export function unauthorizedResponse() {
  return new Response(JSON.stringify({ error: "Non autorizzato" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}
