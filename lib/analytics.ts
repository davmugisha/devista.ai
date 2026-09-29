// One place for conversion events. Vercel Web Analytics receives them in production; custom
// events need a Vercel plan that includes them, and are ignored silently otherwise.
import { track as vercelTrack } from '@vercel/analytics';

export type ConversionEvent = 'cta_click' | 'form_start' | 'form_submit' | 'form_error';

export function track(event: ConversionEvent, props: Record<string, string> = {}) {
  try {
    vercelTrack(event, props);
  } catch {
    // Analytics must never break the page.
  }
}
