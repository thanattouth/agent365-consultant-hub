import { chatContractVersion } from "@/lib/chat/contracts";
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
    const content = await callAzureOpenAiChatCompletions(config, buildMessages(input));

    return {
      content,
      citations: [],
      retrievalResults: [],
      mode: input.mode,
      confidence: 0.7,
      requiresCitation: false,
      safetyLevel: guardrails.status === "pass" ? "standard" : "sensitive",
      guardrails,
      followUpQuestions: [],
      contractVersion: chatContractVersion,
      provider: "azure-openai",
      trace: {
        provider: "azure-openai",
        mode: input.mode,
        retrievalResultCount: 0,
        citationCount: 0,
        confidence: 0.7,
        safetyLevel: guardrails.status === "pass" ? "standard" : "sensitive",
        guardrailStatus: guardrails.status,
        riskFlags: guardrails.riskFlags,
        requiresHumanReview: guardrails.requiresHumanReview,
        retrieval: [],
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

function buildMessages(input: DraftConsultantResponseInput): AzureChatMessage[] {
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
