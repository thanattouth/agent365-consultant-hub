import { chatContractVersion } from "./contracts";
import { consultantModeById } from "./modes";
import type { Citation, ConsultantMode, SafetyLevel } from "./types";
import { citationsFromRetrieval } from "@/lib/retrieval/citations";
import { retrieveLocalKnowledge } from "@/lib/retrieval/retriever";
import type { RetrievalResult } from "@/lib/retrieval/types";

type DraftConsultantResponseInput = {
  message: string;
  mode: ConsultantMode;
};

type DraftConsultantResponse = {
  content: string;
  citations: Citation[];
  retrievalResults: RetrievalResult[];
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
  const retrievalResults = retrieveLocalKnowledge({
    query: normalizedMessage,
    mode,
  });

  return {
    content: composeGroundedAnswer({
      message: normalizedMessage,
      mode,
      consultantLabel: modeDefinition.consultantLabel,
      routingRule: modeDefinition.routingRule,
      retrievalResults,
    }),
    citations: citationsFromRetrieval(retrievalResults),
    retrievalResults,
    mode,
    confidence: confidenceByMode[mode],
    requiresCitation: true,
    safetyLevel: safetyLevelByMode[mode],
    followUpQuestions: followUpQuestionsByMode[mode],
    contractVersion: chatContractVersion,
  };
}

type ComposeGroundedAnswerInput = {
  message: string;
  mode: ConsultantMode;
  consultantLabel: string;
  routingRule: string;
  retrievalResults: RetrievalResult[];
};

function composeGroundedAnswer({
  message,
  mode,
  consultantLabel,
  routingRule,
  retrievalResults,
}: ComposeGroundedAnswerInput): string {
  const evidenceLines = formatEvidenceLines(retrievalResults);
  const responsePlan = responsePlanByMode[mode];
  const followUps = followUpQuestionsByMode[mode].map((question) => `- ${question}`).join("\n");

  return [
    `I will handle this as the ${consultantLabel} consultant path.`,
    routingRule,
    "",
    "Grounded answer",
    responsePlan.summary,
    "",
    "Recommended next steps",
    responsePlan.steps.map((step, index) => `${index + 1}. ${step}`).join("\n"),
    "",
    "Evidence used",
    evidenceLines,
    "",
    "Production checks",
    responsePlan.productionChecks.map((check) => `- ${check}`).join("\n"),
    "",
    "Follow-up questions",
    followUps,
    "",
    `Original request: "${message}"`,
  ].join("\n");
}

function formatEvidenceLines(results: RetrievalResult[]): string {
  if (results.length === 0) {
    return "- No local knowledge source matched strongly yet. Treat this as planning guidance until retrieval coverage is expanded.";
  }

  return results
    .map(({ source }) => `- ${source.title}: ${source.content}`)
    .join("\n");
}

const responsePlanByMode: Record<
  ConsultantMode,
  {
    summary: string;
    steps: string[];
    productionChecks: string[];
  }
> = {
  architect: {
    summary:
      "Start with a small verifiable architecture slice that uses Azure AI Search for RAG grounding, keeps Microsoft Foundry or Azure OpenAI behind a clear API boundary, and requires citations for factual claims. This should surface security plus evaluation follow-up before any production rollout.",
    steps: [
      "Define the first Microsoft workload, allowed knowledge sources, and citation rules.",
      "Create an ingestion path into Azure AI Search or keep the current local retrieval adapter until cloud resources are ready.",
      "Route chat requests through the API contract so mode, confidence, safety level, and citations are observable.",
      "Add benchmark cases for architecture quality, groundedness, latency, and failure behavior.",
    ],
    productionChecks: [
      "Confirm source ownership and freshness.",
      "Measure groundedness before connecting more tools.",
      "Keep rollback and human escalation paths visible.",
    ],
  },
  admin: {
    summary:
      "Treat this as an operational rollout task: capture tenant and pilot scope, define admin setup steps, validate permissions and rollout checks, then document rollback or support considerations before broad deployment.",
    steps: [
      "Identify pilot users, tenant constraints, and the target channel such as Microsoft Teams.",
      "List required admin permissions and app distribution steps.",
      "Define support ownership, success metrics, and rollback criteria.",
      "Run a pilot checklist before expanding the audience.",
    ],
    productionChecks: [
      "Confirm admin roles are least privilege.",
      "Record rollout approvals and operational owners.",
      "Validate monitoring and user feedback capture.",
    ],
  },
  security: {
    summary:
      "Handle this as a high-risk production control path: use Entra ID and least privilege, require permission trimming for tenant-private data, address prompt injection and data leakage, and include audit, retention, and escalation decisions.",
    steps: [
      "Classify the data sources and separate public, internal, and confidential knowledge.",
      "Enforce user identity and permission trimming before retrieved content reaches the answer path.",
      "Add prompt-injection, data leakage, and unsafe-content tests to the benchmark set.",
      "Define audit logs, retention windows, and escalation rules for sensitive answers.",
    ],
    productionChecks: [
      "Block retrieval that bypasses source permissions.",
      "Redact secrets and private content in telemetry.",
      "Review high-risk responses before production rollout.",
    ],
  },
  licensing: {
    summary:
      "Treat licensing answers as assumption-driven until validated: separate assumptions from facts, ask for license validation details, avoid definitive commercial claims without sources, and check current Microsoft licensing documentation before decisions.",
    steps: [
      "Capture the current SKU, user group, region, and workload assumptions.",
      "Map required capabilities to entitlement checks.",
      "Flag any commercial claim that needs a current Microsoft source.",
      "Produce a decision note with assumptions, validation questions, and unresolved risks.",
    ],
    productionChecks: [
      "Require current source validation for SKU claims.",
      "Escalate ambiguous commercial decisions.",
      "Keep customer-specific licensing context out of logs unless redacted.",
    ],
  },
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
