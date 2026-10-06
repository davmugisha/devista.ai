import {
  Boxes,
  Calculator,
  CreditCard,
  Database,
  FileText,
  IdCard,
  LifeBuoy,
  Mail,
  MessageSquare,
  Sheet,
  SquareKanban,
  Users,
} from 'lucide-react';

// Kinds of system, never vendor names: which of yours connect is confirmed during the audit.
const SYSTEMS = [
  { name: 'CRM', Icon: Users },
  { name: 'ERP', Icon: Boxes },
  { name: 'Accounting', Icon: Calculator },
  { name: 'Help desk', Icon: LifeBuoy },
  { name: 'Spreadsheets', Icon: Sheet },
  { name: 'Email', Icon: Mail },
  { name: 'Payments', Icon: CreditCard },
  { name: 'Project tools', Icon: SquareKanban },
  { name: 'HR', Icon: IdCard },
  { name: 'Documents', Icon: FileText },
  { name: 'Chat', Icon: MessageSquare },
  { name: 'Databases', Icon: Database },
];

/** An endless strip of the kinds of system Devista works across, in place of client logos. */
export function SystemsMarquee() {
  return (
    <section aria-labelledby="systems-strip" className="border-y border-rule py-10">
      <h2 id="systems-strip" className="px-4 text-center text-sm text-graphite">
        Works across the systems you already run
      </h2>
      <div className="fade-x mt-6 overflow-hidden">
        <ul className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
          {[...SYSTEMS, ...SYSTEMS].map(({ name, Icon }, i) => (
            <li
              key={i}
              aria-hidden={i >= SYSTEMS.length ? true : undefined}
              className="flex items-center gap-2 rounded-control border border-rule bg-mist px-4 py-2 text-sm font-medium text-ink"
            >
              <Icon aria-hidden="true" className="size-4 text-signal-bright" strokeWidth={1.8} />
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
