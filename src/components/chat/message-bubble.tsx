import { Sparkles, UserRound } from "lucide-react";

import type { ChatMessage } from "@/lib/chat/types";

type MessageBubbleProps = {
  message: ChatMessage;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <article className={`message-row ${isUser ? "message-row-user" : ""}`}>
      <div className="message-meta">
        {isUser ? (
          <>
            <span>{message.author}</span>
            <span className="avatar avatar-user">
              <UserRound size={14} aria-hidden="true" />
            </span>
          </>
        ) : (
          <>
            <span className="avatar avatar-agent">
              <Sparkles size={14} aria-hidden="true" />
            </span>
            <span>{message.author}</span>
          </>
        )}
      </div>
      <div className={`message-bubble ${isUser ? "sunken" : "raised"}`}>
        <p>{message.content}</p>
        {message.citations && message.citations.length > 0 ? (
          <div className="citation-list" aria-label="Citations">
            {message.citations.map((citation) => (
              <span className="citation-chip" key={`${citation.source}-${citation.title}`}>
                {citation.title}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
