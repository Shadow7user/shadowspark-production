"use client";
import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import WhatsAppLink from "@/components/WhatsAppLink";
import {
  trackChatbotOpen,
  trackChatbotMessage,
  trackChatbotQuickAction,
  trackChatbotNudgeShown,
  trackChatbotNudgeClicked,
} from "@/lib/analytics";

type Message = { role: "bot" | "user"; text: string };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hi! I'm the ShadowSpark AI assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showProactive, setShowProactive] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [sessionId] = useState(
    () => crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
  );
  const waSalesNumber = process.env.NEXT_PUBLIC_WA_SALES_NUMBER ?? "2348107677660";
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const proactiveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const decoderRef = useRef(new TextDecoder());
  const messageCountRef = useRef(0);

  // Proactive engagement — show nudge after 10s if user hasn't interacted
  useEffect(() => {
    proactiveTimerRef.current = setTimeout(() => {
      if (!hasInteracted) {
        setShowProactive(true);
        trackChatbotNudgeShown();
      }
    }, 10000);
    return () => {
      if (proactiveTimerRef.current) clearTimeout(proactiveTimerRef.current);
    };
  }, [hasInteracted]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function handleOpen() {
    setOpen(true);
    setShowProactive(false);
    setHasInteracted(true);
    trackChatbotOpen();
  }

  function handleClose() {
    setOpen(false);
  }

  function dismissProactive() {
    setShowProactive(false);
    setHasInteracted(true);
  }

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const trimmed = text.trim();

    setInput("");
    setHasInteracted(true);
    setMessages((prev) => [...prev, { role: "user", text: trimmed }, { role: "bot", text: "" }]);
    setLoading(true);
    trackChatbotMessage(trimmed);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, sessionId }),
      });

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = decoderRef.current;
      let botReply = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        botReply += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "bot", text: botReply };
          return next;
        });
      }

      if (botReply) {
        messageCountRef.current += 1;
        if (messageCountRef.current >= 3) {
          setShowWhatsApp(true);
        }
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "bot",
          text: "Sorry, I had trouble responding. Please try again or reach us on WhatsApp.",
        };
        return next;
      });
    } finally {
      setLoading(false);
    }
  }

  function handleSend() {
    sendMessage(input);
  }

  return (
    <>
      {/* Proactive nudge bubble */}
      {showProactive && !open && (
        <div className="fixed bottom-24 right-6 z-50 animate-slide-up">
          <div className="relative max-w-[260px] rounded-xl border border-[#d4a843]/10 bg-[#0f1521] p-4 shadow-2xl">
            <button
              onClick={dismissProactive}
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-xs text-slate-400 hover:bg-slate-700"
            >
              <X size={12} />
            </button>
            <p className="text-sm text-slate-300">
              Need help choosing the right AI solution for your business?
            </p>
            <button
              onClick={() => {
                trackChatbotNudgeClicked();
                handleOpen();
              }}
              className="mt-2 text-xs font-semibold text-[#d4a843] hover:text-[#e8c56d]"
            >
              Chat with us &rarr;
            </button>
          </div>
          {/* Arrow pointing to button */}
          <div className="mr-6 flex justify-end">
            <div className="h-3 w-3 rotate-45 border-b border-r border-[#d4a843]/10 bg-[#0f1521]" />
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={open ? handleClose : handleOpen}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all ${
          open
            ? "bg-slate-800 hover:bg-slate-700"
            : "bg-gradient-to-r from-[#d4a843] to-[#c0935a] animate-glow-pulse hover:from-[#e8c56d] hover:to-[#d4a843]"
        }`}
      >
        {open ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageCircle size={24} className="text-white" />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[480px] w-[360px] flex-col overflow-hidden rounded-2xl border border-[#d4a843]/10 bg-[#0f1521] shadow-2xl sm:w-[360px] max-sm:left-4 max-sm:right-4 max-sm:w-auto">
          {/* Header */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-[#d4a843] to-[#c0935a] px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">ShadowSpark AI</p>
              <p className="text-xs text-white/70">Online</p>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex gap-2 overflow-x-auto border-b border-white/5 px-4 py-2">
            {["Pricing", "Demo", "Chatbot", "Dashboard"].map((topic) => (
              <button
                key={topic}
                onClick={() => {
                  trackChatbotQuickAction(topic);
                  sendMessage(topic);
                }}
                className="shrink-0 rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400 transition-colors hover:border-[#d4a843] hover:text-[#d4a843]"
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-[#d4a843]/15 text-[#e8c56d] rounded-tr-none"
                      : "bg-slate-800 text-slate-300 rounded-tl-none"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-lg rounded-tl-none bg-slate-800 px-3 py-2">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500 [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500 [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* WhatsApp CTA */}
          {(showWhatsApp || messages.length >= 4) && (
            <WhatsAppLink
              href={`https://wa.me/${waSalesNumber}?text=${encodeURIComponent("Hi Reginald! Interested in ShadowSpark services.")}`}
              source="chatwidget"
              className="mx-4 mb-2 flex items-center justify-center gap-2 rounded-lg bg-green-600/20 px-3 py-1.5 text-xs text-green-400 transition-colors hover:bg-green-600/30"
            >
              Continue on WhatsApp for full AI support
            </WhatsAppLink>
          )}

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-white/5 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-[#d4a843]"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#d4a843] text-white transition-colors hover:bg-[#c0935a] disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
