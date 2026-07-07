import type { ChatMessage, ConversationSummary, ConsultantMode } from "./types";

export const consultantModes: Array<{
  id: ConsultantMode;
  label: string;
  description: string;
  bestFor: string;
  outcome: string;
  readiness: string;
}> = [
  {
    id: "architect",
    label: "Architect",
    description: "Designs Microsoft-first solution architecture and trade-offs.",
    bestFor: "Architecture, RAG design, integrations, migration paths.",
    outcome: "Produces options, trade-offs, risks, and implementation slices.",
    readiness: "Default for build planning",
  },
  {
    id: "admin",
    label: "Admin",
    description: "Guides Microsoft 365, Teams, SharePoint, and Azure operations.",
    bestFor: "Tenant operations, configuration, rollout, and troubleshooting.",
    outcome: "Produces admin steps, checks, dependencies, and rollback notes.",
    readiness: "Use for operational tasks",
  },
  {
    id: "security",
    label: "Security",
    description: "Focuses on identity, governance, compliance, and safe rollout.",
    bestFor: "Entra ID, data protection, permissions, audit, and compliance.",
    outcome: "Produces controls, threat assumptions, guardrails, and escalation points.",
    readiness: "Use before production release",
  },
  {
    id: "licensing",
    label: "Licensing",
    description: "Explains license fit, assumptions, and validation questions.",
    bestFor: "Plan comparison, SKU assumptions, cost fit, and entitlement checks.",
    outcome: "Produces assumptions, validation questions, and decision notes.",
    readiness: "Use with source validation",
  },
];

export const conversations: ConversationSummary[] = [
  {
    id: "current",
    title: "Agent365 build plan",
    icon: "chat",
    updatedAt: "Today",
  },
  {
    id: "azure-rag",
    title: "Azure RAG architecture",
    icon: "cloud",
    updatedAt: "Yesterday",
  },
  {
    id: "entra-security",
    title: "Entra ID governance",
    icon: "shield",
    updatedAt: "Jul 2026",
  },
  {
    id: "power-platform",
    title: "Power Platform workflow",
    icon: "workflow",
    updatedAt: "Jul 2026",
  },
];

export const initialMessages: ChatMessage[] = [
  {
    id: "m1",
    role: "user",
    author: "You",
    content:
      "We want to build a Microsoft-first consultant chatbot. The goal is production-grade quality, not a demo.",
    createdAt: "09:00",
  },
  {
    id: "m2",
    role: "assistant",
    author: "Agent365",
    content:
      "Great. I will start with a single consultant agent, strong grounded retrieval, measurable quality gates, and a clean path to Microsoft Foundry, Azure AI Search, Entra ID, and Teams.",
    createdAt: "09:01",
    citations: [
      {
        title: "Project working skill",
        source: "SKILL.md",
      },
    ],
  },
  {
    id: "m3",
    role: "assistant",
    author: "Agent365",
    content:
      "Phase 0 should lock the persona, supported domains, answer policy, risk boundaries, and evaluation criteria. After that, Phase 1 can build the knowledge taxonomy and benchmark dataset.",
    createdAt: "09:02",
    citations: [
      {
        title: "Phase 0 acceptance criteria",
        source: "SKILL.md",
      },
    ],
  },
];
