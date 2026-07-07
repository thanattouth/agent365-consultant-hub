import type { RetrievalResult, RetrievalTraceItem } from "./types";

export function traceFromRetrieval(results: RetrievalResult[]): RetrievalTraceItem[] {
  return results.map(({ source, score, matchedKeywords }) => ({
    id: source.id,
    title: source.title,
    source: source.source,
    product: source.product,
    scenario: source.scenario,
    sensitivity: source.sensitivity,
    score,
    matchedKeywords,
  }));
}
