# Chat Providers

## Purpose

Agent365 can now route answer generation through a provider abstraction. This keeps the current deterministic local answer path working while preparing the system for Azure OpenAI.

## Providers

### Local

Provider id: `local`

The local provider composes deterministic grounded answers from:

- consultant mode routing metadata
- local retrieval results
- mode-specific answer plans
- response contract metadata

Use this provider for development, benchmark stability, and debugging.

### Azure OpenAI

Provider id: `azure-openai`

The Azure provider is config-guarded and intentionally scaffolded. It validates required environment variables and returns a clear service error when selected without configuration. Live model execution should be implemented behind this provider boundary in the next integration phase.

Required configuration:

```bash
AGENT365_CHAT_PROVIDER=azure-openai
AZURE_OPENAI_ENDPOINT=
AZURE_OPENAI_DEPLOYMENT=
```

`AZURE_OPENAI_API_KEY` is available for local development, but production should prefer managed identity where possible.

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

- Add the Azure SDK or REST adapter inside `src/lib/chat/providers/azure-openai.ts`.
- Keep retrieval and citations outside the provider where possible so grounding remains observable.
- Add provider-specific benchmark cases before enabling Azure responses by default.
