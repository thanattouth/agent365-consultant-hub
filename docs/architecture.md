# Architecture Notes

## Current Slice

The current repository slice is a Next.js and TypeScript chat application with a typed API boundary, provider abstraction, deterministic local evaluation path, and Azure OpenAI as the normal runtime provider when configured.

The live Azure OpenAI path now runs the local retrieval adapter before model execution. Matched trusted source snippets are passed into the model as grounding context, and the same sources are returned through the response contract as citations and retrieval trace metadata. This keeps the live path citation-aware until Azure AI Search replaces the local adapter.

The local provider remains available for deterministic development, benchmark stability, red-team checks, and debugging.

## Target Direction

- Frontend: Next.js App Router, TypeScript, accessible React components, CSS design system.
- API boundary: Next.js route handlers for chat request validation, provider routing, trace metadata, guardrail metadata, and sanitized error handling.
- Agent runtime: Microsoft Foundry Agent Service where managed orchestration fits.
- Model layer: Azure OpenAI today, with a future path to Microsoft Foundry Models where appropriate.
- Retrieval: Local deterministic retrieval today, with Azure AI Search as the production citation-aware RAG target.
- Identity: Microsoft Entra ID.
- State: Cosmos DB for conversations and agent state.
- Storage: Azure Storage for uploads and indexed source files.
- Safety: Deterministic guardrail metadata today, with Azure AI Content Safety planned for prompt shields, moderation, groundedness, protected material, and task adherence.
- Observability: Structured server logs and response trace metadata today, with Azure Monitor, Application Insights, and OpenTelemetry-friendly trace boundaries planned.

## Boundary Decisions

- UI components do not call Azure services directly.
- Chat requests pass through an API boundary so auth, tracing, safety, and policy checks have one control point.
- Provider failures are separated from application failures: configuration errors return sanitized `503` responses, and provider execution errors return sanitized `502` responses.
- Retrieval output shape is shared across local and Azure provider paths: ranked sources, citations, sensitivity, scores, matched keywords, and trace metadata.
- Prompts, retrieval settings, and evaluation datasets should be versioned as product artifacts.
- Tenant and user context must be explicit; avoid hidden global state.

## Next Architecture Work

- Replace the local retrieval adapter with Azure AI Search while preserving citation and trace contracts.
- Add managed identity support for Azure OpenAI or the selected Microsoft model service.
- Add provider-specific live integration tests in a controlled environment.
- Add policy-based hard blocks and human escalation for selected guardrail outcomes.
- Export structured logs and metrics to Application Insights or Azure Monitor.
