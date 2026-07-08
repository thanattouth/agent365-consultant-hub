import type { RetrievalInput, RetrievalResult } from "./types";
import { retrieveAzureAiSearchKnowledge } from "./azure-ai-search";
import { localKnowledgeBase } from "./knowledge-base";

export type RetrievalProviderId = "local" | "azure-ai-search";

export async function retrieveKnowledge(input: RetrievalInput): Promise<RetrievalResult[]> {
  const providerId = getConfiguredRetrievalProviderId();

  if (providerId === "azure-ai-search") {
    return retrieveAzureAiSearchKnowledge(input);
  }

  return retrieveLocalKnowledge(input);
}

export function getConfiguredRetrievalProviderId(): RetrievalProviderId {
  const configuredProvider = process.env.AGENT365_RETRIEVAL_PROVIDER;

  if (configuredProvider === "azure-ai-search") {
    return "azure-ai-search";
  }

  return "local";
}

export function retrieveLocalKnowledge({
  query,
  mode,
  limit = 3,
}: RetrievalInput): RetrievalResult[] {
  const normalizedQuery = query.toLowerCase();

  return localKnowledgeBase
    .map((source) => {
      const matchedKeywords = source.keywords.filter((keyword) =>
        normalizedQuery.includes(keyword.toLowerCase()),
      );
      const modeScore = source.modes.includes(mode) ? 2 : 0;
      const keywordScore = matchedKeywords.length * 3;
      const titleScore = normalizedQuery.includes(source.product.toLowerCase()) ? 2 : 0;
      const score = modeScore + keywordScore + titleScore;

      return {
        source,
        score,
        matchedKeywords,
      };
    })
    .filter((result) => result.score > 0)
    .sort((left, right) => right.score - left.score || left.source.title.localeCompare(right.source.title))
    .slice(0, limit);
}
