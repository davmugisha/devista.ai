// The email updates signup in the footer: the rule the form shows inline and /api/subscribe runs
// again on the server.
import { EMAIL_MAX, isEmail } from './email';

/** What is wrong with the address, in words that say how to fix it. Undefined means it is fine. */
export function newsletterEmailError(raw: string): string | undefined {
  const value = raw.trim();
  if (!value) return 'Enter your email address to subscribe.';
  if (value.length > EMAIL_MAX) return 'This email address is too long. Check it and try again.';
  if (!isEmail(value)) return 'Enter an email address in the format name@company.com.';
}
