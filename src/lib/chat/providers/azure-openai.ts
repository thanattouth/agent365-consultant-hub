import { localChatProvider } from "./local";
import type {
  ChatAnswerProvider,
  DraftConsultantResponse,
  DraftConsultantResponseInput,
} from "./types";

type AzureOpenAiConfig = {
  endpoint?: string;
  deployment?: string;
  apiKey?: string;
};

export const azureOpenAiChatProvider: ChatAnswerProvider = {
  id: "azure-openai",
  async draftResponse(input) {
    const config = getAzureOpenAiConfig();

    if (!isAzureOpenAiConfigured(config)) {
      throw new ChatProviderConfigurationError(
        "Azure OpenAI provider was selected, but AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_DEPLOYMENT are not configured.",
      );
    }

    const fallbackResponse = await localChatProvider.draftResponse(input);

    return {
      ...fallbackResponse,
      content:
        "Azure OpenAI provider is configured for routing, but live model execution is not implemented in this scaffold yet.\n\n" +
        fallbackResponse.content,
      provider: "azure-openai",
    };
  },
};

export class ChatProviderConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ChatProviderConfigurationError";
  }
}

export function getAzureOpenAiConfig(): AzureOpenAiConfig {
  return {
    endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    deployment: process.env.AZURE_OPENAI_DEPLOYMENT,
    apiKey: process.env.AZURE_OPENAI_API_KEY,
  };
}

export function isAzureOpenAiConfigured(config = getAzureOpenAiConfig()) {
  return Boolean(config.endpoint && config.deployment);
}

export function isProviderConfigurationError(error: unknown): error is ChatProviderConfigurationError {
  return error instanceof ChatProviderConfigurationError;
}

export type AzureOpenAiDraftResponse = DraftConsultantResponse;
export type AzureOpenAiDraftInput = DraftConsultantResponseInput;
