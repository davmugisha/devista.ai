'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

/** Where the choice is kept, in this browser only. The script in app/layout.tsx reads the same key. */
const THEME_KEY = 'theme';

const OPTIONS = [
  { theme: 'light', label: 'Light theme', Icon: Sun },
  { theme: 'dark', label: 'Dark theme', Icon: Moon },
] as const;

/** The light and dark switch in the footer. Dark is the default; light is a saved choice. */
export function ThemeToggle() {
  // Unknown until mounted, so the server and the first client render agree.
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  }, []);

  const choose = (next: Theme) => {
    const root = document.documentElement;
    if (next === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Storage can be blocked; the theme still applies for this page.
    }
    setTheme(next);
  };

  return (
    <div role="group" aria-label="Colour theme" data-theme-toggle className="inline-flex items-center gap-1 rounded-dot border border-rule bg-paper p-1">
      {OPTIONS.map(({ theme: t, label, Icon }) => {
        const on = theme === t;
        return (
          <button
            key={t}
            type="button"
            aria-label={label}
            aria-pressed={theme ? on : undefined}
            title={label}
            onClick={() => choose(t)}
            className={
              'flex size-8 items-center justify-center rounded-dot transition-colors duration-200 ' +
              (on ? 'bg-signal text-on-signal' : 'text-graphite hover:bg-panel hover:text-ink')
            }
          >
            <Icon aria-hidden="true" className="size-4" strokeWidth={1.8} />
          </button>
        );
      })}
    </div>
  );
}
