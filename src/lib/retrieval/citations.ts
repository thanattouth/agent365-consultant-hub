import type { Citation } from "@/lib/chat/types";

import type { RetrievalResult } from "./types";

export function citationsFromRetrieval(results: RetrievalResult[]): Citation[] {
  return results.map(({ source }) => ({
    title: source.title,
    source: source.source,
    url: source.url,
  }));
}
