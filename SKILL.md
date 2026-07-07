---
name: agent365-consultant-hub
description: Project working skill for building a Microsoft-first consultant chatbot with production-grade architecture, disciplined phased delivery, maintainable code, safe debugging, and Conventional Commits.
---

# Agent365 Consultant Hub

Use this skill for all work in this repository. The project goal is to build a Microsoft-first consultant chatbot that can advise on Microsoft 365, Azure, Security, Copilot, Power Platform, Teams, SharePoint, licensing, and implementation scenarios with production-grade quality.

Target state: production-grade 90%. This means the product is not merely a demo; it must be observable, secure, testable, maintainable, grounded in trusted knowledge, and ready for controlled production rollout.

## Operating Principles

- Work phase by phase. Do not jump into advanced architecture before the current phase has clear acceptance criteria.
- Prefer Microsoft technologies when they fit the requirement: Microsoft Foundry, Azure OpenAI or Foundry Models, Azure AI Search, Microsoft Entra ID, Azure Monitor, Application Insights, Azure AI Content Safety, Cosmos DB, Azure Storage, Teams SDK, Microsoft Graph, Power Platform, and Azure DevOps or GitHub Actions.
- Build from a strong single-agent core before introducing multi-agent complexity.
- Treat every answer path as a product surface: quality, latency, safety, citation, and user trust matter.
- Favor clear, maintainable implementation over clever abstractions.
- Keep user data, tenant data, secrets, logs, and conversation history governed from the beginning.

## Non-Technical Components

The chatbot product consists of these components:

1. Consultant identity: role, voice, boundaries, confidence behavior, and escalation behavior.
2. Knowledge estate: Microsoft public docs, internal SOPs, customer/project knowledge, FAQs, playbooks, and historical cases.
3. Grounded answering: retrieval, citations, confidence, and source-aware responses.
4. Consulting workflow: clarify requirements, recommend options, explain trade-offs, and produce next steps.
5. Channels: web chat, Microsoft Teams, internal portal, and future Microsoft 365 extension points.
6. Security and governance: identity, permissions, audit, retention, and data loss prevention.
7. Quality system: benchmark questions, evaluations, red-team prompts, regression tests, and human review.
8. Human escalation: low-confidence routing, expert review, and feedback loops.
9. Business metrics: adoption, resolved cases, deflection, time saved, and consultant productivity.
10. Production operations: monitoring, alerts, deployment, rollback, cost control, and incident response.

## Reference Architecture Direction

Baseline production architecture:

- User channels: Web app and Microsoft Teams.
- Edge: Azure Application Gateway with Web Application Firewall for public web entry points.
- Identity: Microsoft Entra ID for authentication and authorization.
- Application tier: Azure App Service or Azure Container Apps for chat UI and API.
- Agent runtime: Microsoft Foundry Agent Service where appropriate.
- Model layer: Azure OpenAI or Microsoft Foundry Models.
- Retrieval: Azure AI Search for RAG, starting with classic RAG when stability is more important and moving to agentic retrieval for complex consulting queries.
- State: Azure Cosmos DB for conversation state, session metadata, and agent memory where required.
- Files: Azure Storage for uploaded or indexed content.
- Safety: Azure AI Content Safety for prompt shields, content moderation, groundedness checks, protected material checks, and task adherence where applicable.
- Tools: Microsoft Graph, Azure Resource Graph, Power Platform APIs, licensing data sources, and approved internal APIs.
- Observability: Azure Monitor, Application Insights, OpenTelemetry traces, Foundry evaluation and monitoring.
- Network/security: Private Link, private endpoints, VNet integration, Key Vault, Azure Firewall, managed identities, and least-privilege RBAC.

## Delivery Phases

### Phase 0: Product Definition

Define the consultant persona, domains, answer policy, target users, risks, and success metrics.

Acceptance criteria:

- Persona and scope are documented.
- Supported and unsupported domains are clear.
- Answer policy requires citations for factual claims.
- Low-confidence behavior is defined.
- Initial benchmark question set is planned.

### Phase 1: Knowledge Foundation

Build the trusted knowledge base and taxonomy.

Acceptance criteria:

- Source inventory exists.
- Knowledge sources are classified by product, scenario, role, sensitivity, freshness, and owner.
- Initial benchmark dataset contains representative Microsoft consulting questions.
- Ingestion rules and citation requirements are defined.

### Phase 2: RAG MVP

Build a grounded single-agent chatbot with retrieval and citations.

Acceptance criteria:

- Chat API and basic UI exist.
- Azure AI Search index or local equivalent is working.
- Responses include citations when using retrieved knowledge.
- The bot asks clarifying questions when requirements are incomplete.
- Basic evaluation can measure accuracy, groundedness, and relevance.

### Phase 3: Consultant-Grade Agent

Add consulting workflows, tool use, and better reasoning patterns.

Acceptance criteria:

- Agent can produce architecture recommendations, trade-off analysis, migration plans, troubleshooting steps, and implementation checklists.
- Tool calling is explicit, auditable, and permission-aware.
- Multi-turn context works without leaking unrelated sessions.
- High-risk answers use safer wording and escalation paths.

### Phase 4: Security and Governance

Harden identity, permissions, data handling, and deployment boundaries.

