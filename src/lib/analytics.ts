// GA4 Analytics utility — custom events, user properties, consent mode

type GtagCommand = "config" | "event" | "set" | "consent";

declare global {
  interface Window {
    gtag: (...args: [GtagCommand, ...unknown[]]) => void;
    dataLayer: unknown[];
  }
}

function gtag(...args: [GtagCommand, ...unknown[]]) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag(...args);
  }
}

// ── Custom Events ──────────────────────────────────────────────

export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean>,
) {
  gtag("event", name, params);
}

// Chatbot events
export function trackChatbotOpen() {
  trackEvent("chatbot_open");
}

export function trackChatbotMessage(topic: string) {
  trackEvent("chatbot_message_sent", { topic });
}

export function trackChatbotQuickAction(action: string) {
  trackEvent("chatbot_quick_action", { action });
}

export function trackChatbotNudgeShown() {
  trackEvent("chatbot_nudge_shown");
}

export function trackChatbotNudgeClicked() {
  trackEvent("chatbot_nudge_clicked");
}

// Pricing calculator events
export function trackCalculatorInteract(field: string, value: string) {
  trackEvent("calculator_interact", { field, value });
}

export function trackCalculatorChannelToggle(channel: string, enabled: boolean) {
  trackEvent("calculator_channel_toggle", { channel, enabled });
}

export function trackCalculatorAddonToggle(addon: string, enabled: boolean) {
  trackEvent("calculator_addon_toggle", { addon, enabled });
}

export function trackCalculatorQuoteClick(total: number) {
  trackEvent("calculator_quote_click", { estimated_total: total });
}

// WhatsApp CTA events
export function trackWhatsAppCTA(source: string) {
  trackEvent("whatsapp_cta_click", { source });
}

// Navigation / CTA events
export function trackCTAClick(cta: string, source: string) {
  trackEvent("cta_click", { cta, source });
}

// ── User Properties (Region Tracking) ──────────────────────────

export function setUserRegionProperties() {
  if (typeof window === "undefined") return;

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone; // e.g. "Africa/Lagos"
  const locale = navigator.language || "en"; // e.g. "en-NG"
  const isNigerian = tz === "Africa/Lagos" || locale.endsWith("-NG");

  gtag("set", "user_properties", {
    timezone: tz,
    locale,
    is_nigerian: isNigerian,
    country_code: isNigerian ? "NG" : "other",
  });
}

// ── Consent Mode v2 (NDPR Compliance) ──────────────────────────

export function setDefaultConsent() {
  if (typeof window === "undefined") return;
  // Must run before gtag config — called from consent banner init
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500,
  });
}

export function grantConsent() {
  gtag("consent", "update", {
    analytics_storage: "granted",
  });
  localStorage.setItem("ss_consent", "granted");
}

export function denyConsent() {
  gtag("consent", "update", {
    analytics_storage: "denied",
  });
  localStorage.setItem("ss_consent", "denied");
}

export function getStoredConsent(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ss_consent");
}
