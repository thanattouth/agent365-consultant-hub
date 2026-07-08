# Work Log

## 2026-07-08

### Changed

- Added an Azure OpenAI smoke evaluation script for the live `/api/chat` path.
- Added `npm run eval:azure-smoke` to validate Azure provider routing, citation metadata, retrieval trace metadata, follow-up questions, and basic response redaction markers.
- Wrapped Azure OpenAI network and invalid-JSON failures as provider execution errors so they return sanitized `502` responses instead of unhandled `500` responses.
- Documented the live Azure smoke workflow in the README.

### Why

The Azure provider now performs live model execution with retrieval grounding, so the project needs a repeatable smoke check that confirms the runtime path still returns the expected production contract before deeper Azure AI Search work begins.

### Verified

- `npm.cmd run lint` passed.
- `npm.cmd run typecheck` passed.
- `npm.cmd run build` passed.
- `npm.cmd run eval:azure-smoke` passed against a live Azure OpenAI configured local server with `provider: azure-openai`, 3 citations, and 3 retrieval results.
- Sandbox-limited Azure execution returned a sanitized `502 provider_execution` failure instead of an unhandled `500`.

### Risks And Follow-Up

- The smoke script expects a running server with valid Azure OpenAI configuration.
- It validates response contract metadata but does not grade answer quality or citation fidelity beyond expected source metadata.

## 2026-07-07

### Changed

- Updated architecture notes to reflect the current Azure OpenAI runtime path.
- Documented that Azure OpenAI uses local retrieval grounding and citation trace metadata until Azure AI Search replaces the adapter.
- Updated boundary decisions and next architecture work to remove completed items and surface Azure AI Search, managed identity, live provider tests, hard-block policy, and telemetry export.

### Why

The architecture notes still described the application as a mock consultant API even though the implementation now has provider routing, Azure OpenAI execution, retrieval grounding, guardrail metadata, sanitized provider errors, and structured trace metadata.

### Verified

- `npm.cmd run lint` passed.
- `npm.cmd run typecheck` passed.
- `npm.cmd run build` passed.

### Risks And Follow-Up

- Architecture notes remain intentionally high level; implementation-specific provider behavior should continue to live in provider and retrieval docs.

### Changed

- Reintroduced retrieval grounding around the Azure OpenAI provider path.
- Added local retrieval citations, retrieval trace metadata, confidence scoring, and follow-up questions to Azure provider responses.
- Injected matched trusted source snippets into the Azure OpenAI prompt so live responses can use the same grounded source set returned in the API contract.
- Documented that Azure OpenAI uses the local retrieval adapter until Azure AI Search replaces it.

### Why

The normal runtime path now uses Azure OpenAI, but consultant-grade answers still need citations and traceable evidence. Reusing the existing local retrieval adapter keeps the Azure path grounded and contract-compatible before the production Azure AI Search adapter is connected.

### Verified

- `npm.cmd run lint` passed.
- `npm.cmd run typecheck` passed.
- `npm.cmd run build` passed.

### Risks And Follow-Up

- Grounding still depends on keyword-based local retrieval, so coverage is limited to seeded sources.
- The model is instructed to cite only returned source titles, but citation fidelity still needs live integration tests and benchmark coverage for Azure responses.
- Replace this adapter with Azure AI Search while preserving the citation and trace contract.

### Changed

- Added a provider execution error guard for Azure OpenAI failures.
- Updated the chat API to return sanitized `502` responses for provider execution failures.
- Kept raw provider failure details out of client responses while preserving request IDs and structured log categories.

### Why

Live model calls can fail independently of application validation or configuration. The API should distinguish upstream provider execution failures from unhandled server errors so production debugging can start from a clear, safe status and `requestId`.

### Verified

- `npm.cmd run lint` passed.
- `npm.cmd run typecheck` passed.
- `npm.cmd run build` passed.

### Risks And Follow-Up

- Provider execution details are still not exported to Application Insights; production telemetry should capture safe provider status metadata without raw prompts, secrets, or full provider payloads.
- Azure responses are still not retrieval-grounded; re-introduce citations around the Azure provider path next.

### Changed

- Added production-style chat interaction animation.
- Added an assistant typing indicator while the chat provider request is in flight.
- Added send-button loading feedback and automatic scroll-to-latest-message behavior.
- Added motion-reduction handling for users who prefer reduced motion.

### Why

Normal AI chat needs clear interaction feedback so users understand that a provider request is running, especially when live Azure OpenAI latency varies.

### Verified

- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm run build` passed.
- Browser page load check confirmed the chat shell, composer input, and send button render on the local app.

### Risks And Follow-Up

- Browser automation timed out while attempting a full send-message interaction check; re-run a manual browser pass to visually confirm the transient typing state.
- Future streaming responses should replace the typing indicator with token-level answer streaming.

### Changed

- Updated the Azure OpenAI REST request to use `max_completion_tokens` for newer chat deployments.
- Verified the configured Azure OpenAI deployment can return a live assistant response.
- Verified the app `/api/chat` route returns `provider: azure-openai` with trace metadata after environment configuration.

### Why

The configured deployment rejected the older `max_tokens` parameter. The provider must use the completion-token parameter supported by newer Azure OpenAI chat models before normal chat can work reliably.

### Verified

- Direct Azure OpenAI REST check returned 200 with assistant content.
- Local `/api/chat` smoke test returned 200 through the app provider path.
- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm run build` passed.

### Risks And Follow-Up

- Current API errors from live provider execution are still surfaced as generic 500 responses; add sanitized 502 provider errors for easier production debugging.
- HMR WebSocket disconnects can occur when the dev server restarts or recompiles; refresh the browser if the chat API is already healthy.

### Changed

- Switched normal chat runtime to Azure OpenAI by default.
- Implemented Azure OpenAI chat completions over REST.
- Added conversation history support in the chat API and UI request payload.
- Removed mock initial chat messages and mock history entries from the active UI.
- Removed consultant mode selection from the normal chat UI.
- Kept the deterministic local provider only as an explicit development/evaluation path.

### Why

The next product goal is normal AI conversation before returning to advanced consultant behavior. The runtime should now call a real AI provider when configured, while local deterministic behavior remains available only for controlled tests.

### Verified

- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm run build` passed.
- Local API check without Azure OpenAI configuration returned a clear 503 provider configuration error instead of a mock response.

### Risks And Follow-Up

- Azure OpenAI requires environment configuration before chat responses can complete.
- Current Azure OpenAI auth uses API key; managed identity should be added later.
- Evaluation scripts require the local provider unless separate live-provider evaluation is added.

### Changed

- Added deterministic input safety classification.
- Added guardrail status, risk flags, and human-review metadata to chat responses and traces.
- Added red-team seed prompts and a red-team evaluation runner.
- Added benchmark checks for guardrail metadata.
- Documented safety guardrails and production escalation path.

### Why

Before live LLM integration, the chatbot needs a safety contract for prompt injection, secret requests, permission bypass, destructive admin actions, licensing certainty, and production-risk prompts.

### Verified

- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm run build` passed.
- `npm run eval:benchmark` passed 4/4 benchmark cases.
- `npm run eval:red-team` passed 5/5 red-team cases.

### Risks And Follow-Up

- Guardrails currently attach metadata and guidance but do not hard-stop blocked prompts.
- Azure AI Content Safety and human escalation should be added before production rollout.

### Changed

- Added chat trace metadata to assistant responses.
- Added retrieval trace metadata without full source content.
- Added structured server logging for completed and failed chat requests.
- Updated benchmark checks to validate trace metadata.
- Documented observability and debugging expectations.

### Why

Production-grade chatbot behavior must be debuggable. Trace metadata lets us understand provider routing, retrieval behavior, citation coverage, latency, confidence, and safety level without logging sensitive prompt or source content.

### Verified

- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm run build` passed.
- `npm run eval:benchmark` passed 4/4 benchmark cases with trace assertions.
- Local API sample returned trace metadata with provider, mode, latency, retrieval counts, citation count, confidence, safety level, and retrieval source metadata.

### Risks And Follow-Up

- Logs currently write to stdout; production should export them to Application Insights or Azure Monitor.
- Trace metadata is visible in the API response and may later need role-based visibility in the UI.

### Changed

- Added a chat provider abstraction with a default `local` provider.
- Moved deterministic grounded answer composition into the local provider.
- Added an Azure OpenAI provider scaffold with configuration validation.
- Added `provider` to the chat response contract and benchmark checks.
- Documented provider selection and Azure OpenAI integration path.

### Why

The bot can answer locally now, but production work needs a clean boundary for swapping in Azure OpenAI without rewriting the API, UI, evaluation runner, or retrieval layer.

### Verified

- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm run build` passed.
- `npm run eval:benchmark` passed 4/4 benchmark cases with `provider: local`.

### Risks And Follow-Up

- Azure OpenAI live model execution is scaffolded but not implemented.
- Provider selection is environment-based and should later be included in deployment configuration validation.

### Changed

- Replaced the generic consultant response template with a grounded structured answer composer.
- Added mode-specific answer plans for Architect, Admin, Security, and Licensing paths.
- Rendered multiline assistant responses cleanly in the chat UI.
- Verified a sample Architect request returns recommended steps, evidence used, production checks, follow-up questions, and retrieval-backed citations.

### Why

The product goal for today is to have a bot that can answer usefully, not only echo routing metadata. The local answer composer gives the chatbot an end-to-end answer path while keeping the system deterministic, debuggable, and ready for a future Azure OpenAI provider.

### Verified

- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm run build` passed.
- `npm run eval:benchmark` passed 4/4 benchmark cases.
- Local API sample for an Architect RAG question returned a structured grounded answer with citations from local retrieval.

### Risks And Follow-Up

- Answers are deterministic and template-composed; this is useful for foundation testing but not a substitute for Azure OpenAI reasoning.
- Next step should add a provider abstraction so the system can choose local deterministic answers or Azure OpenAI when configured.

### Changed

- Added a local retrieval schema, seeded Microsoft knowledge sources, deterministic retriever, and citation mapper.
- Connected consultant response drafting to local retrieval so API citations come from retrieved knowledge sources.
- Added benchmark assertions for expected citation titles.
- Documented the local retrieval adapter and future Azure AI Search path.

### Why

Grounded answers need a retrieval surface before real Azure AI Search integration. A deterministic local adapter lets us test citation behavior, retrieval drift, and response contracts while keeping the system easy to debug.

### Verified

- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm run build` passed.
- `npm run eval:benchmark` passed 4/4 benchmark cases, including expected citation title assertions.

### Risks And Follow-Up

- Local retrieval uses simple keyword scoring and is not a replacement for Azure AI Search.
- Permission trimming is modeled in schema only; enforcement must be added before tenant-private data is connected.
- Future work should expose retrieval trace metadata for observability.

### Changed

- Added a structured chat response contract with mode, confidence, citation requirement, safety level, follow-up questions, and contract version metadata.
- Moved chat request and response validation schemas into a shared contract module.
- Added a benchmark runner that calls the chat API and validates response contract fields plus benchmark phrase assertions.
- Added an `eval:benchmark` npm script.
- Documented benchmark execution in the README.

### Why

Production-grade chatbot work needs measurable quality gates before real model and RAG integrations are added. A structured response contract gives the UI, API, telemetry, and evaluator a stable surface to build on.

### Verified

- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm run build` passed.
- `npm run eval:benchmark` passed 4/4 benchmark cases against the local dev server.

### Risks And Follow-Up

- The benchmark runner currently checks deterministic mock API responses; future work should add model-based groundedness and safety evaluation.
- The eval script expects a running API server and should later support CI startup orchestration.

### Changed

- Added a shared consultant mode registry used by both UI and API response drafting.
- Removed duplicated mode labels from the mock data and consultant response path.
- Added a consultant mode routing policy document.
- Added an initial benchmark seed dataset for future evaluation work.

### Why

Mode routing is part of the production contract. Keeping mode metadata in one place reduces drift between the UI, API behavior, documentation, and future evaluation datasets.

### Verified

- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm run build` passed.
- Local API smoke test for `security` mode returned 200 and included the shared routing rule in the assistant response.

### Risks And Follow-Up

- Benchmark seed data is not executed by an automated evaluator yet.
- Future work should add an evaluation runner that checks mode fit, groundedness, citation behavior, and safety behavior.

### Changed

- Replaced the larger consultant mode card panel with a compact segmented mode switcher.
- Kept production mode guidance available through button titles and the current focus summary instead of dense selector content.
- Updated the active mode summary to show the expected production outcome for the selected path.

### Why

Mode choice affects answer scope, auditability, evaluation, and safety, but the selector should stay lightweight enough for frequent chat use.

### Verified

- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm run build` passed.
- Browser desktop check confirmed the compact switcher renders 4 consultant mode buttons, shows the active Architect mode, and includes production outcome text in the current focus summary.
- Browser interaction check confirmed selecting Security updates the active mode and current focus summary.
- Mobile viewport check at 390x844 confirmed sidebar is hidden, mobile navigation is visible, the compact mode switcher remains usable, and the composer remains present.

### Risks And Follow-Up

- The current mode guidance is static and should later connect to policy, evaluation, and routing metadata.

### Changed

- Added `SKILL.md` as the project working skill and delivery charter.
- Started the modern application scaffold with Next.js, TypeScript, React, and a neumorphic Agent365 chat shell based on the provided design reference.
- Added a mock `/api/chat` endpoint with request validation and citation-shaped responses.
- Added Phase 0 product definition and architecture notes.

### Why

The project needs a stable product and engineering foundation before connecting Microsoft cloud services. The first slice keeps UI, domain contracts, and API boundaries maintainable while preserving the production-grade roadmap.

### Verified

- `npm install` completed and generated `package-lock.json`.
- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm run build` passed with Next.js 15.5.20.
- Local dev server started at `http://localhost:3000`.
- Browser check confirmed the desktop UI renders key Agent365 content, the composer exists, and a mock chat request adds an assistant response with citations.
- Mobile viewport check at 390x844 confirmed the sidebar is hidden, mobile navigation is visible, and the composer is present.

### Risks And Follow-Up

- `npm audit --omit=dev` reports 2 moderate production dependency findings through `next -> postcss`. `npm audit fix --force` currently recommends a breaking downgrade path, so it was not applied.
- The mock chat endpoint must be replaced with a real orchestrator path in a later phase.
- Evaluation datasets and automated tests are not implemented yet.
