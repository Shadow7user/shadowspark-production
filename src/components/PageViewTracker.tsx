"use client";
import { usePageView } from "@/hooks/useAnalytics";

export default function PageViewTracker({ page }: { page: string }) {
  usePageView(page);
  return null;
}
