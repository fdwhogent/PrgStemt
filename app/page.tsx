"use client";

import { useState, useEffect, useCallback } from "react";
import type { Poll, PollResults, ApiResponse } from "@/lib/types";
import VoteCard from "@/components/VoteCard";
import ResultsChart from "@/components/ResultsChart";

export default function VotePage() {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedOptionIndex, setVotedOptionIndex] = useState<number | null>(null);
  const [results, setResults] = useState<PollResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch the current poll
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const res = await fetch("/api/poll");
        const json: ApiResponse<Poll> = await res.json();

        if (json.success && json.data) {
          setPoll(json.data);

          // Check localStorage for previous vote
          const previousVote = localStorage.getItem(`voted_${json.data.id}`);
          if (previousVote !== null) {
            setHasVoted(true);
            setVotedOptionIndex(parseInt(previousVote));
          }
        }
      } catch {
        setError("Kan geen verbinding maken met de server");
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, []);

  // Fetch results
  const fetchResults = useCallback(async () => {
    try {
      const res = await fetch("/api/results");
      const json: ApiResponse<PollResults> = await res.json();
      if (json.success && json.data) {
        setResults(json.data);
      }
    } catch {
      // Silently fail on polling errors
    }
  }, []);

  // Poll results every 3 seconds after voting
  useEffect(() => {
    if (!hasVoted || !poll) return;

    fetchResults();
    const interval = setInterval(fetchResults, 3000);
    return () => clearInterval(interval);
  }, [hasVoted, poll, fetchResults]);

  const handleVote = async (optionIndex: number) => {
    if (!poll || voting) return;
    setVoting(true);

    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pollId: poll.id, optionIndex }),
      });

      const json: ApiResponse<never> = await res.json();

      if (json.success) {
        localStorage.setItem(`voted_${poll.id}`, optionIndex.toString());
        setHasVoted(true);
        setVotedOptionIndex(optionIndex);
      } else {
        setError(json.error || "Kon stem niet registreren");
      }
    } catch {
      setError("Kan geen verbinding maken met de server");
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-hogent-teal border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-hogent-coral/10 p-4 text-center text-hogent-coral">
        {error}
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold">Geen actieve poll</h2>
        <p className="mt-2 text-hogent-black/60">
          Er is momenteel geen poll actief. Kom later terug!
        </p>
      </div>
    );
  }

  if (hasVoted && results) {
    return <ResultsChart results={results} votedOptionIndex={votedOptionIndex} />;
  }

  if (hasVoted && !results) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-hogent-teal border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{poll.question}</h2>
      <div className="space-y-3">
        {poll.options.map((option, index) => (
          <VoteCard
            key={index}
            option={option}
            index={index}
            onVote={handleVote}
            disabled={voting}
          />
        ))}
      </div>
      {voting && (
        <p className="text-center text-sm text-hogent-black/50">
          Stem wordt verwerkt...
        </p>
      )}
    </div>
  );
}
