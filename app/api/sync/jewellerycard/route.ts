import { NextRequest, NextResponse } from "next/server";
import { syncJewelleryCardToFirebase } from "@/lib/syncService";

/**
 * Validates request authorization:
 * 1. Bearer token matching CRON_SECRET or SYNC_SECRET
 * 2. Query param ?secret= matching CRON_SECRET or SYNC_SECRET
 * 3. Header x-admin-secret matching ADMIN_PASSWORD
 */
function isAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization") || "";
  const querySecret = req.nextUrl.searchParams.get("secret");
  const adminHeader = req.headers.get("x-admin-secret");

  const cronSecret = process.env.CRON_SECRET || process.env.SYNC_SECRET;
  const adminPassword = process.env.ADMIN_PASSWORD;

  // 1. Check Bearer token
  if (authHeader.startsWith("Bearer ") && cronSecret) {
    const token = authHeader.replace("Bearer ", "").trim();
    if (token === cronSecret) return true;
  }

  // 2. Check query parameter secret
  if (querySecret && cronSecret && querySecret === cronSecret) {
    return true;
  }

  // 3. Check admin password header
  if (adminHeader && adminPassword && adminHeader === adminPassword) {
    return true;
  }

  // If no secrets are configured in development/demo, allow GET dry-runs
  if (!cronSecret && !adminPassword && process.env.NODE_ENV === "development") {
    return true;
  }

  return false;
}

export async function GET(req: NextRequest) {
  // Support dry-run via query param ?dryRun=true
  const isDryRun = req.nextUrl.searchParams.get("dryRun") === "true";
  const singlePage = req.nextUrl.searchParams.get("singlePage") === "true";
  const maxPagesParam = req.nextUrl.searchParams.get("maxPages");
  const maxPages = maxPagesParam ? Number(maxPagesParam) : 100;

  if (!isAuthorized(req)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Provide valid Authorization header or secret." },
      { status: 401 }
    );
  }

  try {
    const result = await syncJewelleryCardToFirebase({
      dryRun: isDryRun,
      singlePageOnly: singlePage,
      maxPages: isNaN(maxPages) ? 100 : maxPages,
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  let body: { dryRun?: boolean; singlePageOnly?: boolean; maxPages?: number } = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  if (!isAuthorized(req)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Provide valid Authorization header or secret." },
      { status: 401 }
    );
  }

  try {
    const result = await syncJewelleryCardToFirebase({
      dryRun: Boolean(body.dryRun),
      singlePageOnly: Boolean(body.singlePageOnly),
      maxPages: body.maxPages || 100,
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
