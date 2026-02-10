"use client";

import type { PollResults } from "@/lib/types";

const BAR_COLORS = [
  "bg-hogent-teal",
  "bg-hogent-coral",
  "bg-hogent-pink",
  "bg-hogent-purple",
];

interface ResultsChartProps {
  results: PollResults;
  votedOptionIndex: number | null;
}

export default function ResultsChart({
  results,
  votedOptionIndex,
}: ResultsChartProps) {
  const { poll, votes, totalVotes } = results;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{poll.question}</h2>

      <div className="space-y-3">
        {poll.options.map((option, index) => {
          const count = votes[index] ?? 0;
          const percentage =
            totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
          const isMyVote = votedOptionIndex === index;

          return (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  {option}
                  {isMyVote && (
                    <span className="ml-2 rounded bg-hogent-black px-2 py-0.5 text-xs text-white">
                      Jouw stem
                    </span>
                  )}
                </span>
                <span className="text-hogent-black/60">
                  {count} {count === 1 ? "stem" : "stemmen"} ({percentage}%)
                </span>
              </div>
              <div className="h-8 w-full overflow-hidden rounded-md bg-hogent-gray">
                <div
                  className={`h-full rounded-md ${BAR_COLORS[index % BAR_COLORS.length]} transition-all duration-500 ease-out`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-hogent-black/10 pt-3">
        <p className="text-lg font-semibold">
          Totaal: {totalVotes} {totalVotes === 1 ? "stem" : "stemmen"}
        </p>
        <p className="text-sm text-hogent-black/50">
          Resultaten worden elke 3 seconden bijgewerkt
        </p>
      </div>
    </div>
  );
}
