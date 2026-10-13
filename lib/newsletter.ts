// The email updates signup in the footer: the rule the form shows inline and /api/subscribe runs
// again on the server.
import { emailError } from './email';

/** What is wrong with the address, in words that say how to fix it. Undefined means it is fine. */
export function newsletterEmailError(raw: string): string | undefined {
  return emailError(raw, 'Enter your email address to subscribe.');
}
