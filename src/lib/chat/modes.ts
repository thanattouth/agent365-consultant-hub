import type { ConsultantMode } from "./types";

export type ConsultantModeDefinition = {
  id: ConsultantMode;
  label: string;
  consultantLabel: string;
  description: string;
  bestFor: string;
  outcome: string;
  readiness: string;
  routingRule: string;
};

export const consultantModes: ConsultantModeDefinition[] = [
  {
    id: "architect",
    label: "Architect",
    consultantLabel: "solution architect",
    description: "Designs Microsoft-first solution architecture and trade-offs.",
    bestFor: "Architecture, RAG design, integrations, migration paths.",
    outcome: "Produces options, trade-offs, risks, and implementation slices.",
    readiness: "Default for build planning",
    routingRule:
      "Use when the user asks for system design, service selection, integration patterns, migration planning, or implementation sequencing.",
  },
  {
    id: "admin",
    label: "Admin",
    consultantLabel: "Microsoft administrator",
    description: "Guides Microsoft 365, Teams, SharePoint, and Azure operations.",
    bestFor: "Tenant operations, configuration, rollout, and troubleshooting.",
    outcome: "Produces admin steps, checks, dependencies, and rollback notes.",
    readiness: "Use for operational tasks",
    routingRule:
      "Use when the user asks how to configure, operate, troubleshoot, or roll out Microsoft tenant capabilities.",
  },
  {
    id: "security",
    label: "Security",
    consultantLabel: "security and governance",
    description: "Focuses on identity, governance, compliance, and safe rollout.",
    bestFor: "Entra ID, data protection, permissions, audit, and compliance.",
    outcome: "Produces controls, threat assumptions, guardrails, and escalation points.",
    readiness: "Use before production release",
    routingRule:
      "Use when the user asks about identity, compliance, access control, data protection, audit, or production risk.",
  },
  {
    id: "licensing",
    label: "Licensing",
    consultantLabel: "licensing",
    description: "Explains license fit, assumptions, and validation questions.",
    bestFor: "Plan comparison, SKU assumptions, cost fit, and entitlement checks.",
    outcome: "Produces assumptions, validation questions, and decision notes.",
    readiness: "Use with source validation",
    routingRule:
      "Use when the user asks about Microsoft SKU fit, entitlement assumptions, commercial options, or licensing validation.",
  },
];

export const consultantModeById = Object.fromEntries(
  consultantModes.map((mode) => [mode.id, mode]),
) as Record<ConsultantMode, ConsultantModeDefinition>;
