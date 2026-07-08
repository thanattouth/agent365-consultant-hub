import type { ConsultantMode } from "@/lib/chat/types";

import type {
  KnowledgeSensitivity,
  KnowledgeSource,
  RetrievalInput,
  RetrievalResult,
} from "./types";

type AzureAiSearchConfig = {
  endpoint?: string;
  indexName?: string;
  apiKey?: string;
  apiVersion: string;
};

type ConfiguredAzureAiSearchConfig = {
  endpoint: string;
  indexName: string;
  apiKey: string;
  apiVersion: string;
};

type AzureAiSearchDocument = {
  "@search.score"?: number;
  id?: unknown;
  title?: unknown;
  source?: unknown;
  url?: unknown;
  product?: unknown;
  scenario?: unknown;
  sensitivity?: unknown;
  modes?: unknown;
  keywords?: unknown;
  content?: unknown;
};

type AzureAiSearchResponse = {
  value?: AzureAiSearchDocument[];
};

export class RetrievalConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RetrievalConfigurationError";
  }
}

export class RetrievalExecutionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RetrievalExecutionError";
  }
}

export async function retrieveAzureAiSearchKnowledge({
  query,
  mode,
  limit = 3,
}: RetrievalInput): Promise<RetrievalResult[]> {
  const config = getAzureAiSearchConfig();

  if (!isAzureAiSearchConfigured(config)) {
    throw new RetrievalConfigurationError(
      "Azure AI Search retrieval requires AZURE_AI_SEARCH_ENDPOINT, AZURE_AI_SEARCH_INDEX, and AZURE_AI_SEARCH_API_KEY.",
    );
  }

  const payload = await callAzureAiSearch(config, {
    query,
    limit,
  });

  return mapAzureAiSearchResults({
    documents: payload.value ?? [],
    mode,
    query,
  });
}

export function getAzureAiSearchConfig(): AzureAiSearchConfig {
  return {
    endpoint: process.env.AZURE_AI_SEARCH_ENDPOINT,
    indexName: process.env.AZURE_AI_SEARCH_INDEX,
    apiKey: process.env.AZURE_AI_SEARCH_API_KEY,
    apiVersion: process.env.AZURE_AI_SEARCH_API_VERSION ?? "2024-07-01",
  };
}

export function isAzureAiSearchConfigured(
  config = getAzureAiSearchConfig(),
): config is ConfiguredAzureAiSearchConfig {
  return Boolean(config.endpoint && config.indexName && config.apiKey);
}

async function callAzureAiSearch(
  config: ConfiguredAzureAiSearchConfig,
  {
    query,
    limit,
  }: {
    query: string;
    limit: number;
  },
): Promise<AzureAiSearchResponse> {
  const endpoint = config.endpoint.replace(/\/$/, "");
  const indexName = encodeURIComponent(config.indexName);
  const apiVersion = encodeURIComponent(config.apiVersion);
  const url = `${endpoint}/indexes('${indexName}')/docs/search.post.search?api-version=${apiVersion}`;

  let response: Response;

  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": config.apiKey,
      },
      body: JSON.stringify({
        search: query,
        queryType: "simple",
        searchMode: "any",
        top: limit,
        select: "id,title,source,url,product,scenario,sensitivity,modes,keywords,content",
      }),
    });
  } catch {
    throw new RetrievalExecutionError("Azure AI Search request could not be completed.");
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new RetrievalExecutionError(
      `Azure AI Search request failed with ${response.status}: ${errorText.slice(0, 300)}`,
    );
  }

  try {
    return (await response.json()) as AzureAiSearchResponse;
  } catch {
    throw new RetrievalExecutionError("Azure AI Search response was not valid JSON.");
  }
}

function mapAzureAiSearchResults({
  documents,
  mode,
  query,
}: {
  documents: AzureAiSearchDocument[];
  mode: ConsultantMode;
  query: string;
}): RetrievalResult[] {
  return documents.map((document, index) => {
    const keywords = toStringArray(document.keywords);
    const modes = toModeArray(document.modes, mode);
    const source: KnowledgeSource = {
      id: toNonEmptyString(document.id, `azure-search-${index + 1}`),
      title: toNonEmptyString(document.title, `Azure AI Search result ${index + 1}`),
      source: toNonEmptyString(document.source, "Azure AI Search"),
      url: toOptionalString(document.url),
      product: toNonEmptyString(document.product, "Microsoft"),
      scenario: toNonEmptyString(document.scenario, "retrieval"),
      sensitivity: toSensitivity(document.sensitivity),
      modes,
      keywords,
      content: toNonEmptyString(document.content, ""),
    };

    return {
      source,
      score: typeof document["@search.score"] === "number" ? document["@search.score"] : 0,
      matchedKeywords: findMatchedKeywords({
        query,
        keywords,
      }),
    };
  });
}

function toNonEmptyString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function toOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function toSensitivity(value: unknown): KnowledgeSensitivity {
  if (value === "public" || value === "internal" || value === "confidential") {
    return value;
  }

  return "internal";
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  }

  if (typeof value === "string" && value.trim()) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function toModeArray(value: unknown, fallbackMode: ConsultantMode): ConsultantMode[] {
  const modes = toStringArray(value).filter((item): item is ConsultantMode =>
    ["architect", "admin", "security", "licensing"].includes(item),
  );

  return modes.length > 0 ? modes : [fallbackMode];
}

function findMatchedKeywords({
  query,
  keywords,
}: {
  query: string;
  keywords: string[];
}): string[] {
  const normalizedQuery = query.toLowerCase();

  return keywords.filter((keyword) => normalizedQuery.includes(keyword.toLowerCase()));
}
