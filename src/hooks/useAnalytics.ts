'use client';
import { useEffect, useCallback } from 'react';
import { logEvent } from 'firebase/analytics';
import { getFirebaseAnalytics } from '@/lib/firebase';

// ShadowSpark conversion events
export type ShadowSparkEvent =
  | 'page_view'
  | 'demo_requested'
  | 'pricing_viewed'
  | 'pricing_cta_clicked'
  | 'signup_started'
  | 'signup_completed'
  | 'whatsapp_cta_clicked'
  | 'blog_article_read'
  | 'contact_form_submitted'
  | 'login_success'
  | 'chatbot_demo_started';

export function useTrackEvent() {
  return useCallback(async (
    eventName: ShadowSparkEvent,
    params?: Record<string, string | number | boolean>
  ) => {
    try {
      const analytics = await getFirebaseAnalytics();
      if (analytics) {
        // firebase logEvent typings are strict; cast eventName to string to avoid
      // conflicts with the generated CustomEventName union.
      logEvent(analytics, eventName as string, {
          ...params,
          timestamp: Date.now(),
        });
      }
    } catch {
      console.warn('Analytics event failed silently:', eventName);
    }
  }, []);
}

export function usePageView(pageName: string) {
  useEffect(() => {
    getFirebaseAnalytics().then(analytics => {
      if (analytics) {
        logEvent(analytics, 'page_view', {
          page_title: pageName,
          page_location: window.location.href,
          page_path: window.location.pathname,
        });
      }
    });
  }, [pageName]);
}
