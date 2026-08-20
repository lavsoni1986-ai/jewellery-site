import { NextRequest, NextResponse } from "next/server";
import { syncJewelleryCardToFirebase } from "@/lib/syncService";
import { verifyRequestAuth } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  // Support dry-run via query param ?dryRun=true
  const isDryRun = req.nextUrl.searchParams.get("dryRun") === "true";
  const singlePage = req.nextUrl.searchParams.get("singlePage") === "true";
  const maxPagesParam = req.nextUrl.searchParams.get("maxPages");
  const maxPages = maxPagesParam ? Number(maxPagesParam) : 100;

  if (!verifyRequestAuth(req)) {
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

  if (!verifyRequestAuth(req)) {
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