Acceptance criteria:

- Entra ID authentication is implemented.
- RBAC or permission trimming is designed for protected knowledge.
- Secrets are stored outside code.
- Conversation retention and audit logging are defined.
- Prompt injection and unsafe content controls are tested.

### Phase 5: Evaluation and Hardening

Make quality measurable and release-blocking.

Acceptance criteria:

- Evaluation dataset runs in CI or a repeatable local command.
- Regression prompts cover known failures.
- Red-team prompts cover prompt injection, data leakage, unsafe advice, and hallucination.
- Latency, error rate, token usage, and quality metrics are observable.
- Release gates prevent obvious quality regressions.

### Phase 6: Production Launch

Deploy for controlled production usage.

Acceptance criteria:

- Infrastructure is repeatable.
- Monitoring dashboards and alerts exist.
- Rollback process is documented and tested.
- Human escalation and feedback review loops are active.
- Cost tracking is visible by environment and major workload path.

### Phase 7: Optimization

Improve capability after the core product is stable.

Acceptance criteria:

- Consider agentic retrieval for complex multi-source queries.
- Consider specialized agents only when the single-agent design becomes a real limitation.
- Add Teams-first experiences, adaptive cards, Microsoft 365 integrations, and personalization by role.
- Tune cost, latency, and quality using production telemetry.

## Production-Grade 90% Scorecard

Aim for these thresholds before calling the system production-grade:

- Benchmark answer accuracy: at least 85-90%.
- Grounded answers with citations: at least 95% when factual claims depend on sources.
- Critical hallucination rate: below 2%.
- P95 latency: 3-6 seconds for common questions, with clear exceptions for complex tool workflows.
- Safety pass rate: at least 98% for tested safety scenarios.
- Known critical permission leaks: zero.
- Observability: logs, metrics, traces, model calls, tool calls, token usage, and errors are visible.
- Evaluation: automated checks run before release.
- Escalation: low-confidence and high-risk cases can route to a human.
- Operations: rollback, incident response, and cost tracking are ready.

## Engineering Rules

- Read existing code before changing it.
- Make the smallest coherent change that satisfies the phase goal.
- Use typed interfaces and explicit data contracts where the stack supports them.
- Keep domain logic separate from transport, UI, and infrastructure code.
- Avoid hidden global state for conversation, tenant, or user context.
- Treat prompts as versioned product artifacts.
- Treat retrieval configuration as code or documented configuration.
- Prefer managed identities over static secrets.
- Never log secrets, access tokens, full sensitive prompts, or private customer data unless a deliberate redaction policy is in place.
- Add tests where behavior, security, retrieval quality, or user-facing output can regress.
- Keep debug paths easy: structured logs, correlation IDs, trace IDs, request IDs, and clear error boundaries.

## Debugging Principles

- Reproduce before changing code when possible.
- Isolate failures by layer: channel, API, orchestration, model, retrieval, tool, identity, storage, and network.
- Capture enough context to debug safely: request ID, tenant ID hash, user ID hash, tool name, latency, status, and error category.
- Do not expose raw secrets, tokens, private documents, or full sensitive conversations in logs.
- Convert recurring manual debugging into tests, scripts, or dashboards.
- Keep failure modes user-safe: partial answer, clarification, retry, or escalation is better than confident nonsense.

## Maintainability Principles

- Prefer boring, well-known patterns over clever code.
- Name modules by responsibility, not implementation detail.
- Keep functions small enough to test and reason about.
- Add comments only when the why is not obvious.
- Document architectural decisions when they affect security, cost, reliability, or future phases.
- Version prompts, evaluation datasets, and retrieval schemas.
- Make environment-specific configuration explicit.

## Security Principles

- Apply least privilege for users, services, tools, indexes, and storage.
- Use Entra ID and managed identities wherever possible.
- Store secrets in Key Vault or approved secret stores.
- Enforce permission trimming for protected data.
- Validate and constrain tool calls.
- Defend against prompt injection in user prompts and retrieved documents.
- Separate public Microsoft knowledge from tenant-private and customer-private knowledge.
- Define retention and deletion policy for conversations, uploaded files, and telemetry.

## Commit Policy

Use Conventional Commits for all commit messages.

Format:

```text
<type>(optional-scope): <short summary>
```

Common types:

- `feat`: user-visible capability.
- `fix`: bug fix.
- `docs`: documentation-only change.
- `refactor`: code restructuring without behavior change.
- `test`: tests or test infrastructure.
- `chore`: maintenance, tooling, dependencies, or repository setup.
- `ci`: CI/CD changes.
- `perf`: performance improvement.
- `security`: security hardening.

Examples:

```text
docs(roadmap): add production-grade chatbot delivery phases
feat(rag): add citation-aware retrieval pipeline
fix(auth): enforce tenant isolation in chat sessions
test(eval): add groundedness regression prompts
security(tools): validate graph tool input before execution
```

## Work Logging

Every meaningful work session should update project notes, documentation, or implementation artifacts with:

- What changed.
- Why it changed.
- How it was verified.
- Known risks or follow-up work.

For code work, prefer durable artifacts over chat-only memory: tests, docs, ADRs, issue notes, evaluation files, or inline comments where appropriate.
