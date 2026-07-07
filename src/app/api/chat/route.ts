import { NextResponse } from "next/server";

import { chatRequestSchema } from "@/lib/chat/contracts";
import { draftConsultantResponse } from "@/lib/chat/consultant";

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();

  try {
    const json = await request.json();
    const parsed = chatRequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          requestId,
          error: "Invalid chat request.",
        },
        { status: 400 },
      );
    }

    const response = draftConsultantResponse(parsed.data);

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
        followUpQuestions: response.followUpQuestions,
        contractVersion: response.contractVersion,
        createdAt: new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json(
      {
        requestId,
        error: "The chat service could not process this request.",
      },
      { status: 500 },
    );
  }
}
