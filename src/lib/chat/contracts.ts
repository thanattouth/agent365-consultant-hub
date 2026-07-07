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

export const chatTraceSchema = z.object({
  requestId: z.string().min(1).optional(),
  provider: z.enum(["local", "azure-openai"]),
  mode: z.enum(consultantModeIds),
  latencyMs: z.number().nonnegative().optional(),
  retrievalResultCount: z.number().int().nonnegative(),
  citationCount: z.number().int().nonnegative(),
  confidence: z.number().min(0).max(1),
  safetyLevel: z.enum(["standard", "sensitive", "high"]),
  guardrailStatus: z.enum(["pass", "review", "block"]),
  riskFlags: z.array(
    z.enum([
      "prompt_injection",
      "secret_request",
      "permission_bypass",
      "destructive_admin_action",
      "licensing_certainty",
      "production_risk",
    ]),
  ),
  requiresHumanReview: z.boolean(),
  retrieval: z.array(
    z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      source: z.string().min(1),
      product: z.string().min(1),
      scenario: z.string().min(1),
      sensitivity: z.enum(["public", "internal", "confidential"]),
      score: z.number(),
      matchedKeywords: z.array(z.string()),
    }),
  ),
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
  guardrailStatus: z.enum(["pass", "review", "block"]),
  riskFlags: z.array(
    z.enum([
      "prompt_injection",
      "secret_request",
      "permission_bypass",
      "destructive_admin_action",
      "licensing_certainty",
      "production_risk",
    ]),
  ),
  requiresHumanReview: z.boolean(),
  followUpQuestions: z.array(z.string().min(1)),
  contractVersion: z.literal(chatContractVersion),
  provider: z.enum(["local", "azure-openai"]),
  trace: chatTraceSchema,
});

export const chatResponseSchema = z.object({
  requestId: z.string().min(1),
  message: assistantMessageSchema,
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type AssistantMessageContract = z.infer<typeof assistantMessageSchema>;
export type ChatResponseContract = z.infer<typeof chatResponseSchema>;
