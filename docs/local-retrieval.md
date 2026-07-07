# Local Retrieval Foundation

## Purpose

The local retriever is the first retrieval adapter for Agent365. It makes the chatbot grounded enough to test citations and response contracts before Azure AI Search is connected.

## Current Design

- `src/lib/retrieval/types.ts` defines the knowledge source schema.
- `src/lib/retrieval/knowledge-base.ts` contains small Microsoft-focused seed sources.
- `src/lib/retrieval/retriever.ts` scores sources deterministically by mode and keyword matches.
- `src/lib/retrieval/citations.ts` converts retrieval results into chat citations.
- The Azure OpenAI provider also uses this adapter as a pre-model grounding step until Azure AI Search is connected.

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

This adapter is intentionally simple. It now supports both deterministic local responses and live Azure OpenAI pre-grounding. Future Azure AI Search work should preserve the same conceptual output shape: ranked sources, scores, matched signals, sensitivity, and citation metadata.

## Guardrails

- Public and internal knowledge are separated by `sensitivity`.
- Tenant-private sources must later enforce permission trimming before retrieval results reach the model.
- Benchmark cases should assert expected citations so retrieval drift is visible early.
