const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ── Types ────────────────────────────────────────────────────────────────────

export type Role = "swe" | "data" | "pm" | "behavioral";

export interface Question {
  id: string;
  role: Role;
  text: string;
  rubric: string[];
  difficulty: "easy" | "medium" | "hard";
}

export interface ScoreResult {
  overall: number;
  technical_depth: number;
  clarity: number;
  completeness: number;
  structure: number;
  missing_concepts: string[];
  strengths: string[];
  feedback: string;
}

export interface AnswerRecord {
  id: string;
  question: Question;
  answer: string;
  score: ScoreResult;
  created_at: string;
}

// ── Questions ────────────────────────────────────────────────────────────────
export const getQuestions = (role: Role) =>
  request<Question[]>(`/questions?role=${role}`);

export const getQuestion = (id: string) =>
  request<Question>(`/questions/${id}`);


// ── Scoring ──────────────────────────────────────────────────────────────────
export const submitAnswer = (questionId: string, answer: string) =>
  request<ScoreResult>("/scoring/submit", {
    method: "POST",
    body: JSON.stringify({ question_id: questionId, answer }),
  });


// ── History ──────────────────────────────────────────────────────────────────
export const getHistory = () =>
  request<AnswerRecord[]>("/history");

export const getHistoryItem = (id: string) =>
  request<AnswerRecord>(`/history/${id}`);