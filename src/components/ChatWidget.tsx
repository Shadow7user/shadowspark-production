"use client";
import { useState } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: "bot" | "user"; text: string }>>([
    { role: "bot", text: "Hi! I'm the ShadowSpark AI assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user" as const, text }]);
    setLoading(true);

    // Quick local responses for common queries
    const lower = text.toLowerCase();
    let reply = "";
    if (lower.includes("price") || lower.includes("cost") || lower.includes("how much")) {
      reply = "Our plans start at \u20A650,000/month for SMEs. Want me to connect you with our sales team on WhatsApp?";
    } else if (lower.includes("demo") || lower.includes("try")) {
      reply = "You can try our chatbot live on WhatsApp! Send 'join neighbor-crew' to +1 (415) 523-8886. Or click the WhatsApp button below.";
    } else if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
      reply = "Hello! Welcome to ShadowSpark. We build AI chatbots, BI dashboards, and automation tools for Nigerian businesses. What would you like to know?";
    } else {
      reply = `Thanks for your message! For detailed assistance, chat with our full AI on WhatsApp or sign up for a free trial. Our team typically responds within 30 minutes.`;
    }

    // Simulate typing delay
    await new Promise((r) => setTimeout(r, 800));
    setMessages((prev) => [...prev, { role: "bot" as const, text: reply }]);
    setLoading(false);
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all ${
          open
            ? "bg-slate-700 hover:bg-slate-600"
            : "bg-gradient-to-r from-cyan-500 to-purple-600 animate-pulse-glow hover:from-cyan-600 hover:to-purple-700"
        }`}
      >
        {open ? <X size={24} className="text-white" /> : <MessageCircle size={24} className="text-white" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[480px] w-[360px] flex-col overflow-hidden rounded-2xl border border-purple-500/20 bg-slate-900 shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-cyan-600 to-purple-600 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">ShadowSpark AI</p>
              <p className="text-xs text-white/70">Online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-cyan-600/20 text-cyan-200 rounded-tr-none"
                      : "bg-slate-800 text-slate-300 rounded-tl-none"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-lg rounded-tl-none bg-slate-800 px-3 py-2 text-sm text-slate-500">
                  Typing...
                </div>
              </div>
            )}
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
          <div className="flex items-center gap-2 border-t border-slate-800 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500 text-white transition-colors hover:bg-cyan-600 disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
