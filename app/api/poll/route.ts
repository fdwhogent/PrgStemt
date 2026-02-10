import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import type { Poll, CreatePollRequest, ApiResponse } from "@/lib/types";

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

    return NextResponse.json({
      success: true,
      data: poll,
    } satisfies ApiResponse<Poll>);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Onbekende fout";
    return NextResponse.json(
      { success: false, error: `Kon poll niet ophalen: ${message}` } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreatePollRequest;
    const { question, options } = body;

    if (!question || !question.trim()) {
      return NextResponse.json(
        { success: false, error: "Vraag is verplicht" } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    if (!options || options.length < 2 || options.length > 4) {
      return NextResponse.json(
        { success: false, error: "Geef 2 tot 4 antwoordopties op" } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    if (options.some((opt) => !opt.trim())) {
      return NextResponse.json(
        { success: false, error: "Opties mogen niet leeg zijn" } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    const poll: Poll = {
      id: crypto.randomUUID(),
      question: question.trim(),
      options: options.map((opt) => opt.trim()),
      createdAt: Date.now(),
    };

    await redis.set("current_poll", poll);

    const voteInit: Record<string, number> = {};
    poll.options.forEach((_, index) => {
      voteInit[index.toString()] = 0;
    });
    await redis.hset(`votes:${poll.id}`, voteInit);

    return NextResponse.json(
      { success: true, data: poll } satisfies ApiResponse<Poll>,
      { status: 201 }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Onbekende fout";
    return NextResponse.json(
      { success: false, error: `Kon poll niet aanmaken: ${message}` } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
