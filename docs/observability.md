# Observability

## Purpose

Agent365 needs enough trace metadata to debug every answer without logging sensitive prompt or source content. The current implementation adds structured response trace data and redacted server logs before Application Insights is connected.

## Response Trace

Each assistant message includes `trace` metadata:

- `requestId`
- `provider`
- `mode`
- `latencyMs`
- `retrievalResultCount`
- `citationCount`
- `confidence`
- `safetyLevel`
- `retrieval`

Retrieval trace items include source id, title, source family, product, scenario, sensitivity, score, and matched keywords. They intentionally do not include full source content.

## Server Logs

The API emits JSON logs with:

- event name
- request id
- provider
- mode
- latency
- status
- retrieval result count
- citation count
- confidence
- safety level
- error category when failed

The logger must not emit full prompts, full answers, access tokens, secrets, or private source content.

## Production Path

- Send structured logs and metrics to Application Insights or Azure Monitor.
- Add correlation across API, retrieval, model, and tool calls.
- Add dashboards for latency, error rate, provider selection, citation coverage, safety level distribution, and benchmark pass rate.
- Add alerting for provider errors, no-citation answers when citation is required, and retrieval result count drops.

## Debug Flow

1. Start with `requestId`.
2. Check provider, mode, latency, and status.
3. Check retrieval result count and citation count.
4. Inspect retrieval trace source metadata and matched keywords.
5. Re-run the benchmark case or add a regression case if the failure is repeatable.
