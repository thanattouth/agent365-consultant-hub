# Consultant Mode Routing Policy

## Purpose

Consultant modes keep Agent365 answers scoped, auditable, and easier to evaluate. A mode is not a personality switch; it is a routing contract that affects what evidence the assistant should seek, what risks it should surface, and what output shape it should prefer.

## Modes

### Architect

Use for architecture, RAG design, Microsoft service selection, integrations, migration paths, and implementation sequencing.

Expected output:

- Options and trade-offs.
- Recommended Microsoft-first architecture.
- Risks and assumptions.
- Small implementation slices.
- References to required source validation.

### Admin

Use for Microsoft 365, Teams, SharePoint, Azure operations, tenant configuration, rollout, and troubleshooting.

Expected output:

- Step-by-step admin actions.
- Preconditions and permission requirements.
- Rollback or recovery notes.
- Operational checks.
- Tenant-specific questions when needed.

### Security

Use for Entra ID, identity governance, data protection, audit, compliance, access control, production hardening, and unsafe or high-risk scenarios.

Expected output:

- Controls and guardrails.
- Threat assumptions.
- Least-privilege guidance.
- Audit and monitoring considerations.
- Escalation points for compliance or tenant-specific decisions.

### Licensing

Use for Microsoft SKU fit, entitlement assumptions, cost fit, feature availability, and validation questions.

Expected output:

- Assumptions clearly separated from facts.
- Validation questions.
- Source/citation requirements.
- Decision notes.
- Escalation when licensing terms or commercial details are uncertain.

## Routing Rules

- Default to Architect for build planning and ambiguous implementation design.
- Switch to Admin when the user asks how to configure, operate, deploy, or troubleshoot a Microsoft tenant capability.
- Switch to Security when the answer affects identity, access, compliance, data protection, or production risk.
- Switch to Licensing when the answer depends on plan, SKU, entitlement, or commercial assumptions.
- Ask a clarifying question when more than one mode could materially change the answer.
- Keep the selected mode visible in the UI and included in API request context.

## Production Notes

- Mode metadata must live in one shared registry used by both UI and API code.
- Evaluation datasets should include the expected mode for each prompt.
- Future automatic routing should produce a confidence score and preserve manual override.
- High-risk mode changes should be observable in telemetry.
