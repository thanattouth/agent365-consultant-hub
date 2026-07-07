"use client";

import {
  BadgeDollarSign,
  BotMessageSquare,
  Cloud,
  History,
  Menu,
  Mic,
  Network,
  Paperclip,
  Plus,
  Send,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Wrench,
  Workflow,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import { MessageBubble } from "@/components/chat/message-bubble";
import {
  consultantModes,
  conversations,
  initialMessages,
} from "@/lib/chat/mock-data";
import type { ChatMessage, ConsultantMode, ConversationSummary } from "@/lib/chat/types";

const iconByConversation: Record<ConversationSummary["icon"], typeof BotMessageSquare> = {
  chat: BotMessageSquare,
  cloud: Cloud,
  shield: ShieldCheck,
  workflow: Workflow,
};

const iconByMode: Record<ConsultantMode, typeof Network> = {
  architect: Network,
  admin: Wrench,
  security: ShieldCheck,
  licensing: BadgeDollarSign,
};

export function ChatShell() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<ConsultantMode>("architect");
  const [isSending, setIsSending] = useState(false);

  const activeMode = useMemo(
    () => consultantModes.find((item) => item.id === mode) ?? consultantModes[0],
    [mode],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = input.trim();
    if (!trimmed || isSending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      author: "You",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmed, mode }),
      });

      if (!response.ok) {
        throw new Error("Chat request failed.");
      }

      const payload = (await response.json()) as { message: ChatMessage };
      setMessages((current) => [...current, payload.message]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          author: "Agent365",
          content:
            "I could not complete that request. Please try again, or narrow the scope so I can continue safely.",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Conversation navigation">
        <div className="brand-lockup">
          <div className="brand-mark raised-sm">
            <Sparkles size={22} aria-hidden="true" />
          </div>
          <div>
            <h1>Agent365</h1>
            <p>Consultant Hub</p>
          </div>
        </div>

        <button className="command-button raised" type="button">
          <Plus size={18} aria-hidden="true" />
          New Chat
        </button>

        <div className="sidebar-section">
          <p className="section-label">Chat History</p>
          <nav className="history-list">
            {conversations.map((conversation, index) => {
              const Icon = iconByConversation[conversation.icon];
              return (
                <button
                  className={`history-item ${index === 0 ? "active sunken-sm" : ""}`}
                  key={conversation.id}
                  type="button"
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>{conversation.title}</span>
                  <small>{conversation.updatedAt}</small>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-footer">
          <button className="ghost-button" type="button">
            <Trash2 size={18} aria-hidden="true" />
            Clear Conversations
          </button>
          <button className="ghost-button" type="button">
            <Settings size={18} aria-hidden="true" />
            Governance Settings
          </button>
        </div>
      </aside>

      <main className="chat-canvas">
        <header className="topbar raised-bottom">
          <div className="topbar-title">
            <button className="icon-button raised-sm mobile-only" type="button" aria-label="Open menu">
              <Menu size={19} aria-hidden="true" />
            </button>
            <div>
              <p className="eyebrow">Microsoft-first consultant chatbot</p>
              <h2>Agent365 Build Session</h2>
            </div>
          </div>
          <div className="topbar-actions">
            <button className="icon-button raised-sm" type="button" aria-label="Tune response mode">
              <SlidersHorizontal size={18} aria-hidden="true" />
            </button>
            <button className="icon-button raised-sm" type="button" aria-label="Open settings">
              <Settings size={18} aria-hidden="true" />
            </button>
          </div>
        </header>

        <section className="mode-switcher-wrap" aria-label="Consultant mode selection">
          <div className="mode-switcher raised" role="list">
            {consultantModes.map((item) => {
              const isActive = item.id === mode;
              const Icon = iconByMode[item.id];
              return (
                <button
                  aria-pressed={isActive}
                  className={`mode-switch-button ${isActive ? "active sunken-sm" : ""}`}
                  key={item.id}
                  onClick={() => setMode(item.id)}
                  title={`${item.label}: ${item.bestFor}`}
                  type="button"
                >
                  <Icon size={19} aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="conversation" aria-label="Chat messages">
          <div className="conversation-inner">
            <div className="session-summary raised">
              <div>
                <p className="eyebrow">Current focus</p>
                <h3>{activeMode.label} mode</h3>
              </div>
              <div>
                <p>{activeMode.description}</p>
                <p className="session-outcome">{activeMode.outcome}</p>
              </div>
            </div>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
        </section>

        <footer className="composer-wrap">
          <form className="composer" onSubmit={handleSubmit}>
            <div className="composer-input sunken">
              <input
                aria-label="Message"
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about Microsoft 365, Azure, Security, Copilot, Power Platform..."
                type="text"
                value={input}
              />
              <div className="composer-tools">
                <button type="button" aria-label="Attach file">
                  <Paperclip size={18} aria-hidden="true" />
                </button>
                <button type="button" aria-label="Use microphone">
                  <Mic size={18} aria-hidden="true" />
                </button>
              </div>
            </div>
            <button className="send-button raised" disabled={isSending} type="submit" aria-label="Send message">
              <Send size={20} aria-hidden="true" />
            </button>
          </form>
        </footer>

        <nav className="mobile-nav raised-top" aria-label="Mobile navigation">
          <a className="active" href="#chat">
            <BotMessageSquare size={19} aria-hidden="true" />
            Chat
          </a>
          <a href="#history">
            <History size={19} aria-hidden="true" />
            History
          </a>
          <a href="#governance">
            <ShieldCheck size={19} aria-hidden="true" />
            Guard
          </a>
        </nav>
      </main>
    </div>
  );
}
