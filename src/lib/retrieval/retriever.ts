import type { RetrievalInput, RetrievalResult } from "./types";
import { localKnowledgeBase } from "./knowledge-base";

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
