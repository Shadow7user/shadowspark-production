import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://e22337cde8180a705e4f558734a1f868@o4510818679848960.ingest.us.sentry.io/4510840920932352",
  tracesSampleRate: 1.0,
  debug: false,
});
