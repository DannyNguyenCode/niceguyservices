"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SpecialistChatMessage } from "@/lib/templates/api/pet-market-specialist-chat";
import {
  getSpmSpecialistChatErrorMessage,
  sendSpmSpecialistMessage,
} from "@/lib/templates/api/pet-market-specialist-chat";
import { SPM_IMG } from "./saturdayPetMarketImages";
import { useSpmSpecialistChat } from "./SaturdayPetMarketSpecialistChatContext";
import {
  SPM_SPECIALIST,
  SPM_SPECIALIST_CHAT_STORAGE_KEY,
  SPM_SPECIALIST_GREETING,
  SPM_SPECIALIST_QUICK_PROMPTS,
} from "./spmSpecialistChat";
import { SpmIcon, SpmImg } from "./SaturdayPetMarketShared";

function loadStoredMessages(): SpecialistChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(SPM_SPECIALIST_CHAT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SpecialistChatMessage[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (message) =>
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string",
    );
  } catch {
    return [];
  }
}

function persistMessages(messages: SpecialistChatMessage[]) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SPM_SPECIALIST_CHAT_STORAGE_KEY, JSON.stringify(messages));
}

export function SaturdayPetMarketSpecialistChat() {
  const { isOpen, close } = useSpmSpecialistChat();
  const [messages, setMessages] = useState<SpecialistChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([...SPM_SPECIALIST_QUICK_PROMPTS]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const stored = loadStoredMessages();
    if (stored.length > 0) {
      setMessages(stored);
    } else {
      setMessages([{ role: "assistant", content: SPM_SPECIALIST_GREETING }]);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    persistMessages(messages);
  }, [messages, hydrated]);

  useEffect(() => {
    if (!isOpen) return;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  useEffect(() => {
    const node = listRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages, loading, isOpen]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const nextMessages: SpecialistChatMessage[] = [
        ...messages,
        { role: "user", content: trimmed },
      ];
      setMessages(nextMessages);
      setDraft("");
      setError(null);
      setSuggestions([]);
      setLoading(true);

      try {
        const reply = await sendSpmSpecialistMessage(nextMessages);
        setMessages((current) => [...current, { role: "assistant", content: reply.content }]);
        setSuggestions(reply.suggestions ?? []);
      } catch (err) {
        const message = getSpmSpecialistChatErrorMessage(
          err,
          "Marcie is taking a quick treat break. Try again in a moment.",
        );
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [loading, messages],
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(draft);
  }

  function handleClearChat() {
    const greeting: SpecialistChatMessage[] = [{ role: "assistant", content: SPM_SPECIALIST_GREETING }];
    setMessages(greeting);
    setSuggestions([...SPM_SPECIALIST_QUICK_PROMPTS]);
    setError(null);
    setDraft("");
  }

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[105] flex w-[min(100vw-1.5rem,24rem)] flex-col overflow-hidden rounded-2xl border-2 border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-lowest)] shadow-2xl sm:w-96">
      <header className="flex items-center gap-3 border-b border-[var(--spm-outline-variant)] bg-[var(--spm-secondary)] px-4 py-3 text-[var(--spm-on-secondary)]">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-white/40">
          <SpmImg src={SPM_IMG.faq.mascot} alt="" fill className="object-cover" sizes="44px" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="spm-headline-md truncate leading-tight">{SPM_SPECIALIST.name}</p>
          <p className="truncate text-xs opacity-90">{SPM_SPECIALIST.title}</p>
        </div>
        <button
          type="button"
          onClick={close}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/15"
          aria-label="Close specialist chat"
        >
          <SpmIcon name="close" />
        </button>
      </header>

      <div
        ref={listRef}
        className="flex max-h-[min(50vh,22rem)] flex-col gap-3 overflow-y-auto bg-[var(--spm-surface-container-low)] px-4 py-4"
        aria-live="polite"
      >
        {messages.map((message, index) => {
          const isUser = message.role === "user";
          return (
            <div
              key={`${message.role}-${index}`}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? "rounded-br-md bg-[var(--spm-primary)] text-[var(--spm-on-primary)]"
                    : "rounded-bl-md border border-[var(--spm-outline-variant)] bg-white text-[var(--spm-on-surface)]"
                }`}
              >
                {message.content.split("\n").map((line, lineIndex) => (
                  <p key={lineIndex} className={lineIndex > 0 ? "mt-2" : undefined}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          );
        })}

        {loading ? (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-[var(--spm-outline-variant)] bg-white px-4 py-3 text-sm text-[var(--spm-on-surface-variant)]">
              <span className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--spm-secondary)] [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--spm-secondary)] [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--spm-secondary)] [animation-delay:300ms]" />
              </span>
              {SPM_SPECIALIST.name} is typing…
            </div>
          </div>
        ) : null}
      </div>

      {suggestions.length > 0 ? (
        <div className="flex flex-wrap gap-2 border-t border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-lowest)] px-3 py-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              disabled={loading}
              onClick={() => void sendMessage(suggestion)}
              className="rounded-full border border-[var(--spm-outline-variant)] bg-[var(--spm-tertiary-fixed)]/40 px-3 py-1 text-xs font-semibold text-[var(--spm-on-surface)] transition-colors hover:bg-[var(--spm-tertiary-container)] disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="border-t border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-lowest)] p-3"
      >
        {error ? (
          <p className="spm-body-md mb-2 rounded-lg bg-[var(--spm-error-container)] px-3 py-2 text-[var(--spm-on-error-container)]" role="alert">
            {error}
          </p>
        ) : null}
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            rows={1}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void sendMessage(draft);
              }
            }}
            placeholder="Ask about food, delivery, rewards…"
            disabled={loading}
            className="max-h-24 min-h-[2.75rem] flex-1 resize-none rounded-xl border-2 border-[var(--spm-outline)] bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--spm-tertiary)] disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={loading || !draft.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--spm-secondary)] text-[var(--spm-on-secondary)] transition-opacity hover:opacity-90 disabled:opacity-40"
            aria-label="Send message"
          >
            <SpmIcon name="send" className="text-xl" />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-[var(--spm-on-surface-variant)]">
          <span>{SPM_SPECIALIST.status}</span>
          <button
            type="button"
            onClick={handleClearChat}
            className="underline decoration-dotted underline-offset-2 hover:text-[var(--spm-primary)]"
          >
            Clear chat
          </button>
        </div>
      </form>
    </div>
  );
}
