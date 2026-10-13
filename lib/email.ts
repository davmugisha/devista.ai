// The one rule for what counts as an email address, shared by the booking form and the email
// updates signup, in the browser and on the server.

export const EMAIL_MAX = 254;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isEmail(value: string) {
  return EMAIL.test(value);
}

/** What is wrong with an address, in words that say how to fix it; `empty` is the message for a blank one. */
export function emailError(raw: string, empty: string): string | undefined {
  const value = raw.trim();
  if (!value) return empty;
  if (value.length > EMAIL_MAX) return 'This email address is too long. Check it and try again.';
  if (!isEmail(value)) return 'Enter an email address in the format name@example.com.';
}
