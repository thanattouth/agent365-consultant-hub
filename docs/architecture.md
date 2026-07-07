# Architecture Notes

## Current Slice

The current repository slice is a Next.js and TypeScript web shell with a mock consultant API. It is intentionally small so the product interface, domain contracts, and work patterns are clean before cloud dependencies are added.

## Target Direction

- Frontend: Next.js App Router, TypeScript, accessible React components, CSS design system.
- API boundary: Next.js route handlers for the first local slice, with a future path to dedicated service endpoints if needed.
- Agent runtime: Microsoft Foundry Agent Service where managed orchestration fits.
- Model layer: Azure OpenAI or Microsoft Foundry Models.
- Retrieval: Azure AI Search with citation-aware RAG.
- Identity: Microsoft Entra ID.
- State: Cosmos DB for conversations and agent state.
- Storage: Azure Storage for uploads and indexed source files.
- Safety: Azure AI Content Safety for prompt shields, moderation, groundedness, protected material, and task adherence.
- Observability: Azure Monitor, Application Insights, and OpenTelemetry-friendly trace boundaries.

## Boundary Decisions

- UI components do not call Azure services directly.
- Chat requests pass through an API boundary so auth, tracing, safety, and policy checks have one control point.
- Prompts, retrieval settings, and evaluation datasets should be versioned as product artifacts.
- Tenant and user context must be explicit; avoid hidden global state.

## Next Architecture Work

- Define the chat request and response contract for citations, tool calls, confidence, and safety status.
- Add a retrieval abstraction that can start local/mock and later bind to Azure AI Search.
- Add environment validation for Azure configuration.
- Add structured logging with request IDs and redaction rules.
