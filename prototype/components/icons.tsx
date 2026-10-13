// The design's own icons, copied path for path from the boards in extracted/saydeed-app.
// All sit on a 24 unit grid with 2px round strokes; a few have filled dots.

import type { ReactNode, SVGProps } from 'react';

const dot = (cx: number, cy: number, r: number) => <circle cx={cx} cy={cy} r={r} fill="currentColor" stroke="none" />;

const PATHS = {
  back: <path d="M15 5l-7 7 7 7" />,
  chevronRight: <path d="M9 6l6 6-6 6" />,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  arrowRight: <path d="M5 12h13M13 6l6 6-6 6" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  menu: <path d="M5 9.5h14M5 14.5h14" />,
  more: (
    <>
      <circle cx="5.5" cy="12" r="1.4" />
      <circle cx="12" cy="12" r="1.4" />
      <circle cx="18.5" cy="12" r="1.4" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4 4" />
    </>
  ),
  pencil: (
    <>
      <path d="M4 20h4L19 9l-4-4L4 16z" />
      <path d="M13.5 6.5l4 4" />
    </>
  ),
  // Speech bubble: Inbox on the phone
  bubble: <path d="M19 11.5A7.5 7.5 0 1 0 15.8 17.64L19.6 19.4L18.3 14.67A7.5 7.5 0 0 0 19 11.5Z" />,
  // Speech bubble with dots: Chat and Chief of Staff
  chat: (
    <>
      <path d="M19 11.5A7.5 7.5 0 1 0 15.8 17.64L19.6 19.4L18.3 14.67A7.5 7.5 0 0 0 19 11.5Z" />
      {dot(9, 11.5, 1.25)}
      {dot(14, 11.5, 1.25)}
    </>
  ),
  // Tray: Inbox on the web
  inbox: (
    <>
      <path d="M4 13.5l2.6-7.2A2 2 0 0 1 8.5 5h7a2 2 0 0 1 1.9 1.3l2.6 7.2V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
      <path d="M4 13.5h4.5l1.5 2.5h4l1.5-2.5H20" />
    </>
  ),
  phone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  ),
  hangUp: (
    <path d="M2.5 14.2c5.2-4.9 13.8-4.9 19 0 .5.5.5 1.2 0 1.7l-2 2c-.4.4-1.1.5-1.6.1l-2.3-1.7c-.3-.2-.5-.6-.5-1v-2.3a13 13 0 0 0-6.2 0v2.3c0 .4-.2.8-.5 1l-2.3 1.7c-.5.4-1.2.3-1.6-.1l-2-2c-.5-.5-.5-1.2 0-1.7z" />
  ),
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </>
  ),
  micOff: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3M4 4l16 16" />
    </>
  ),
  speaker: (
    <>
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
      <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" />
    </>
  ),
  captions: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3.5" />
      <path d="M10.5 10a2.2 2.2 0 1 0 0 4M16.5 10a2.2 2.2 0 1 0 0 4" />
    </>
  ),
  pin: (
    <>
      <path d="M9 4h6l-1 5 3 3v2H7v-2l3-3z" />
      <path d="M12 14v6" />
    </>
  ),
  // Brain Map: the compass-like node mark, with filled nodes on the phone
  brainMap: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 9.5L13.5 7.5L15.5 13L10 15.5Z" />
      <path d="M8.5 9.5L15.5 13" />
      {dot(8.5, 9.5, 1.6)}
      {dot(13.5, 7.5, 1.6)}
      {dot(15.5, 13, 1.6)}
      {dot(10, 15.5, 1.6)}
    </>
  ),
  // Home on the web rail: the same mark without filled nodes
  home: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 9.5L13.5 7.5L15.5 13L10 15.5Z" />
      <path d="M8.5 9.5L15.5 13" />
    </>
  ),
  // Filled tiles: "show dashboard" on the phone dock
  grid: (
    <g fill="currentColor" stroke="none">
      <rect x="3" y="3" width="8" height="10" rx="2.4" />
      <rect x="13" y="3" width="8" height="6.5" rx="2.4" />
      <rect x="3" y="15" width="8" height="6" rx="2.4" />
      <rect x="13" y="11.5" width="8" height="9.5" rx="2.4" />
    </g>
  ),
  // Outline tiles: Dashboard in the phone menu
  dashboard: (
    <>
      <rect x="3.5" y="3.5" width="7.5" height="9.5" rx="2.2" />
      <rect x="13" y="3.5" width="7.5" height="6" rx="2.2" />
      <rect x="3.5" y="15" width="7.5" height="5.5" rx="2.2" />
      <rect x="13" y="11.5" width="7.5" height="9" rx="2.2" />
    </>
  ),
  goal: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      {dot(12, 12, 1.3)}
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
    </>
  ),
  tasks: <path d="M4 7l1.5 1.5L8 6M4 13l1.5 1.5L8 12M4 19l1.5 1.5L8 18M11 7.5h9M11 13.5h9M11 19.5h9" />,
  shieldCheck: (
    <>
      <path d="M12 3l7 3v5.5c0 4.5-3 8-7 9.5-4-1.5-7-5-7-9.5V6z" />
      <path d="M8.8 12l2.3 2.3 4.2-4.3" />
    </>
  ),
  store: (
    <>
      <path d="M3.5 9.5L5 4.5h14l1.5 5" />
      <path d="M3.5 9.5a2.83 2.83 0 0 0 5.67 0a2.83 2.83 0 0 0 5.66 0a2.83 2.83 0 0 0 5.67 0" />
      <path d="M5 12.5v7h14v-7M10 19.5v-4h4v4" />
    </>
  ),
  bag: (
    <>
      <path d="M5 8h14l-1.2 11a1.5 1.5 0 0 1-1.5 1.5H7.7a1.5 1.5 0 0 1-1.5-1.5z" />
      <path d="M9 10V7a3 3 0 0 1 6 0v3" />
    </>
  ),
  tag: (
    <>
      <path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3-8.7 8.7z" />
      <circle cx="8" cy="8" r="1.4" />
    </>
  ),
  org: (
    <>
      <rect x="9" y="3" width="6" height="5" rx="1.5" />
      <rect x="3" y="16" width="6" height="5" rx="1.5" />
      <rect x="15" y="16" width="6" height="5" rx="1.5" />
      <path d="M12 8v6M6 16v-2h12v2" />
    </>
  ),
  knowledge: (
    <>
      <path d="M5 4.5h9.5a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3z" />
      <path d="M5 17a3 3 0 0 1 3-3h9.5" />
    </>
  ),
  finance: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="3" />
      <path d="M3 10h18M16 14.5h1.5" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3.5" y="7" width="17" height="12.5" rx="3" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3.5 12.5h17" />
    </>
  ),
  code: <path d="M8.5 7L3.5 12l5 5M15.5 7l5 5-5 5" />,
  folder: <path d="M3.5 7a2 2 0 0 1 2-2h4l2 2.5h7a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" />,
  play: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M10.2 8.8v6.4l5-3.2z" />
    </>
  ),
  review: (
    <>
      <circle cx="6.5" cy="6" r="2.2" />
      <circle cx="6.5" cy="18" r="2.2" />
      <circle cx="17.5" cy="18" r="2.2" />
      <path d="M6.5 8.2v7.6M17.5 15.8V10a3 3 0 0 0-3-3h-4M12.5 5l-2 2 2 2" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="2.8" />
      <path d="M5 6v12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8V6M5 12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3.5l8.5 4.5L12 12.5 3.5 8z" />
      <path d="M3.5 12.5L12 17l8.5-4.5M3.5 16.5L12 21l8.5-4.5" />
    </>
  ),
  // Listing kinds
  workflow: (
    <>
      <rect x="3" y="3.5" width="7" height="6" rx="2" />
      <rect x="14" y="14.5" width="7" height="6" rx="2" />
      <path d="M6.5 9.5v2.5a3.5 3.5 0 0 0 3.5 3.5h4" />
    </>
  ),
  pipeline: (
    <>
      <path d="M4 6.5h10.5a3 3 0 0 1 0 6h-5a3 3 0 0 0 0 6H20" />
      <path d="M17.5 16l2.5 2.5-2.5 2.5" />
    </>
  ),
  agent: (
    <>
      <rect x="5" y="7" width="14" height="11" rx="3.5" />
      <path d="M12 7V4M9.5 12v1M14.5 12v1" />
    </>
  ),
  skill: <path d="M13 3L5 13.5h6L10 21l8-10.5h-6z" />,
  tool: (
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  ),
  person: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </>
  ),
  group: (
    <>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M15.5 5.6a3.2 3.2 0 0 1 0 5.8M17.5 14.2a5.5 5.5 0 0 1 3 4.8" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="3" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  fileUp: (
    <>
      <path d="M6 3.5h8l4 4V20a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 6 20z" />
      <path d="M12 11v6M9 14l3-3 3 3" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  star: <path d="M12 3.5l2.6 5.3 5.9.9-4.25 4.1 1 5.8L12 16.9l-5.25 2.7 1-5.8L3.5 9.7l5.9-.9z" fill="currentColor" stroke="none" />,
  alert: (
    <>
      <path d="M12 4l9 15.5H3z" />
      <path d="M12 10v4M12 17v.01" />
    </>
  ),
  alertCircle: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5v5M12 16v.01" />
    </>
  ),
  gauge: (
    <>
      <path d="M4 16a8 8 0 1 1 16 0" />
      <path d="M12 16l4-5" />
      <path d="M8 20h8" />
    </>
  ),
  monitor: (
    <>
      <rect x="3" y="4.5" width="18" height="12.5" rx="2.5" />
      <path d="M8.5 20.5h7M12 17v3.5M8 4.5v12.5" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof PATHS;

export const ICON_NAMES = Object.keys(PATHS) as IconName[];

type IconProps = Omit<SVGProps<SVGSVGElement>, 'name'> & {
  name: IconName;
  /** Pixel size of the square icon. Defaults to 20. */
  size?: number;
  /** Accessible name. Without one the icon is hidden from assistive technology. */
  label?: string;
};

export function Icon({ name, size = 20, label, strokeWidth = 2, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      {...rest}
      // Inline, so HeroUI's `.button svg` sizing (16px from 640px up) cannot shrink an icon the
      // design draws larger.
      style={{ flexShrink: 0, width: size, height: size, ...rest.style }}
    >
      {PATHS[name]}
    </svg>
  );
}

/** The Saydeed mark, two interlocking halves. Uses the current text colour. */
export function SaydeedMark({ size = 28, ...rest }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} fill="currentColor" aria-hidden focusable="false" {...rest}>
      <path d="M7,32c0,-13.81 11.19,-25 25,-25l20.05,0l-27.47,27.47l-4.6,-4.6l15.96,-15.96c-1.27,-0.28 -2.59,-0.42 -3.94,-0.42c-10.22,0 -18.5,8.28 -18.5,18.5c0,3.84 1.17,7.41 3.18,10.37l-4.66,4.66c-3.15,-4.18 -5.02,-9.39 -5.02,-15.03z" />
      <path d="M57,32c0,13.81 -11.19,25 -25,25l-20.05,0l27.47,-27.47l4.6,4.6l-15.96,15.96c1.27,0.28 2.59,0.42 3.94,0.42c10.22,0 18.5,-8.28 18.5,-18.5c0,-3.84 -1.17,-7.41 -3.18,-10.37l4.66,-4.66c3.15,4.18 5.02,9.39 5.02,15.03z" />
    </svg>
  );
}
