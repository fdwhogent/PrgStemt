export interface Poll {
  id: string;
  question: string;
  options: string[];
  createdAt: number;
}

export interface PollResults {
  poll: Poll;
  votes: number[];
  totalVotes: number;
}

export interface CreatePollRequest {
  question: string;
  options: string[];
}

export interface CastVoteRequest {
  pollId: string;
  optionIndex: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
