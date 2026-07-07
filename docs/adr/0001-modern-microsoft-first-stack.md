# ADR 0001: Modern Microsoft-First Stack

## Status

Accepted

## Context

Agent365 Consultant Hub needs to become a production-grade Microsoft consultant chatbot. The first implementation must support a polished web experience, clear API boundaries, future Teams integration, Azure-native AI services, observability, security, and maintainable delivery.

## Decision

Use a modern TypeScript-first application stack:

- Next.js App Router for the web application and initial API routes.
- React with typed component boundaries.
- CSS design system inspired by the provided neumorphic chat mockup.
- Zod for request validation at API boundaries.
- Microsoft-first target services: Microsoft Foundry, Azure OpenAI or Foundry Models, Azure AI Search, Entra ID, Azure AI Content Safety, Cosmos DB, Azure Storage, Azure Monitor, Application Insights, Microsoft Graph, and Teams SDK.

## Consequences

- The product can start quickly with a web-first slice while keeping a clean path to Azure services.
- TypeScript and API validation reduce integration drift as the system grows.
- Next.js route handlers are suitable for early development, but a dedicated backend can be introduced later if orchestration, scale, or network boundaries require it.
- The project must add automated tests, evaluation datasets, and observability before production rollout.
