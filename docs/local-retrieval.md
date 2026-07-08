# Retrieval Foundation

## Purpose

The retrieval layer gives Agent365 a stable grounding contract for citations and trace metadata. The local retriever remains the deterministic development and evaluation adapter. Azure AI Search is now available as an opt-in live retrieval adapter.

## Current Design

- `src/lib/retrieval/types.ts` defines the knowledge source schema.
- `src/lib/retrieval/knowledge-base.ts` contains small Microsoft-focused seed sources.
- `src/lib/retrieval/retriever.ts` selects the configured retrieval provider and keeps the local deterministic scorer.
- `src/lib/retrieval/azure-ai-search.ts` calls Azure AI Search over REST and maps search results back into the shared retrieval result shape.
- `src/lib/retrieval/citations.ts` converts retrieval results into chat citations.
- The Azure OpenAI provider uses the configured retrieval provider as a pre-model grounding step.

## Provider Selection

Default provider:

```bash
AGENT365_RETRIEVAL_PROVIDER=local
```

Azure AI Search provider:

```bash
AGENT365_RETRIEVAL_PROVIDER=azure-ai-search
AZURE_AI_SEARCH_ENDPOINT=
AZURE_AI_SEARCH_INDEX=
AZURE_AI_SEARCH_API_KEY=
AZURE_AI_SEARCH_API_VERSION=2024-07-01
```

The Azure adapter uses the Search Documents POST REST API and requests the fields needed to preserve Agent365 citation and trace metadata.

Create or update the expected index schema:

```bash
npm run setup:azure-search-index
```

Seed starter knowledge into the configured index:

```bash
npm run seed:azure-search
```

## Knowledge Source Fields

- `title`: user-facing citation title.
- `source`: source family, such as Microsoft Learn or Project policy.
- `url`: optional public reference URL.
- `product`: Microsoft product or platform area.
- `scenario`: scenario taxonomy.
- `sensitivity`: public, internal, or confidential.
- `modes`: consultant modes where the source is relevant.
- `keywords`: deterministic retrieval hints for the local adapter.
- `content`: short grounding text for the mock response path.

## Production Path

The local adapter is intentionally simple. Azure AI Search is the first production retrieval adapter and preserves the same conceptual output shape: ranked sources, scores, matched signals, sensitivity, and citation metadata.

## Guardrails

- Public and internal knowledge are separated by `sensitivity`.
- Tenant-private sources must later enforce permission trimming before retrieval results reach the model.
- Benchmark cases should assert expected citations so retrieval drift is visible early.
