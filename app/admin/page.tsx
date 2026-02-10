"use client";

import { useState, useEffect } from "react";
import type { Poll, ApiResponse } from "@/lib/types";
import PollForm from "@/components/PollForm";

export default function AdminPage() {
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const res = await fetch("/api/poll");
        const json: ApiResponse<Poll> = await res.json();
        if (json.success && json.data) {
          setCurrentPoll(json.data);
        }
      } catch {
        // No active poll, that's fine
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, []);

  const handleCreated = (poll: Poll) => {
    setCurrentPoll(poll);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Poll beheren</h1>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-hogent-teal border-t-transparent" />
        </div>
      ) : (
        <>
          {currentPoll && (
            <div className="rounded-lg border-2 border-hogent-black/10 bg-hogent-gray p-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-hogent-black/50">
                Huidige actieve poll
              </p>
              <p className="mt-1 text-lg font-bold">{currentPoll.question}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {currentPoll.options.map((opt, i) => (
                  <span
                    key={i}
                    className="rounded-md bg-hogent-black/5 px-3 py-1 text-sm"
                  >
                    {opt}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs text-hogent-black/40">
                Aangemaakt op{" "}
                {new Date(currentPoll.createdAt).toLocaleString("nl-BE")}
              </p>
            </div>
          )}

          {success && (
            <div className="rounded-lg bg-hogent-green/20 p-3 text-sm font-medium text-hogent-black">
              Poll succesvol aangemaakt! Studenten kunnen nu stemmen op de
              hoofdpagina.
            </div>
          )}

          <div className="rounded-lg border-2 border-hogent-black/10 p-6">
            <h2 className="mb-4 text-xl font-bold">Nieuwe poll aanmaken</h2>
            <PollForm onCreated={handleCreated} />
          </div>
        </>
      )}
    </div>
  );
}
