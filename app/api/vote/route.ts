import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import type { Poll, CastVoteRequest, ApiResponse } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const { pollId, optionIndex } = (await request.json()) as CastVoteRequest;

    const poll = await redis.get<Poll>("current_poll");
    if (!poll || poll.id !== pollId) {
      return NextResponse.json(
        { success: false, error: "Poll niet gevonden of is gewijzigd" } satisfies ApiResponse<never>,
        { status: 404 }
      );
    }

    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return NextResponse.json(
        { success: false, error: "Ongeldige optie" } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    await redis.hincrby(`votes:${pollId}`, optionIndex.toString(), 1);

    return NextResponse.json({
      success: true,
    } satisfies ApiResponse<never>);
  } catch {
    return NextResponse.json(
      { success: false, error: "Kon stem niet registreren" } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
