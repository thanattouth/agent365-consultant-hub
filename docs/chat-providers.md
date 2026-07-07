# Chat Providers

## Purpose

Agent365 routes answer generation through a provider abstraction. The normal runtime path is Azure OpenAI; the deterministic local path is retained for development and evaluation.

## Providers

### Local

Provider id: `local`

The local provider composes deterministic grounded answers from:

- consultant mode routing metadata
- local retrieval results
- mode-specific answer plans
- response contract metadata

Use this provider only for development, benchmark stability, and debugging:

```bash
AGENT365_CHAT_PROVIDER=local npm run dev
```

### Azure OpenAI

Provider id: `azure-openai`

The Azure provider calls Azure OpenAI chat completions over REST. It validates required environment variables and returns a clear service error when selected without configuration.

Before the model call, the provider runs the local retrieval adapter and injects matched trusted source snippets as grounding instructions. The response contract returns those retrieval results as citations and trace metadata. This keeps the live Azure path citation-aware while Azure AI Search is still a future production adapter.

Required configuration:

```bash
AGENT365_CHAT_PROVIDER=azure-openai
AZURE_OPENAI_ENDPOINT=
AZURE_OPENAI_DEPLOYMENT=
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_API_VERSION=2024-10-21
```

`AZURE_OPENAI_API_KEY` is available for local development. Production should move toward managed identity or an approved secret flow where possible.

Newer Azure OpenAI chat deployments may reject `max_tokens`; the provider uses `max_completion_tokens` for compatibility with those models.

## Contract

Every assistant response includes:

- `contractVersion`
- `provider`
- `mode`
- `confidence`
- `requiresCitation`
- `safetyLevel`
- `followUpQuestions`
- `citations`

## Next Steps

- Add managed identity support.
- Add provider-specific live integration tests in a controlled environment.
- Replace the local retrieval adapter with Azure AI Search while preserving the citation and trace output shape.
