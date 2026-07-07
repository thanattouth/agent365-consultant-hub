import { NextResponse } from "next/server";
import { z } from "zod";

import { draftConsultantResponse } from "@/lib/chat/consultant";

const chatRequestSchema = z.object({
  message: z.string().trim().min(1).max(4000),
  mode: z.enum(["architect", "admin", "security", "licensing"]),
});

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
