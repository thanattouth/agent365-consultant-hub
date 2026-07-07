import { chatContractVersion } from "./contracts";
import { consultantModeById } from "./modes";
import type { Citation, ConsultantMode, SafetyLevel } from "./types";

type DraftConsultantResponseInput = {
  message: string;
  mode: ConsultantMode;
};

type DraftConsultantResponse = {
  content: string;
  citations: Citation[];
  mode: ConsultantMode;
  confidence: number;
  requiresCitation: boolean;
  safetyLevel: SafetyLevel;
  followUpQuestions: string[];
  contractVersion: string;
};

export function draftConsultantResponse({
  message,
  mode,
}: DraftConsultantResponseInput): DraftConsultantResponse {
  const normalizedMessage = message.trim();
  const modeDefinition = consultantModeById[mode];
  const modeGuidance = responseGuidanceByMode[mode];

  return {
    content:
      `I will handle this as the ${modeDefinition.consultantLabel} consultant path. ` +
      `${modeDefinition.routingRule} ` +
      `${modeGuidance} ` +
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
    mode,
    confidence: confidenceByMode[mode],
    requiresCitation: true,
    safetyLevel: safetyLevelByMode[mode],
    followUpQuestions: followUpQuestionsByMode[mode],
    contractVersion: chatContractVersion,
  };
}

const responseGuidanceByMode: Record<ConsultantMode, string> = {
  architect:
    "The answer should recommend a small verifiable architecture slice, include Azure AI Search or an equivalent retrieval layer when RAG is involved, require citations for factual claims, and surface security plus evaluation follow-up.",
  admin:
    "The answer should ask for tenant and pilot scope when needed, describe admin setup steps, mention permissions and rollout checks, and include rollback or support considerations.",
  security:
    "The answer should mention Entra ID and least privilege, require permission trimming, address prompt injection and data leakage, and include audit, retention, and escalation considerations.",
  licensing:
    "The answer should separate assumptions from facts, ask for license validation details, avoid definitive commercial claims without sources, and recommend checking current Microsoft licensing documentation.",
};

const confidenceByMode: Record<ConsultantMode, number> = {
  architect: 0.72,
  admin: 0.68,
  security: 0.66,
  licensing: 0.58,
};

const safetyLevelByMode: Record<ConsultantMode, SafetyLevel> = {
  architect: "standard",
  admin: "standard",
  security: "high",
  licensing: "sensitive",
};

const followUpQuestionsByMode: Record<ConsultantMode, string[]> = {
  architect: [
    "Which Microsoft workloads and channels are in the first production slice?",
    "Which sources must be cited in the first benchmark set?",
  ],
  admin: [
    "Which tenant, pilot group, and Teams app distribution path should be assumed?",
    "Who owns rollout support and rollback approval?",
  ],
  security: [
    "Which data classifications and SharePoint sites are in scope?",
    "What retention, audit, and escalation requirements apply?",
  ],
  licensing: [
    "Which SKUs and user groups should be validated?",
    "Which current Microsoft licensing source should be treated as authoritative?",
  ],
};
