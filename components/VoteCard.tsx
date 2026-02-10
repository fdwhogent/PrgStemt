"use client";

const ACCENT_COLORS = [
  "border-l-hogent-teal",
  "border-l-hogent-coral",
  "border-l-hogent-pink",
  "border-l-hogent-purple",
];

const HOVER_COLORS = [
  "hover:bg-hogent-teal",
  "hover:bg-hogent-coral",
  "hover:bg-hogent-pink",
  "hover:bg-hogent-purple",
];

interface VoteCardProps {
  option: string;
  index: number;
  onVote: (index: number) => void;
  disabled: boolean;
}

export default function VoteCard({
  option,
  index,
  onVote,
  disabled,
}: VoteCardProps) {
  return (
    <button
      onClick={() => onVote(index)}
      disabled={disabled}
      className={`w-full rounded-lg border-2 border-hogent-black/10 border-l-4 ${ACCENT_COLORS[index % ACCENT_COLORS.length]} p-4 text-left text-lg font-medium transition-all ${HOVER_COLORS[index % HOVER_COLORS.length]} hover:scale-[1.02] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-transparent disabled:hover:text-hogent-black`}
    >
      {option}
    </button>
  );
}
