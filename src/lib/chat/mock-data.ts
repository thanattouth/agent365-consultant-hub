import type { ChatMessage, ConversationSummary } from "./types";

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
