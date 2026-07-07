import { z } from "zod";

import { consultantModeIds } from "./types";

export const chatContractVersion = "chat.response.v1";

export const chatRequestSchema = z.object({
  message: z.string().trim().min(1).max(4000),
  mode: z.enum(consultantModeIds),
});

export const citationSchema = z.object({
  title: z.string().min(1),
  source: z.string().min(1),
  url: z.string().url().optional(),
});

export const assistantMessageSchema = z.object({
  id: z.string().min(1),
  role: z.literal("assistant"),
  author: z.string().min(1),
  content: z.string().min(1),
  createdAt: z.string().min(1),
  citations: z.array(citationSchema),
  mode: z.enum(consultantModeIds),
  confidence: z.number().min(0).max(1),
  requiresCitation: z.boolean(),
  safetyLevel: z.enum(["standard", "sensitive", "high"]),
  followUpQuestions: z.array(z.string().min(1)),
  contractVersion: z.literal(chatContractVersion),
  provider: z.enum(["local", "azure-openai"]),
});

export const chatResponseSchema = z.object({
  requestId: z.string().min(1),
  message: assistantMessageSchema,
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type AssistantMessageContract = z.infer<typeof assistantMessageSchema>;
export type ChatResponseContract = z.infer<typeof chatResponseSchema>;
