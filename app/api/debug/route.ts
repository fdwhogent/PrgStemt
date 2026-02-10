import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  return NextResponse.json({
    hasUrl: !!url,
    urlLength: url?.length ?? 0,
    urlPrefix: url?.substring(0, 12) ?? "MISSING",
    hasToken: !!token,
    tokenLength: token?.length ?? 0,
  });
}
