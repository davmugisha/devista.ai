// The one rule for what counts as an email address, shared by the booking form and the email
// updates signup, in the browser and on the server.

export const EMAIL_MAX = 254;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isEmail(value: string) {
  return EMAIL.test(value);
}
