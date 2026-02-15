"use client";
import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";

type Message = { role: "bot" | "user"; text: string };

const responses: Array<{ keywords: string[]; reply: string }> = [
  {
    keywords: ["price", "cost", "how much", "pricing", "plan", "package"],
    reply:
      "Our plans start at \u20A650,000/month for SMEs. Check out our pricing page at /pricing or I can connect you with sales on WhatsApp!",
  },
  {
    keywords: ["demo", "try", "trial", "test"],
    reply:
      "You can try our chatbot live on WhatsApp! Send 'join neighbor-crew' to +1 (415) 523-8886. We also offer a 14-day free trial.",
  },
  {
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon"],
    reply:
      "Hello! Welcome to ShadowSpark. We build AI chatbots, BI dashboards, and automation tools for Nigerian businesses. What would you like to know?",
  },
  {
    keywords: ["chatbot", "whatsapp", "bot", "automate"],
    reply:
      "Our AI chatbots handle customer queries 24/7 on WhatsApp, web, and SMS. They can answer FAQs, qualify leads, and escalate to your team when needed.",
  },
  {
    keywords: ["dashboard", "analytics", "report", "data", "bi"],
    reply:
      "Our BI dashboards connect to your existing data sources and give you real-time insights on sales, customers, and operations. No technical skills required!",
  },
  {
    keywords: ["rpa", "automation", "workflow", "invoice", "process"],
    reply:
      "We build custom RPA workflows that automate repetitive tasks like invoice processing, data entry, and report generation. Most setups take 2-4 weeks.",
  },
  {
    keywords: ["about", "team", "who", "company", "location"],
    reply:
      "We're based in Port Harcourt, Nigeria. ShadowSpark Technologies builds AI solutions for African SMEs. Visit our About page to learn more!",
  },
  {
    keywords: ["contact", "speak", "call", "reach", "support"],
    reply:
      "The fastest way to reach us is WhatsApp! Click the green button below, or email us. We typically respond within 30 minutes.",
  },
];

function findReply(text: string): string {
  const lower = text.toLowerCase();
  for (const entry of responses) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.reply;
    }
  }
  return "Thanks for your message! For detailed assistance, chat with our full AI on WhatsApp or sign up for a free trial. Our team typically responds within 30 minutes.";
}

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const proactiveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Proactive engagement — show nudge after 10s if user hasn't interacted
  useEffect(() => {
    proactiveTimerRef.current = setTimeout(() => {
      if (!hasInteracted) {
        setShowProactive(true);
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
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setLoading(true);

    const reply = findReply(trimmed);

    await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
    setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    setLoading(false);
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
              onClick={handleOpen}
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
              <p className="text-sm font-semibold text-white">
                ShadowSpark AI
              </p>
              <p className="text-xs text-white/70">Online</p>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex gap-2 overflow-x-auto border-b border-white/5 px-4 py-2">
            {["Pricing", "Demo", "Chatbot", "Dashboard"].map((topic) => (
              <button
                key={topic}
                onClick={() => sendMessage(topic)}
                className="shrink-0 rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400 transition-colors hover:border-[#d4a843] hover:text-[#d4a843]"
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
          <a
            href="https://wa.me/2349037621612?text=Hi%2C%20I%27m%20interested%20in%20ShadowSpark"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-4 mb-2 flex items-center justify-center gap-2 rounded-lg bg-green-600/20 px-3 py-1.5 text-xs text-green-400 transition-colors hover:bg-green-600/30"
          >
            Continue on WhatsApp for full AI support
          </a>

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
