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

  if (configuredProvider === "azure-openai") {
    return configuredProvider;
  }

  return "local";
}

export type { ChatAnswerProvider, ChatProviderId } from "./types";
