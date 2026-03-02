"use client";
import { usePageView } from "@/hooks/useAnalytics";

/**
 * Thin client component that fires a Firebase Analytics page_view event.
 * Rendered inside server pages that also export `metadata`.
 */
export default function PageTracker({ page }: { page: string }) {
  usePageView(page);
  return null;
}
