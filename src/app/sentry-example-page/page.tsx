"use client";

import * as Sentry from "@sentry/nextjs";

export default function SentryExamplePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold text-white">Sentry Test Page</h1>
        <p className="text-gray-400">
          Click the button to trigger a test error
        </p>

        <button
          type="button"
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
          onClick={() => {
            Sentry.captureException(new Error("Sentry Frontend Test Error"));
            throw new Error("Sentry Example Frontend Error");
          }}
        >
          Throw Frontend Error
        </button>

        <div className="pt-4">
          <a
            href="/api/sentry-example-api"
            className="text-cyan-400 hover:underline"
          >
            Test API Route Error →
          </a>
        </div>
      </div>
    </div>
  );
}
