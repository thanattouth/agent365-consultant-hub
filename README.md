# Agent365 Consultant Hub

Microsoft-first consultant chatbot hub targeting production-grade delivery.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Zod for API request validation
- Lucide React icons
- Microsoft-first target services: Microsoft Foundry, Azure OpenAI or Foundry Models, Azure AI Search, Entra ID, Azure AI Content Safety, Cosmos DB, Azure Monitor, Application Insights, Microsoft Graph, and Teams SDK

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality Checks

```bash
npm run lint
npm run typecheck
npm run build
```

Run the benchmark evaluation against a running local server:

```bash
AGENT365_CHAT_PROVIDER=local npm run dev
npm run eval:benchmark
```

The benchmark runner uses `http://127.0.0.1:3000` by default. Override with `AGENT365_EVAL_BASE_URL` when targeting another environment.

Run deterministic red-team guardrail checks:

```bash
npm run eval:red-team
```

Run a live Azure OpenAI smoke check against a running local server:

```bash
AGENT365_CHAT_PROVIDER=azure-openai npm run dev
npm run eval:azure-smoke
```

The Azure smoke runner validates provider routing, citation metadata, retrieval trace metadata, and basic response redaction checks.

Use Azure AI Search for grounding instead of the local retriever:

```bash
AGENT365_RETRIEVAL_PROVIDER=azure-ai-search
AZURE_AI_SEARCH_ENDPOINT=
AZURE_AI_SEARCH_INDEX=
AZURE_AI_SEARCH_API_KEY=
AZURE_AI_SEARCH_API_VERSION=2024-07-01
```

The first Azure AI Search adapter expects retrievable fields named `id`, `title`, `source`, `url`, `product`, `scenario`, `sensitivity`, `modes`, `keywords`, and `content`.

Create or update the Azure AI Search index schema:

```bash
npm run setup:azure-search-index
```

Azure AI Search does not allow some field attributes to be changed after an index exists. If setup reports that an existing field cannot be changed, create a new index name or keep the existing compatible schema.

Seed the starter knowledge documents into the configured Azure AI Search index:

```bash
npm run seed:azure-search
```

Seeding requires an Azure AI Search admin key. Query keys can search documents but cannot upload them.

Assert that a live smoke test used Azure AI Search, not local fallback:

```bash
AGENT365_EXPECT_RETRIEVAL_PROVIDER=azure-ai-search npm run eval:azure-smoke
```

## Project Charter

Read `SKILL.md` before meaningful project work. It defines the delivery phases, production-grade scorecard, engineering rules, debugging principles, security principles, work logging policy, and Conventional Commit policy.

## Chat Provider

The default answer provider is `azure-openai`. Configure `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_DEPLOYMENT`, and `AZURE_OPENAI_API_KEY` for normal chat. The `local` provider is retained for deterministic development/evaluation only.
