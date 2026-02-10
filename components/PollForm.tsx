"use client";

import { useState } from "react";
import type { Poll } from "@/lib/types";

interface PollFormProps {
  onCreated: (poll: Poll) => void;
}

export default function PollForm({ onCreated }: PollFormProps) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addOption = () => {
    if (options.length < 4) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/poll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, options }),
      });

      const json = await res.json();

      if (!json.success) {
        setError(json.error || "Er ging iets mis");
        return;
      }

      onCreated(json.data);
      setQuestion("");
      setOptions(["", ""]);
    } catch {
      setError("Kan geen verbinding maken met de server");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="question"
          className="mb-1 block text-sm font-semibold uppercase tracking-wide"
        >
          Vraag
        </label>
        <input
          id="question"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Stel je vraag..."
          required
          className="w-full rounded-lg border-2 border-hogent-black/10 p-3 text-lg transition-colors focus:border-hogent-teal focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold uppercase tracking-wide">
          Antwoordopties
        </label>
        <div className="space-y-2">
          {options.map((opt, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={opt}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={`Optie ${index + 1}`}
                required
                className="flex-1 rounded-lg border-2 border-hogent-black/10 p-3 transition-colors focus:border-hogent-teal focus:outline-none"
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="rounded-lg px-3 text-sm text-hogent-coral transition-colors hover:bg-hogent-coral/10"
                >
                  Verwijder
                </button>
              )}
            </div>
          ))}
        </div>

        {options.length < 4 && (
          <button
            type="button"
            onClick={addOption}
            className="mt-2 rounded-lg border-2 border-dashed border-hogent-teal/40 px-4 py-2 text-sm font-medium text-hogent-teal transition-colors hover:border-hogent-teal hover:bg-hogent-teal/5"
          >
            + Optie toevoegen
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-hogent-coral/10 p-3 text-sm text-hogent-coral">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-hogent-teal p-3 text-lg font-semibold text-white transition-colors hover:bg-hogent-teal/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Aanmaken..." : "Poll aanmaken"}
      </button>
    </form>
  );
}
