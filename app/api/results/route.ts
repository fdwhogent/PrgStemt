import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import type { Poll, PollResults, ApiResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const poll = await redis.get<Poll>("current_poll");
    if (!poll) {
      return NextResponse.json(
        { success: false, error: "Geen actieve poll" } satisfies ApiResponse<never>,
        { status: 404 }
      );
    }

    const votesHash = await redis.hgetall<Record<string, number>>(
      `votes:${poll.id}`
    );

    const votes = poll.options.map((_, index) => {
      return votesHash?.[index.toString()] ?? 0;
    });

    const totalVotes = votes.reduce((sum, v) => sum + v, 0);

    const results: PollResults = {
      poll,
      votes,
      totalVotes,
    };

    return NextResponse.json({
      success: true,
      data: results,
    } satisfies ApiResponse<PollResults>);
  } catch {
    return NextResponse.json(
      { success: false, error: "Kon resultaten niet ophalen" } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
