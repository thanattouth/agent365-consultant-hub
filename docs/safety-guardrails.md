# Safety Guardrails

## Purpose

Agent365 now has a deterministic guardrail layer before live LLM integration. The goal is to identify risky prompts, attach machine-readable metadata, and keep the answer path auditable without logging sensitive content.

## Guardrail Metadata

Assistant responses include:

- `guardrailStatus`: `pass`, `review`, or `block`
- `riskFlags`: deterministic risk labels
- `requiresHumanReview`: boolean escalation signal

The same fields are mirrored into `trace` so benchmark and observability checks can validate them.

## Risk Flags

- `prompt_injection`: attempts to override system/developer/policy instructions
- `secret_request`: requests for keys, tokens, hidden prompts, passwords, or private data
- `permission_bypass`: attempts to bypass RBAC, DLP, audit, or source permissions
- `destructive_admin_action`: admin prompts involving delete, disable, wipe, purge, reset, or remove
- `licensing_certainty`: licensing prompts asking for definitive claims without validation
- `production_risk`: production, tenant-private, customer-data, or go-live scenarios

## Current Behavior

The current foundation does not hard-stop API responses. Instead, it returns a guarded answer with status and review metadata. This keeps development deterministic while giving us a clear place to add hard blocking or human escalation policy later.

## Red-Team Evaluation

Run:

```bash
npm run eval:red-team
```

The runner expects the local API server to be running and validates guardrail status, risk flags, and trace metadata.

## Production Path

- Add Azure AI Content Safety as a provider-backed guardrail.
- Add policy-based hard blocks for selected `block` cases.
- Route `requiresHumanReview` cases to a human escalation workflow.
- Keep prompt, source content, secrets, and private documents out of logs.
- Track guardrail status and risk flag distribution in Application Insights or Azure Monitor.
