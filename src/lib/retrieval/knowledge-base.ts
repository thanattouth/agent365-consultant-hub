import type { KnowledgeSource } from "./types";

export const localKnowledgeBase: KnowledgeSource[] = [
  {
    id: "ms-foundry-agent-service",
    title: "Microsoft Foundry Agent Service",
    source: "Microsoft Learn",
    url: "https://learn.microsoft.com/en-us/azure/ai-foundry/agents/overview",
    product: "Microsoft Foundry",
    scenario: "agent-orchestration",
    sensitivity: "public",
    modes: ["architect"],
    keywords: ["foundry", "agent", "orchestration", "tool", "production", "microsoft"],
    content:
      "Microsoft Foundry Agent Service is the target managed agent runtime for production orchestration when the chatbot needs tool use, managed agent state, and Microsoft-first AI integration.",
  },
  {
    id: "azure-ai-search-rag",
    title: "Azure AI Search for RAG",
    source: "Microsoft Learn",
    url: "https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview",
    product: "Azure AI Search",
    scenario: "retrieval-augmented-generation",
    sensitivity: "public",
    modes: ["architect", "security"],
    keywords: ["rag", "retrieval", "azure ai search", "citations", "index", "grounding"],
    content:
      "Azure AI Search is the preferred Microsoft retrieval layer for RAG. It supports indexed enterprise knowledge, retrieval grounding, and citation-oriented responses.",
  },
  {
    id: "entra-id-access-control",
    title: "Microsoft Entra ID access control",
    source: "Microsoft Learn",
    url: "https://learn.microsoft.com/en-us/entra/identity/",
    product: "Microsoft Entra ID",
    scenario: "identity-governance",
    sensitivity: "public",
    modes: ["security", "admin"],
    keywords: ["entra", "identity", "least privilege", "access", "rbac", "permission"],
    content:
      "Microsoft Entra ID should anchor authentication and authorization. Production chatbot access should use least privilege, explicit user or service identity, and auditable permission boundaries.",
  },
  {
    id: "sharepoint-permission-trimming",
    title: "SharePoint permission-aware knowledge access",
    source: "Project policy",
    product: "SharePoint",
    scenario: "tenant-private-knowledge",
    sensitivity: "internal",
    modes: ["security", "admin"],
    keywords: ["sharepoint", "permission trimming", "tenant-private", "documents", "data leakage"],
    content:
      "Tenant-private SharePoint documents require permission trimming before retrieval results are provided to the model. Retrieved content must not bypass user permissions or leak private data through citations.",
  },
  {
    id: "teams-pilot-rollout",
    title: "Teams pilot rollout checklist",
    source: "Project playbook",
    product: "Microsoft Teams",
    scenario: "pilot-rollout",
    sensitivity: "internal",
    modes: ["admin"],
    keywords: ["teams", "pilot", "rollout", "admin", "permissions", "rollback"],
    content:
      "A Teams pilot rollout should define pilot users, app distribution path, permissions, support ownership, success metrics, and rollback criteria before broad deployment.",
  },
  {
    id: "content-safety-guardrails",
    title: "Azure AI Content Safety guardrails",
    source: "Microsoft Learn",
    url: "https://learn.microsoft.com/en-us/azure/ai-services/content-safety/overview",
    product: "Azure AI Content Safety",
    scenario: "safety-controls",
    sensitivity: "public",
    modes: ["security", "architect"],
    keywords: ["content safety", "prompt injection", "groundedness", "protected material", "safety"],
    content:
      "Azure AI Content Safety can support prompt shields, content moderation, groundedness checks, protected material checks, and safer production release gates.",
  },
  {
    id: "microsoft-licensing-validation",
    title: "Microsoft licensing validation practice",
    source: "Project policy",
    product: "Microsoft Licensing",
    scenario: "license-fit",
    sensitivity: "internal",
    modes: ["licensing"],
    keywords: ["license", "licensing", "sku", "entitlement", "business premium", "copilot"],
    content:
      "Licensing answers must separate assumptions from facts, avoid definitive commercial claims without current sources, and list validation questions for SKU, entitlement, user group, and region.",
  },
];
