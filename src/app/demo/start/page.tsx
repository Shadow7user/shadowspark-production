"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const BG_OBSIDIAN = "#0A0A0C";
const SOFT_WHITE = "#E0E0E0";
const ACCENT_CYAN = "#00F2FF";
const SHADOW_CHAT_PLACEHOLDERS = [
  "I want to launch a SaaS...",
  "I need to automate my client onboarding...",
  "I want to dominate inbound demand...",
] as const;

type GenerateDemoResponse =
  | { success: true; sessionId: string }
  | { success: false; error?: string };

type ContactFormState = {
  organizationName: string;
  whatsapp: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseGenerateDemoResponse(value: unknown): GenerateDemoResponse | null {
  if (!isRecord(value)) return null;

  if (value.success === true && typeof value.sessionId === "string") {
    return { success: true, sessionId: value.sessionId };
  }

  if (value.success === false) {
    return {
      success: false,
      ...(typeof value.error === "string" ? { error: value.error } : {}),
    };
  }

  return null;
}

function useTypewriterPlaceholder(enabled: boolean): string {
  const reduceMotion = useReducedMotion();
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!enabled || reduceMotion) return;

    const current = SHADOW_CHAT_PLACEHOLDERS[placeholderIndex] ?? "";
    const atEnd = characterCount >= current.length;
    const atStart = characterCount <= 0;
    const delay = !isDeleting && atEnd ? 900 : isDeleting && atStart ? 220 : isDeleting ? 18 : 28;

    const timeoutId = window.setTimeout(() => {
      if (!isDeleting) {
        const nextCount = Math.min(characterCount + 1, current.length);
        setText(current.slice(0, nextCount));
        setCharacterCount(nextCount);
        if (nextCount >= current.length) {
          setIsDeleting(true);
        }
        return;
      }

      const nextCount = Math.max(characterCount - 1, 0);
      setText(current.slice(0, nextCount));
      setCharacterCount(nextCount);
      if (nextCount <= 0) {
        setIsDeleting(false);
        setPlaceholderIndex((currentIndex) => (currentIndex + 1) % SHADOW_CHAT_PLACEHOLDERS.length);
      }
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [characterCount, enabled, isDeleting, placeholderIndex, reduceMotion]);

  return enabled && !reduceMotion ? text : "";
}

function ShadowSparkStartContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();

  const [goal, setGoal] = useState("");
  const [debouncedGoal, setDebouncedGoal] = useState("");
  const [stage, setStage] = useState<"chat" | "details">("chat");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contact, setContact] = useState<ContactFormState>({
    organizationName: "",
    whatsapp: "",
  });

  const industry = (searchParams.get("industry") ?? "").trim();
  const showTypewriter = stage === "chat" && goal.trim().length === 0;
  const placeholder = useTypewriterPlaceholder(showTypewriter);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedGoal(goal.trim().toLowerCase());
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [goal]);

  const foundryMode = debouncedGoal.includes("launch");
  const autoOpsMode = debouncedGoal.includes("automate");

  function beginContactStep(): void {
    setErrorMessage("");

    if (!goal.trim()) {
      setErrorMessage("Enter the business goal first.");
      return;
    }

    if (!industry) {
      setErrorMessage("Open this page with an industry in the URL, for example `/demo/start?industry=Logistics`.");
      return;
    }

    setStage("details");
  }

  async function submitDemo(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setErrorMessage("");

    const payload = {
      organizationName: contact.organizationName.trim(),
      whatsapp: contact.whatsapp.trim(),
      industry,
      intent: goal.trim(),
      challenge: goal.trim(),
    };

    if (!payload.organizationName || !payload.whatsapp || !payload.industry || !payload.intent) {
      setErrorMessage("Organization name, WhatsApp, industry, and intent are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/generate-demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let json: unknown = null;
      try {
        json = await response.json();
      } catch {
        json = null;
      }

      const parsed = parseGenerateDemoResponse(json);

      if (!response.ok) {
        setErrorMessage(parsed?.success === false ? parsed.error ?? "Request failed." : "Request failed.");
        return;
      }

      if (!parsed || parsed.success !== true) {
        setErrorMessage("Unexpected server response.");
        return;
      }

      router.push(`/preview/${encodeURIComponent(parsed.sessionId)}`);
    } catch {
      setErrorMessage("Network error. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main
      className="min-h-screen overflow-hidden px-6 py-14"
      style={{
        backgroundColor: BG_OBSIDIAN,
        color: SOFT_WHITE,
        backgroundImage:
          "radial-gradient(720px 420px at 12% 12%, rgba(0, 242, 255, 0.12), transparent 60%), radial-gradient(860px 480px at 88% 16%, rgba(0, 242, 255, 0.06), transparent 62%), linear-gradient(180deg, rgba(255,255,255,0.02), transparent)",
      }}
    >
      <div className="mx-auto flex min-h-[82vh] w-full max-w-4xl flex-col justify-center">
        <motion.div
          animate={{
            y: goal.trim() ? -18 : 0,
            scale: goal.trim() ? 0.96 : 1,
          }}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#00F2FF]/90">
            Shadow-Chat
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] text-[#E0E0E0] sm:text-6xl">
            State the move.
            <span className="block text-[#00F2FF]">We shape the system.</span>
          </h1>
          <p className="mt-4 text-sm text-[#E0E0E0]/60 sm:text-base">
            Intent comes first. Contact details come after.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <span
              className="rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.18em] transition"
              style={{
                borderColor: foundryMode ? "rgba(0, 242, 255, 0.75)" : "rgba(224, 224, 224, 0.12)",
                backgroundColor: foundryMode ? "rgba(0, 242, 255, 0.10)" : "rgba(255,255,255,0.03)",
                boxShadow: foundryMode ? "0 0 28px rgba(0, 242, 255, 0.18)" : "none",
              }}
            >
              Foundry Mode
            </span>
            <span
              className="rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.18em] transition"
              style={{
                borderColor: autoOpsMode ? "rgba(0, 242, 255, 0.75)" : "rgba(224, 224, 224, 0.12)",
                backgroundColor: autoOpsMode ? "rgba(0, 242, 255, 0.10)" : "rgba(255,255,255,0.03)",
                boxShadow: autoOpsMode ? "0 0 28px rgba(0, 242, 255, 0.18)" : "none",
              }}
            >
              Auto-Ops
            </span>
            <span className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-[#E0E0E0]/55">
              {industry ? `Industry: ${industry}` : "Industry missing"}
            </span>
          </div>
        </motion.div>

        <div className="mt-10">
          <AnimatePresence mode="wait" initial={false}>
            {stage === "chat" ? (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: [1, 0.92, 0],
                  scale: [1, 1.02, 0.88],
                  rotate: reduceMotion ? 0 : [0, 1.5, -4],
                  x: reduceMotion ? 0 : [0, -10, 16, -8],
                  filter: reduceMotion ? "none" : ["blur(0px)", "blur(2px)", "blur(12px)"],
                }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                className="mx-auto max-w-3xl"
              >
                <div
                  className="rounded-[2rem] border bg-white/[0.04] p-4 shadow-2xl backdrop-blur-md sm:p-6"
                  style={{
                    borderColor: "rgba(0, 242, 255, 0.25)",
                    boxShadow:
                      "0 30px 90px rgba(0,0,0,0.72), inset 0 1px 0 rgba(255,255,255,0.05), 0 0 38px rgba(0, 242, 255, 0.08)",
                  }}
                >
                  <input
                    value={goal}
                    onChange={(event) => setGoal(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        beginContactStep();
                      }
                    }}
                    placeholder={placeholder || "Type the business goal..."}
                    className="w-full border-0 bg-transparent px-4 py-6 text-2xl font-semibold tracking-[-0.03em] text-[#E0E0E0] outline-none placeholder:text-[#E0E0E0]/28"
                    aria-label="Shadow-Chat intent input"
                    autoFocus
                  />
                </div>

                <div className="mt-5 flex justify-center">
                  <button
                    type="button"
                    onClick={beginContactStep}
                    className="rounded-full px-8 py-3 text-sm font-bold tracking-[0.24em] text-[#0A0A0C] transition hover:opacity-95"
                    style={{
                      backgroundColor: ACCENT_CYAN,
                      boxShadow: "0 0 32px rgba(0, 242, 255, 0.24), 0 18px 40px rgba(0,0,0,0.48)",
                    }}
                  >
                    IGNITE
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="details"
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.32, ease: "easeOut" }}
                onSubmit={submitDemo}
                className="mx-auto max-w-2xl"
              >
                <div
                  className="rounded-[2rem] border bg-white/[0.04] p-6 shadow-2xl backdrop-blur-md sm:p-8"
                  style={{
                    borderColor: "rgba(0, 242, 255, 0.22)",
                    boxShadow:
                      "0 30px 90px rgba(0,0,0,0.72), inset 0 1px 0 rgba(255,255,255,0.04), 0 0 32px rgba(0, 242, 255, 0.08)",
                  }}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#00F2FF]/90">
                    Contact Capture
                  </p>
                  <p className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-[#E0E0E0]/72">
                    {goal}
                  </p>

                  <div className="mt-6 grid gap-5">
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-[#E0E0E0]/60">
                        Organization Name
                      </label>
                      <input
                        value={contact.organizationName}
                        onChange={(event) =>
                          setContact((current) => ({
                            ...current,
                            organizationName: event.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[#E0E0E0] outline-none transition focus:border-[#00F2FF]/70 focus:shadow-[0_0_24px_rgba(0,242,255,0.14)]"
                        placeholder="e.g. ShadowCourier"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-[#E0E0E0]/60">
                        WhatsApp
                      </label>
                      <input
                        value={contact.whatsapp}
                        onChange={(event) =>
                          setContact((current) => ({
                            ...current,
                            whatsapp: event.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[#E0E0E0] outline-none transition focus:border-[#00F2FF]/70 focus:shadow-[0_0_24px_rgba(0,242,255,0.14)]"
                        placeholder="+2348012345678"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => setStage("chat")}
                      className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold tracking-[0.18em] text-[#E0E0E0]/70 transition hover:bg-white/[0.04]"
                    >
                      BACK
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-full px-8 py-3 text-sm font-bold tracking-[0.24em] text-[#0A0A0C] transition disabled:opacity-60"
                      style={{
                        backgroundColor: ACCENT_CYAN,
                        boxShadow: "0 0 32px rgba(0, 242, 255, 0.24), 0 18px 40px rgba(0,0,0,0.48)",
                      }}
                    >
                      {isSubmitting ? "IGNITING..." : "IGNITE"}
                    </button>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {errorMessage ? (
          <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-[#00F2FF]/20 bg-[#00F2FF]/8 px-4 py-3 text-sm text-[#E0E0E0]">
            {errorMessage}
          </div>
        ) : null}
      </div>
    </main>
  );
}

export default function StartPage() {
  return (
    <Suspense
      fallback={
        <div
          className="flex min-h-screen items-center justify-center"
          style={{ backgroundColor: BG_OBSIDIAN, color: SOFT_WHITE }}
        >
          Loading...
        </div>
      }
    >
      <ShadowSparkStartContent />
    </Suspense>
  );
}
