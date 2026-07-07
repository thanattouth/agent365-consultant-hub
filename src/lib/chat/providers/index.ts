import { azureOpenAiChatProvider } from "./azure-openai";
import { localChatProvider } from "./local";
import type { ChatAnswerProvider, ChatProviderId } from "./types";

export function getChatAnswerProvider(): ChatAnswerProvider {
  const providerId = getConfiguredProviderId();

  if (providerId === "azure-openai") {
    return azureOpenAiChatProvider;
  }

  return localChatProvider;
}

export function getConfiguredProviderId(): ChatProviderId {
  const configuredProvider = process.env.AGENT365_CHAT_PROVIDER;

  if (configuredProvider === "local" || configuredProvider === "azure-openai") {
    return configuredProvider;
  }

  return "azure-openai";
}

export type { ChatAnswerProvider, ChatProviderId } from "./types";
