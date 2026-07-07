import type { Citation, ConsultantMode } from "./types";

type DraftConsultantResponseInput = {
  message: string;
  mode: ConsultantMode;
};

type DraftConsultantResponse = {
  content: string;
  citations: Citation[];
};

export function draftConsultantResponse({
  message,
  mode,
}: DraftConsultantResponseInput): DraftConsultantResponse {
  const normalizedMessage = message.trim();
  const modeLabel = modeLabels[mode];

  return {
    content:
      `I will handle this as the ${modeLabel} consultant path. ` +
      `For production-grade work, I would first clarify scope, identify the Microsoft data sources involved, define safety and permission boundaries, then design the smallest verifiable implementation slice. ` +
      `Your request was: "${normalizedMessage}". The next concrete step is to turn this into an acceptance-tested task before connecting Azure services.`,
    citations: [
      {
        title: "Agent365 operating principles",
        source: "SKILL.md",
      },
      {
        title: "Production-grade scorecard",
        source: "SKILL.md",
      },
    ],
  };
}

const modeLabels: Record<ConsultantMode, string> = {
  architect: "solution architect",
  admin: "Microsoft administrator",
  security: "security and governance",
  licensing: "licensing",
};
