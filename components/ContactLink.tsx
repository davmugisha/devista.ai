import { CONTACT } from '@/lib/site';

/** The contact address as a mailto link. The only place the site links its address (see CONTACT). */
export function ContactLink({ className = 'rounded-chip font-medium text-ink underline underline-offset-4 transition-colors hover:text-signal-bright' }: { className?: string }) {
  return (
    <a href={`mailto:${CONTACT.email}`} className={className}>
      {CONTACT.email}
    </a>
  );
}
