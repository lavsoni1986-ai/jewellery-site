import crypto from "crypto";
import { NextRequest } from "next/server";

export const SESSION_COOKIE_NAME = "admin_session";

/**
 * Derives a secure HMAC session token from server-side ADMIN_PASSWORD.
 */
export function getAdminSessionToken(): string {
  const secret = process.env.ADMIN_PASSWORD || "fallback_anshu_jewellers_admin_secret_key";
  return crypto.createHmac("sha256", secret).update("admin_authenticated_session_v1").digest("hex");
}

/**
 * Validates whether the provided session cookie matches the expected token.
 */
export function isValidAdminSession(cookieValue?: string | null): boolean {
  if (!cookieValue) return false;
  const expected = getAdminSessionToken();
  return cookieValue === expected;
}

/**
 * Validates request authorization using multiple secure mechanisms:
 * 1. HTTP-Only admin_session cookie (used by Admin Dashboard in browser)
 * 2. Authorization: Bearer <CRON_SECRET | SYNC_SECRET | ADMIN_PASSWORD> (used by Vercel Cron / API)
 * 3. x-admin-secret header (used by secure server-to-server callers)
 * 4. ?secret= query parameter
 */
export function verifyRequestAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization") || "";
  const querySecret = req.nextUrl.searchParams.get("secret");
  const adminHeader = req.headers.get("x-admin-secret");
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;

  const cronSecret = process.env.CRON_SECRET;
  const syncSecret = process.env.SYNC_SECRET;
  const adminPassword = process.env.ADMIN_PASSWORD;

  // 1. Check HTTP-Only admin session cookie from browser
  if (isValidAdminSession(sessionCookie)) {
    return true;
  }

  // 2. Check Bearer token (Vercel Cron automatically attaches Authorization: Bearer <CRON_SECRET>)
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.replace("Bearer ", "").trim();
    if (cronSecret && token === cronSecret) return true;
    if (syncSecret && token === syncSecret) return true;
    if (adminPassword && token === adminPassword) return true;
  }

  // 3. Check x-admin-secret header
  if (adminHeader) {
    if (adminPassword && adminHeader === adminPassword) return true;
    if (syncSecret && adminHeader === syncSecret) return true;
    if (cronSecret && adminHeader === cronSecret) return true;
  }

  // 4. Check query parameter
  if (querySecret) {
    if (cronSecret && querySecret === cronSecret) return true;
    if (syncSecret && querySecret === syncSecret) return true;
    if (adminPassword && querySecret === adminPassword) return true;
  }

  // 5. In development with no secrets configured, allow access
  if (!cronSecret && !syncSecret && !adminPassword && process.env.NODE_ENV === "development") {
    return true;
  }

  return false;
}
