import { NextResponse } from "next/server";

import { chatRequestSchema } from "@/lib/chat/contracts";
import { draftConsultantResponse } from "@/lib/chat/consultant";
import { isProviderConfigurationError } from "@/lib/chat/providers/azure-openai";
import { logChatEvent } from "@/lib/observability/logger";

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const startedAt = Date.now();

  try {
    const json = await request.json();
    const parsed = chatRequestSchema.safeParse(json);

    if (!parsed.success) {
      logChatEvent({
        event: "chat.request.failed",
        requestId,
        latencyMs: Date.now() - startedAt,
        status: 400,
        errorCategory: "invalid_request",
      });

      return NextResponse.json(
        {
          requestId,
          error: "Invalid chat request.",
        },
        { status: 400 },
      );
    }

    const response = await draftConsultantResponse(parsed.data);
    const latencyMs = Date.now() - startedAt;
    const trace = {
      ...response.trace,
      requestId,
      latencyMs,
    };

    logChatEvent({
      event: "chat.request.completed",
      requestId,
      provider: response.provider,
      mode: response.mode,
      latencyMs,
      status: 200,
      retrievalResultCount: trace.retrievalResultCount,
      citationCount: trace.citationCount,
      confidence: response.confidence,
      safetyLevel: response.safetyLevel,
      guardrailStatus: response.guardrails.status,
      riskFlags: response.guardrails.riskFlags,
      requiresHumanReview: response.guardrails.requiresHumanReview,
    });

    return NextResponse.json({
      requestId,
      message: {
        id: crypto.randomUUID(),
        role: "assistant",
        author: "Agent365",
        content: response.content,
        citations: response.citations,
        mode: response.mode,
        confidence: response.confidence,
        requiresCitation: response.requiresCitation,
        safetyLevel: response.safetyLevel,
        guardrailStatus: response.guardrails.status,
        riskFlags: response.guardrails.riskFlags,
        requiresHumanReview: response.guardrails.requiresHumanReview,
        followUpQuestions: response.followUpQuestions,
        contractVersion: response.contractVersion,
        provider: response.provider,
        trace,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    const latencyMs = Date.now() - startedAt;

    if (isProviderConfigurationError(error)) {
      logChatEvent({
        event: "chat.request.failed",
        requestId,
        latencyMs,
        status: 503,
        errorCategory: "provider_configuration",
      });

      return NextResponse.json(
        {
          requestId,
          error: error.message,
        },
        { status: 503 },
      );
    }

    logChatEvent({
      event: "chat.request.failed",
      requestId,
      latencyMs,
      status: 500,
      errorCategory: "unhandled",
    });

    return NextResponse.json(
      {
        requestId,
        error: "The chat service could not process this request.",
      },
      { status: 500 },
    );
  }
}
