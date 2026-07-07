import type { ConsultantMode } from "@/lib/chat/types";

export type KnowledgeSensitivity = "public" | "internal" | "confidential";

export type KnowledgeSource = {
  id: string;
  title: string;
  source: string;
  url?: string;
  product: string;
  scenario: string;
  sensitivity: KnowledgeSensitivity;
  modes: ConsultantMode[];
  keywords: string[];
  content: string;
};

export type RetrievalResult = {
  source: KnowledgeSource;
  score: number;
  matchedKeywords: string[];
};

export type RetrievalTraceItem = {
  id: string;
  title: string;
  source: string;
  product: string;
  scenario: string;
  sensitivity: KnowledgeSensitivity;
  score: number;
  matchedKeywords: string[];
};

export type RetrievalInput = {
  query: string;
  mode: ConsultantMode;
  limit?: number;
};
