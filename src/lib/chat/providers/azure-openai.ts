import { chatContractVersion } from "@/lib/chat/contracts";
import type { ConsultantMode, SafetyLevel } from "@/lib/chat/types";
import { citationsFromRetrieval } from "@/lib/retrieval/citations";
import { retrieveLocalKnowledge } from "@/lib/retrieval/retriever";
import { traceFromRetrieval } from "@/lib/retrieval/trace";
import type { RetrievalResult } from "@/lib/retrieval/types";
import { classifyInputSafety } from "@/lib/safety/guardrails";

import type {
  ChatAnswerProvider,
  DraftConsultantResponseInput,
} from "./types";

type AzureOpenAiConfig = {
  endpoint?: string;
  deployment?: string;
  apiKey?: string;
  apiVersion: string;
};

type ConfiguredAzureOpenAiConfig = {
  endpoint: string;
  deployment: string;
  apiKey: string;
  apiVersion: string;
};

type AzureChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type AzureChatCompletionsResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

export const azureOpenAiChatProvider: ChatAnswerProvider = {
  id: "azure-openai",
  async draftResponse(input) {
    const config = getAzureOpenAiConfig();

    if (!isAzureOpenAiConfigured(config)) {
      throw new ChatProviderConfigurationError(
        "Azure OpenAI provider requires AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_DEPLOYMENT, and AZURE_OPENAI_API_KEY.",
      );
    }

    const guardrails = classifyInputSafety({
      message: input.message,
      mode: input.mode,
    });
    const retrievalResults = retrieveLocalKnowledge({
      query: input.message,
      mode: input.mode,
    });
    const citations = citationsFromRetrieval(retrievalResults);
    const safetyLevel = getSafetyLevel({
      mode: input.mode,
      hasGuardrailRisk: guardrails.status !== "pass",
    });
    const confidence = getConfidence(retrievalResults.length);
    const content = await callAzureOpenAiChatCompletions(
      config,
      buildMessages(input, retrievalResults),
    );

    return {
      content,
      citations,
      retrievalResults,
      mode: input.mode,
      confidence,
      requiresCitation: true,
      safetyLevel,
      guardrails,
      followUpQuestions: followUpQuestionsByMode[input.mode],
      contractVersion: chatContractVersion,
      provider: "azure-openai",
      trace: {
        provider: "azure-openai",
        mode: input.mode,
        retrievalResultCount: retrievalResults.length,
        citationCount: citations.length,
        confidence,
        safetyLevel,
        guardrailStatus: guardrails.status,
        riskFlags: guardrails.riskFlags,
        requiresHumanReview: guardrails.requiresHumanReview,
        retrieval: traceFromRetrieval(retrievalResults),
      },
    };
  },
};

export class ChatProviderConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ChatProviderConfigurationError";
  }
}

export class ChatProviderExecutionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ChatProviderExecutionError";
  }
}

export function getAzureOpenAiConfig(): AzureOpenAiConfig {
  return {
    endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    deployment: process.env.AZURE_OPENAI_DEPLOYMENT,
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    apiVersion: process.env.AZURE_OPENAI_API_VERSION ?? "2024-10-21",
  };
}

export function isAzureOpenAiConfigured(
  config = getAzureOpenAiConfig(),
): config is ConfiguredAzureOpenAiConfig {
  return Boolean(config.endpoint && config.deployment && config.apiKey);
}

export function isProviderConfigurationError(error: unknown): error is ChatProviderConfigurationError {
  return error instanceof ChatProviderConfigurationError;
}

export function isProviderExecutionError(error: unknown): error is ChatProviderExecutionError {
  return error instanceof ChatProviderExecutionError;
}

function buildMessages(
  input: DraftConsultantResponseInput,
  retrievalResults: RetrievalResult[],
): AzureChatMessage[] {
  const conversation = (input.messages ?? [])
    .slice(-12)
    .map((message) => ({
      role: message.role,
      content: message.content,
    }));

  const hasLatestUserMessage = conversation.some(
    (message) => message.role === "user" && message.content === input.message,
  );

  return [
    {
      role: "system",
      content:
        "You are Agent365, a helpful Microsoft-first AI assistant. Answer naturally and concisely. Ask clarifying questions when needed. Do not claim access to private tenant data unless the user provides it in the conversation.",
    },
    {
      role: "system",
      content: formatGroundingInstructions(retrievalResults),
    },
    ...conversation,
    ...(hasLatestUserMessage
      ? []
      : [
          {
            role: "user" as const,
            content: input.message,
          },
        ]),
  ];
}

function formatGroundingInstructions(retrievalResults: RetrievalResult[]): string {
  if (retrievalResults.length === 0) {
    return [
      "No trusted grounding sources matched this request.",
      "Do not invent citations. If factual Microsoft guidance is needed, state that source validation is required and ask focused follow-up questions.",
    ].join(" ");
  }

  const sourceLines = retrievalResults
    .map(({ source }, index) =>
      [
        `[${index + 1}] ${source.title}`,
        `Source family: ${source.source}.`,
        `Product: ${source.product}.`,
        `Scenario: ${source.scenario}.`,
        `Sensitivity: ${source.sensitivity}.`,
        `Grounding: ${source.content}`,
      ].join(" "),
    )
    .join("\n");

  return [
    "Use the trusted grounding sources below when they are relevant.",
    "Cite source titles inline for factual Microsoft or implementation claims, and do not cite sources that are not listed.",
    "Separate confirmed guidance from assumptions. If the sources are insufficient, say what must be validated next.",
    "",
    sourceLines,
  ].join("\n");
}

function getConfidence(retrievalResultCount: number): number {
  if (retrievalResultCount === 0) {
    return 0.55;
  }

  return Math.min(0.78, 0.64 + retrievalResultCount * 0.04);
}

function getSafetyLevel({
  mode,
  hasGuardrailRisk,
}: {
  mode: ConsultantMode;
  hasGuardrailRisk: boolean;
}): SafetyLevel {
  if (hasGuardrailRisk || mode === "security") {
    return "high";
  }

  if (mode === "licensing") {
    return "sensitive";
  }

  return "standard";
}

const followUpQuestionsByMode: Record<ConsultantMode, string[]> = {
  architect: [
    "Which Microsoft workloads and channels are in the first production slice?",
    "Which sources must be treated as authoritative for citations?",
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

async function callAzureOpenAiChatCompletions(
  config: ConfiguredAzureOpenAiConfig,
  messages: AzureChatMessage[],
) {
  const endpoint = config.endpoint.replace(/\/$/, "");
  const deployment = encodeURIComponent(config.deployment);
  const apiVersion = encodeURIComponent(config.apiVersion);
  const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": config.apiKey,
    },
    body: JSON.stringify({
      messages,
      temperature: 0.3,
      max_completion_tokens: 900,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new ChatProviderExecutionError(
      `Azure OpenAI request failed with ${response.status}: ${errorText.slice(0, 300)}`,
    );
  }

  const payload = (await response.json()) as AzureChatCompletionsResponse;
  const content = payload.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new ChatProviderExecutionError("Azure OpenAI response did not include assistant content.");
  }

  return content;
}
