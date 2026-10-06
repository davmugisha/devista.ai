import { siInstagram, siX } from 'simple-icons';
import { BRAND, type SocialNetwork } from '@/lib/brand';
import { SITE } from '@/lib/site';

// simple-icons no longer carries LinkedIn's logo, so its "in" mark is drawn here on the same
// 24 by 24 grid. The letters are cut out of the square, so it fills with the even-odd rule.
const LINKEDIN =
  'M1.77 0h20.46C23.2 0 24 .77 24 1.73v20.54c0 .96-.8 1.73-1.77 1.73H1.77C.8 24 0 23.23 0 22.27V1.73C0 .77.8 0 1.77 0Z' +
  'M3.56 9h3.56v11.45H3.56ZM5.34 3.3a2.06 2.06 0 1 1 0 4.13 2.06 2.06 0 0 1 0-4.13Z' +
  'M9.35 9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35Z';

const ICONS: Record<SocialNetwork, { title: string; path: string; evenOdd?: boolean }> = {
  instagram: { title: 'Instagram', path: siInstagram.path },
  linkedin: { title: 'LinkedIn', path: LINKEDIN, evenOdd: true },
  x: { title: 'X', path: siX.path },
};

/** Icon links to the brand's social profiles (lib/brand.ts). Renders nothing when there are none. */
export function SocialLinks({ className = '' }: { className?: string }) {
  if (!BRAND.social.length) return null;
  return (
    <nav aria-label="Social media" className={className}>
      <ul className="flex items-center gap-3">
        {BRAND.social.map(({ network, href }) => {
          const icon = ICONS[network];
          return (
            <li key={network}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${SITE.shortName} on ${icon.title}`}
                className="flex size-10 items-center justify-center rounded-dot border border-rule bg-paper text-graphite transition-colors duration-150 hover:border-signal hover:bg-signal-tint hover:text-signal"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
                  <path d={icon.path} fillRule={icon.evenOdd ? 'evenodd' : undefined} />
                </svg>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
