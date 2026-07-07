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

## Project Charter

Read `SKILL.md` before meaningful project work. It defines the delivery phases, production-grade scorecard, engineering rules, debugging principles, security principles, work logging policy, and Conventional Commit policy.

## Chat Provider

The default answer provider is `azure-openai`. Configure `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_DEPLOYMENT`, and `AZURE_OPENAI_API_KEY` for normal chat. The `local` provider is retained for deterministic development/evaluation only.
