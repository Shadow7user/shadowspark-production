'use client';
import { usePageView } from '@/hooks/useAnalytics';

export default function PageViewTracker({ pageName }: { pageName: string }) {
  usePageView(pageName);
  return null;
}
