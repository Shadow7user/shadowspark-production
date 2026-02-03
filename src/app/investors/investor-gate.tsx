"use client";

import { Loader2, Lock } from "lucide-react";
import { useState } from "react";

interface InvestorGateProps {
  readonly children: React.ReactNode;
  readonly initialAuthenticated?: boolean;
}

export function InvestorGate({
  children,
  initialAuthenticated = false,
}: InvestorGateProps) {
  const [password, setPassword] = useState("");
  const [granted, setGranted] = useState(initialAuthenticated);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (granted) return <>{children}</>;

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!password.trim()) {
      setError("Please enter an access code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/investors/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setGranted(true);
      } else {
        setError(
          "Invalid access code. Contact investors@shadowspark-technologies.com for access.",
        );
      }
    } catch {
      setError("Network error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 border rounded-2xl bg-card shadow-xl">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-cyan-400/10">
            <Lock className="h-8 w-8 text-cyan-400" />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-2 text-center">Investor Access</h2>
        <p className="text-muted-foreground text-center mb-6">
          This page contains confidential investment information. Enter your
          access code to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Access code"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg bg-background focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 outline-none transition"
              autoFocus
              disabled={loading}
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-semibold disabled:opacity-50 hover:from-cyan-600 hover:to-purple-600 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Access Investment Materials"
            )}
          </button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Need access? Contact{" "}
          <a
            href="mailto:investors@shadowspark-technologies.com"
            className="text-cyan-400 hover:underline"
          >
            investors@shadowspark-technologies.com
          </a>
        </p>
      </div>
    </div>
  );
}
