// Example data for the prototype, transcribed from the design boards in extracted/saydeed-app.
// Every fact that appears on more than one screen lives here once. "Samuel Shami", "Branshs LLC",
// the agents, invoices, listings, sellers, prices and ratings are example data, not real customers.

import type { IconName } from '@/components/icons';

// ---------------------------------------------------------------------------------------------
// Who and when

export const USER = { firstName: 'Samuel', fullName: 'Samuel Shami', initials: 'SS' } as const;

export const COMPANY = { name: 'Branshs LLC', role: 'Owner', agents: 12, working: 12, idle: 2 } as const;

export const TODAY = { long: 'Thursday 24 September', short: 'Thu 24 Sep', label: 'Today · 8:10' } as const;

/** The one live activity line shown under the Brain Map. */
export const LIVE_ACTIVITY = { agent: 'CFO agent', doing: 'is reconciling September invoices' } as const;

// ---------------------------------------------------------------------------------------------
// The numbers today

export const NUMBERS = {
  cash: { label: 'Cash in bank', value: '$18,420', delta: '+$2,100', deltaNote: 'this week' },
  runway: { label: 'Runway', value: '4.2 mo', months: 4.2, goal: 6, after: 5.1 },
  revenue: { label: 'Revenue, September', shortLabel: 'Revenue · Sep', value: '$7,850', note: '$4,800 more if Umoja signs' },
  spend: { label: 'Agent spend today', value: '$4.20', amount: 4.2, cap: 15, capLabel: '$15', note: 'Capped by you, 28% used', railNote: 'Chief of Staff stops agents at the cap and asks you.' },
} as const;

/** Monthly agent budget left, used by the Marketplace buy check. */
export const BUDGET_LEFT = '$300';

// ---------------------------------------------------------------------------------------------
// Agents

export type AgentCode = 'CoS' | 'CFO' | 'SAL' | 'DEL' | 'BIL' | 'PRO';

export interface Agent {
  code: AgentCode;
  name: string;
  doing: string;
  state: 'working' | 'waiting';
  /** The decision this agent is waiting on, if any. Approving it puts the agent back to work. */
  waitsOn?: ApprovalKey;
  /** What the agent does once that decision is made. */
  afterDecision?: string;
}

/** The four agents shown under "Agents at work". */
export const AGENTS: Agent[] = [
  { code: 'CFO', name: 'CFO agent', doing: 'Reconciling September invoices', state: 'working' },
  { code: 'SAL', name: 'Sales lead', doing: 'Drafting 4 follow-ups from Tuesday’s calls', state: 'working' },
  { code: 'DEL', name: 'Delivery lead', doing: 'Waiting on you: portal launch date', state: 'waiting', waitsOn: 'portal', afterDecision: 'Telling Kivu Coffee the launch date' },
  { code: 'BIL', name: 'Billing agent', doing: 'Holding 2 reminders for your approval', state: 'waiting', waitsOn: 'remind', afterDecision: 'Sending 2 payment reminders' },
];

// ---------------------------------------------------------------------------------------------
// Overdue invoices (Chat, Call and the reminder approval all use these)

export const INVOICES = [
  { client: 'Kivu Coffee Co.', short: 'Kivu Coffee', number: '#0142', amount: '$1,200', late: '14 days late', due: '10 September' },
  { client: 'Nyota Labs', short: 'Nyota Labs', number: '#0139', amount: '$2,450', late: '6 days late', due: '18 September' },
] as const;

export const OVERDUE_TOTAL = '$3,650';

// ---------------------------------------------------------------------------------------------
// Decisions that need the owner (Inbox, Home, Dashboard, phone Approval)

export type ApprovalKey = 'remind' | 'umoja' | 'portal';
export type Decision = 'approved' | 'rejected';

export interface Approval {
  key: ApprovalKey;
  who: AgentCode;
  asker: string;
  time: string;
  title: string;
  /** One line for lists: "Billing agent · $3,650 overdue". */
  short: string;
  /** The longer line on web Home. */
  summary: string;
  /** Dashboard card detail line. */
  detail: string;
  /** Quick action on web Home and Dashboard. */
  action: string;
  /** What web Home shows once approved from the quick action. */
  doneText: string;
  traces: { title: string; sub: string }[];
  previewTitle: string;
  fields: { label: string; value: string }[];
  body: string;
  /** For the reminder: each email that will go out. */
  emails?: { to: string; subject: string; body: string }[];
  /** For the launch date: the dates the team can do. */
  choices?: string[];
  defaultChoice?: number;
  facts: { value: string; label: string; warn?: boolean }[];
  approveLabel: string;
  approved: string;
  rejected: string;
}

export const APPROVALS: Approval[] = [
  {
    key: 'remind',
    who: 'BIL',
    asker: 'Billing agent',
    time: '8:04',
    title: 'Send 2 payment reminders',
    short: 'Billing agent · $3,650 overdue',
    summary: 'Billing agent · $3,650 overdue from Kivu Coffee and Nyota Labs',
    detail: '$3,650 overdue · Kivu Coffee, Nyota Labs',
    action: 'Approve and send',
    doneText: 'Sent. CFO agent tracks payment.',
    traces: [
      { title: 'Recover $3,650 overdue', sub: 'Task · owned by CFO agent' },
      { title: 'Q3 goal: 6 months of runway', sub: 'Goal · set by you' },
    ],
    previewTitle: 'Email 1 of 2',
    fields: [
      { label: 'To', value: 'Kivu Coffee Co. · Accounts' },
      { label: 'Subject', value: 'Invoice #0142, a friendly reminder' },
    ],
    body: 'Hi team, a quick reminder that invoice #0142 for $1,200 was due on 10 September. You can pay with the link below. If something is holding it up, just reply and we will sort it out.',
    emails: [
      {
        to: 'Kivu Coffee Co. · Accounts',
        subject: 'Invoice #0142, a friendly reminder',
        body: 'Hi team, a quick reminder that invoice #0142 for $1,200 was due on 10 September. You can pay with the link below. If something is holding it up, just reply and we will sort it out.',
      },
      {
        to: 'Nyota Labs · Accounts',
        subject: 'Invoice #0139, a friendly reminder',
        body: 'Hi team, a quick reminder that invoice #0139 for $2,450 was due on 18 September. You can pay with the link below. If something is holding it up, just reply and we will sort it out.',
      },
    ],
    facts: [
      { value: '2 emails', label: 'Will send' },
      { value: '$0.03', label: 'Agent cost' },
      { value: 'No undo', label: 'Once sent', warn: true },
    ],
    approveLabel: 'Approve and send',
    approved: 'Sent. CFO agent will track payment.',
    rejected: 'Rejected. Billing agent will hold the reminders.',
  },
  {
    key: 'umoja',
    who: 'PRO',
    asker: 'Proposal writer',
    time: '7:52',
    title: 'Review the Umoja proposal',
    short: 'Proposal writer · $4,800',
    summary: 'Proposal writer · $4,800, six weeks of work',
    detail: '$4,800 · six weeks · client portal',
    action: 'Approve and send',
    doneText: 'Sent to Umoja.',
    traces: [
      { title: 'Win the Umoja client portal', sub: 'Deal · owned by Sales lead' },
      { title: 'Q3 goal: 6 months of runway', sub: 'Goal · set by you' },
    ],
    previewTitle: 'Proposal summary',
    fields: [
      { label: 'Client', value: 'Umoja Studio' },
      { label: 'Scope', value: 'Client portal, six weeks' },
      { label: 'Price', value: '$4,800, half up front' },
    ],
    body: 'Written from Tuesday’s call recap in your house style. It covers the portal, two rounds of changes and a handover call. Delivery lead has checked the six-week plan.',
    facts: [
      { value: '1 document', label: 'Will send' },
      { value: '$0.11', label: 'Agent cost' },
      { value: 'Client sees it', label: 'Once sent', warn: true },
    ],
    approveLabel: 'Approve and send',
    approved: 'Sent to Umoja. Proposal writer follows up on Monday.',
    rejected: 'Rejected. Proposal writer will wait for your notes.',
  },
  {
    key: 'portal',
    who: 'DEL',
    asker: 'Delivery lead',
    time: '7:30',
    title: 'Pick a portal launch date',
    short: 'Delivery lead · client portal',
    summary: 'Delivery lead · suggests Wednesday 7 October',
    detail: 'Suggests Wednesday 7 October · Kivu portal',
    action: 'Accept 7 October',
    doneText: 'Launch set for 7 October.',
    traces: [
      { title: 'Launch the Kivu client portal', sub: 'Project · owned by Delivery lead' },
      { title: 'Q4 goal: 3 live client portals', sub: 'Goal · set by you' },
    ],
    previewTitle: 'Dates that work for the team',
    fields: [
      { label: 'Client', value: 'Kivu Coffee Co.' },
      { label: 'Ready since', value: 'Friday 2 October' },
    ],
    body: 'Testing is done. Delivery lead suggests a Wednesday launch so support is fully staffed for the first two days.',
    choices: ['Mon 5 Oct', 'Wed 7 Oct', 'Mon 12 Oct'],
    defaultChoice: 1,
    facts: [
      { value: '3 options', label: 'Team is free' },
      { value: '$0', label: 'Agent cost' },
      { value: 'Client is told', label: 'Once confirmed', warn: true },
    ],
    approveLabel: 'Confirm date',
    approved: 'Launch set. Delivery lead will tell the client.',
    rejected: 'Not yet. Delivery lead will ask again on Monday.',
  },
];

export function getApproval(key: string): Approval | undefined {
  return APPROVALS.find((a) => a.key === key);
}

/** The result line once decided. The launch date result names the chosen date. */
export function approvalResult(a: Approval, decision: Decision, choice: number): string {
  if (decision === 'rejected') return a.rejected;
  if (a.choices) return `Launch set for ${a.choices[choice]}. Delivery lead will tell the client.`;
  return a.approved;
}

// ---------------------------------------------------------------------------------------------
// Conversations (Inbox)

export type ThreadKey = 'cos' | 'sales' | 'call' | 'aline' | 'cfo' | 'budget';
export type ThreadKind = 'agent' | 'group' | 'call' | 'human' | 'alert';

export interface Thread {
  key: ThreadKey;
  kind: ThreadKind;
  initials: string;
  title: string;
  sub: string;
  time: string;
  unread: number;
  kindLabel: string;
  messages: string[];
}

export const THREADS: Thread[] = [
  {
    key: 'cos', kind: 'agent', initials: 'CoS', title: 'Chief of Staff', sub: 'Morning brief: 3 things need you', time: '8:10', unread: 0,
    kindLabel: 'Agent · runs your other agents',
    messages: [
      'Good morning, Samuel. Three things need you today.',
      'Billing agent drafted 2 payment reminders for $3,650 overdue. The Umoja proposal is ready, and Delivery lead needs a launch date for the Kivu portal.',
      'Everything else is on track. Agent spend is $4.20 of your $15 cap.',
    ],
  },
  {
    key: 'sales', kind: 'group', initials: 'SAL', title: 'Sales room', sub: 'Eric: I’ll take the Nyota call', time: '7:40', unread: 2,
    kindLabel: 'Group · Sales lead, Eric and you',
    messages: ['Sales lead: Nyota Labs asked for a call this week.', 'Eric: I’ll take the Nyota call.'],
  },
  {
    key: 'call', kind: 'call', initials: 'CALL', title: 'Call with Chief of Staff', sub: '6 min · 3 visuals · 2 tasks created', time: 'Tue', unread: 0,
    kindLabel: 'Call recap',
    messages: [
      'Recap: we went through September cash, the Umoja proposal and the portal plan.',
      'Tasks created: chase Kivu and Nyota invoices, draft the Umoja proposal.',
    ],
  },
  {
    key: 'aline', kind: 'human', initials: 'AM', title: 'Aline M.', sub: 'Signed contract is in the shared drive', time: 'Yest.', unread: 1,
    kindLabel: 'Person · Operations',
    messages: ['Signed contract is in the shared drive.'],
  },
  {
    key: 'cfo', kind: 'agent', initials: 'CFO', title: 'CFO agent', sub: 'September books closed, 2 anomalies flagged', time: 'Yest.', unread: 0,
    kindLabel: 'Agent · Finance',
    messages: ['September books are closed. Two anomalies: a duplicate software bill and a refund with no matching invoice.'],
  },
  {
    key: 'budget', kind: 'alert', initials: '', title: 'Budget alert', sub: 'Agent spend hit 80% of yesterday’s cap', time: '6:15', unread: 0,
    kindLabel: 'Alert',
    messages: ['Agent spend hit 80% of yesterday’s cap. Nothing was stopped.'],
  },
];

export function getThread(key: string): Thread | undefined {
  return THREADS.find((t) => t.key === key);
}

export type InboxFilter = 'all' | 'needs' | ThreadKind;

export const INBOX_FILTERS: { key: InboxFilter; label: string; heading: string }[] = [
  { key: 'all', label: 'All', heading: 'Conversations' },
  { key: 'needs', label: 'Needs you', heading: 'Needs you' },
  { key: 'agent', label: 'Agents', heading: 'Agents' },
  { key: 'human', label: 'People', heading: 'People' },
  { key: 'group', label: 'Groups', heading: 'Groups' },
  { key: 'call', label: 'Calls', heading: 'Call recaps' },
  { key: 'alert', label: 'Alerts', heading: 'Alerts' },
];

// ---------------------------------------------------------------------------------------------
// Marketplace

export type ListingKind = 'workflow' | 'agent' | 'skill' | 'pipeline' | 'tool' | 'expert';
export type ListingKey =
  | 'invoice-chaser' | 'month-end' | 'proposal-pro' | 'receipt-reader'
  | 'crm-setup' | 'hiring-screen' | 'support-triage' | 'board-report';
export type PlanKey = 'once' | 'month' | 'trial' | 'free' | 'fixed' | 'hourly';
export type PermissionLevel = 'read' | 'draft' | 'act';

export const KIND_LABEL: Record<ListingKind, string> = {
  workflow: 'Workflow', agent: 'Agent', skill: 'Skill', pipeline: 'Pipeline', tool: 'Tool', expert: 'Expert',
};

export const KIND_ICON: Record<ListingKind, IconName> = {
  workflow: 'workflow', agent: 'agent', skill: 'skill', pipeline: 'pipeline', tool: 'tool', expert: 'person',
};

/** The category a listing sits under, for breadcrumbs. */
export const KIND_CATEGORY: Record<ListingKind, string> = {
  workflow: 'Workflows', agent: 'Agents + skills', skill: 'Agents + skills', pipeline: 'Pipelines', tool: 'Tools', expert: 'Experts',
};

export const PERMISSION_LEVEL: Record<PermissionLevel, { label: string; tone: 'muted' | 'accent' | 'warning'; icon: IconName }> = {
  read: { label: 'Read only', tone: 'muted', icon: 'eye' },
  draft: { label: 'Drafts for you', tone: 'accent', icon: 'pencil' },
  act: { label: 'Needs your approval each time', tone: 'warning', icon: 'shieldCheck' },
};

export interface Plan {
  key: PlanKey;
  label: string;
  price: string;
  note: string;
  /** Charged today. */
  charge: string;
}

export interface Listing {
  key: ListingKey;
  kind: ListingKind;
  title: string;
  seller: string;
  rating: string;
  reviews: string;
  /** Headline price on cards. */
  price: string;
  /** One line on web cards. */
  short: string;
  /** Why Chief of Staff suggests it, phone length. Empty when not suggested. */
  whyShort: string;
  /** Why Chief of Staff suggests it, web length. Empty when not suggested. */
  why: string;
  blurb: string;
  steps: string[];
  asks: { level: PermissionLevel; text: string }[];
  /** The agents it works with, on the web listing. */
  uses: { initials: AgentCode | 'SAL'; name: string }[];
  plans: Plan[];
  done: { title: string; text: string; action: string; web: 'inbox' | 'home'; phone: 'chat' | 'dashboard' | 'inbox' };
}

const plan = (key: PlanKey, label: string, price: string, note: string, charge: string): Plan => ({ key, label, price, note, charge });

export const LISTINGS: Listing[] = [
  {
    key: 'invoice-chaser', kind: 'workflow', title: 'Invoice chaser', seller: 'Ledgerline', rating: '4.8', reviews: '212', price: '$49',
    short: 'Drafts a friendly reminder for every overdue invoice and waits for your yes.',
    whyShort: 'You chased 3 overdue invoices by hand this week.',
    why: 'You chased 3 overdue invoices by hand this week. This drafts the reminders and waits for your yes.',
    blurb: 'Finds overdue invoices every morning and drafts a friendly reminder for each one. You approve before anything is sent.',
    steps: ['Checks your books for invoices 7 days overdue', 'Drafts a reminder in your tone, one per client', 'Puts the drafts in Approvals for you', 'Hands paid invoices back to CFO agent'],
    asks: [{ level: 'read', text: 'Read invoices and clients' }, { level: 'draft', text: 'Draft emails as Billing agent' }, { level: 'act', text: 'Send email after you approve' }],
    uses: [{ initials: 'BIL', name: 'Billing agent' }, { initials: 'CFO', name: 'CFO agent' }],
    plans: [plan('once', 'Buy once', '$49', 'Yours to keep', '$49'), plan('month', 'Monthly', '$6/mo', 'Updates included', '$6'), plan('trial', 'Try free', '14 days', 'Then $6/mo', '$0')],
    done: { title: 'Installed for Branshs LLC', text: 'Billing agent can use it now. Its first reminders wait in Approvals for you.', action: 'Tell Billing agent', web: 'inbox', phone: 'chat' },
  },
  {
    key: 'month-end', kind: 'pipeline', title: 'Month-end close', seller: 'Kora Ops', rating: '4.9', reviews: '86', price: '$19/mo',
    short: 'Bank feeds in, matched books and a short close summary out.',
    whyShort: 'CFO agent spent 6 hours closing September by hand.',
    why: 'CFO agent spent 6 hours closing September by hand. This runs the close as one pipeline.',
    blurb: 'Runs your month-end close as one pipeline: bank feeds in, matched books and a short close summary out.',
    steps: ['Pulls every bank feed on the last working day', 'Matches payments to invoices and bills', 'Flags anything odd to CFO agent', 'Drafts the close summary for you to sign off'],
    asks: [{ level: 'read', text: 'Read bank feeds and books' }, { level: 'draft', text: 'Draft journal entries' }, { level: 'act', text: 'Post entries after you approve' }],
    uses: [{ initials: 'CFO', name: 'CFO agent' }],
    plans: [plan('month', 'Monthly', '$19/mo', 'Cancel any time', '$19'), plan('trial', 'Try free', '7 days', 'Then $19/mo', '$0')],
    done: { title: 'Installed for Branshs LLC', text: 'CFO agent runs it at the end of October. The close summary comes to you before anything is posted.', action: 'See it on Home', web: 'home', phone: 'dashboard' },
  },
  {
    key: 'proposal-pro', kind: 'agent', title: 'Proposal writer pro', seller: 'Mto Labs', rating: '4.7', reviews: '54', price: '$29/mo',
    short: 'An agent with four skills that writes proposals in your house style.',
    whyShort: '', why: '',
    blurb: 'An agent with four skills: scoping, pricing tables, case notes and your house style. It joins your Org like any other agent.',
    steps: ['Reads the call recap from Inbox', 'Scopes the work with your Delivery lead', 'Writes the proposal in your house style', 'Sends it to Approvals before the client sees it'],
    asks: [{ level: 'read', text: 'Read call recaps and Knowledge' }, { level: 'draft', text: 'Draft documents' }, { level: 'act', text: 'Email clients after you approve' }],
    uses: [{ initials: 'CoS', name: 'Chief of Staff' }, { initials: 'DEL', name: 'Delivery lead' }],
    plans: [plan('month', 'Monthly', '$29/mo', 'One agent seat', '$29'), plan('trial', 'Try free', '14 days', 'Then $29/mo', '$0')],
    done: { title: 'Hired into your Org', text: 'Proposal writer pro reports to Chief of Staff. Its first proposal waits in Approvals for you.', action: 'Say hello', web: 'inbox', phone: 'chat' },
  },
  {
    key: 'receipt-reader', kind: 'tool', title: 'Receipt reader', seller: 'Pembe Data', rating: '4.6', reviews: '310', price: '$0.01',
    short: 'Reads receipts and bills from photos or forwarded email into your books.',
    whyShort: '', why: '',
    blurb: 'A tool any agent can call: it reads receipts and bills from photos or forwarded email into your books.',
    steps: ['Takes a photo or a forwarded email', 'Reads vendor, date, amount and tax', 'Files it to the right expense line', 'Asks CFO agent when it is unsure'],
    asks: [{ level: 'read', text: 'Read receipts you send it' }, { level: 'draft', text: 'Write expense lines' }],
    uses: [{ initials: 'CFO', name: 'CFO agent' }, { initials: 'BIL', name: 'Billing agent' }],
    plans: [plan('free', 'Pay per use', '$0.01', 'Per receipt read', '$0')],
    done: { title: 'Added for Branshs LLC', text: 'CFO agent and Billing agent can call it now. Usage shows under Agent spend.', action: 'See it on Home', web: 'home', phone: 'dashboard' },
  },
  {
    key: 'crm-setup', kind: 'expert', title: 'Sales pipeline setup', seller: 'Imani K.', rating: '5.0', reviews: '23', price: '$600',
    short: 'A person sets up your Sales agent and pipeline in two working days.',
    whyShort: '', why: '',
    blurb: 'A person, not an agent. Imani sets up your Sales agent and pipeline stages from the systems you already use, in two working days.',
    steps: ['A 30 minute call to map how you sell', 'Sets up Sales agent and your pipeline stages', 'Brings in contacts from the systems you use', 'Hands over with a recorded walkthrough'],
    asks: [{ level: 'read', text: 'Read your contacts for 14 days' }, { level: 'act', text: 'Admin access to Sales for 14 days' }],
    uses: [{ initials: 'SAL', name: 'Sales agent' }],
    plans: [plan('fixed', 'Fixed fee', '$600', 'Two working days', '$600'), plan('hourly', 'Hourly', '$45/h', 'For smaller jobs', '$45')],
    done: { title: 'Setup call requested', text: 'Imani K. will offer call times in Inbox. Access starts only after the call.', action: 'Open Inbox', web: 'inbox', phone: 'inbox' },
  },
  {
    key: 'hiring-screen', kind: 'skill', title: 'Hiring screen', seller: 'Nuru People', rating: '4.5', reviews: '41', price: '$9/mo',
    short: 'Scores applications against your role card and drafts kind replies.',
    whyShort: '', why: '',
    blurb: 'A skill any agent can learn: it scores applications against your role card and drafts kind replies.',
    steps: ['Reads each new application', 'Scores it against your role card', 'Drafts a reply for every applicant', 'Shortlists the top five for you'],
    asks: [{ level: 'read', text: 'Read applications' }, { level: 'draft', text: 'Draft replies to applicants' }],
    uses: [{ initials: 'CoS', name: 'Chief of Staff' }],
    plans: [plan('month', 'Monthly', '$9/mo', 'Every agent can use it', '$9'), plan('once', 'Buy once', '$79', 'Yours to keep', '$79')],
    done: { title: 'Added to Skills', text: 'Any agent in your Org can use Hiring screen now. Shortlists come to Inbox.', action: 'Open Inbox', web: 'inbox', phone: 'inbox' },
  },
  {
    key: 'support-triage', kind: 'workflow', title: 'Support triage', seller: 'Kora Ops', rating: '4.7', reviews: '128', price: '$39',
    short: 'Sorts support email by urgency and routes it to the right agent or person.',
    whyShort: '', why: '',
    blurb: 'Sorts new support email by urgency and topic, then hands each one to the right agent or person.',
    steps: ['Reads new support email', 'Sorts it by urgency and topic', 'Routes it to the right agent or person', 'Escalates anything urgent to you'],
    asks: [{ level: 'read', text: 'Read the support inbox' }, { level: 'draft', text: 'Label, route and draft replies' }],
    uses: [{ initials: 'CoS', name: 'Chief of Staff' }, { initials: 'DEL', name: 'Delivery lead' }],
    plans: [plan('once', 'Buy once', '$39', 'Yours to keep', '$39'), plan('month', 'Monthly', '$5/mo', 'Updates included', '$5')],
    done: { title: 'Installed for Branshs LLC', text: 'New support email is sorted from now on. Escalations land in Inbox.', action: 'Open Inbox', web: 'inbox', phone: 'inbox' },
  },
  {
    key: 'board-report', kind: 'pipeline', title: 'Weekly board report', seller: 'Mto Labs', rating: '4.4', reviews: '67', price: '$15/mo',
    short: 'Builds the Monday numbers report from Dashboard, ready for you to send.',
    whyShort: '', why: '',
    blurb: 'Builds your Monday numbers report from Dashboard and writes three lines on what changed.',
    steps: ['Pulls cash, revenue and runway from Dashboard', 'Writes three lines on what changed', 'Formats it for your board', 'Waits for you to send it'],
    asks: [{ level: 'read', text: 'Read Dashboard' }, { level: 'draft', text: 'Draft documents' }],
    uses: [{ initials: 'CFO', name: 'CFO agent' }, { initials: 'CoS', name: 'Chief of Staff' }],
    plans: [plan('month', 'Monthly', '$15/mo', 'Cancel any time', '$15'), plan('trial', 'Try free', '14 days', 'Then $15/mo', '$0')],
    done: { title: 'Installed for Branshs LLC', text: 'Your first report is drafted next Monday and waits in Approvals.', action: 'See it on Home', web: 'home', phone: 'dashboard' },
  },
];

export function getListing(key: string): Listing | undefined {
  return LISTINGS.find((l) => l.key === key);
}

export type CategoryKey = 'all' | 'workflows' | 'agents' | 'pipelines' | 'tools' | 'experts';

export const CATEGORIES: { key: CategoryKey; label: string; title: string; kinds: ListingKind[] | null }[] = [
  { key: 'all', label: 'All', title: 'All listings', kinds: null },
  { key: 'workflows', label: 'Workflows', title: 'Workflows', kinds: ['workflow'] },
  { key: 'agents', label: 'Agents + skills', title: 'Agents and skills', kinds: ['agent', 'skill'] },
  { key: 'pipelines', label: 'Pipelines', title: 'Pipelines', kinds: ['pipeline'] },
  { key: 'tools', label: 'Tools', title: 'Tools', kinds: ['tool'] },
  { key: 'experts', label: 'Experts', title: 'Experts who set it up', kinds: ['expert'] },
];

/** Same search the boards run: title, seller, kind label (and the short line on web). */
export function listingMatches(l: Listing, query: string, includeShort = false): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return `${l.title} ${l.seller} ${KIND_LABEL[l.kind]}${includeShort ? ' ' + l.short : ''}`.toLowerCase().includes(q);
}

export function inCategory(key: CategoryKey, l: Listing): boolean {
  const kinds = CATEGORIES.find((c) => c.key === key)?.kinds;
  return !kinds || kinds.includes(l.kind);
}

/** The words on the buy button and the confirm button for a plan. */
export function buyWords(l: Listing, p: Plan): { cta: string; approve: string } {
  if (l.kind === 'expert') return { cta: 'Request setup', approve: 'Approve and request' };
  if (p.key === 'trial') return { cta: 'Start free trial', approve: 'Approve and start' };
  if (p.key === 'free') return { cta: 'Add it', approve: 'Approve and add' };
  return { cta: 'Get it', approve: 'Approve and buy' };
}

/** The three checks Chief of Staff shows before a purchase is confirmed. */
export function buyChecks(l: Listing, p: Plan): { title: string; sub: string }[] {
  const budget =
    p.key === 'trial'
      ? { title: 'Free for now', sub: `${p.note}. Chief of Staff reminds you 3 days before it ends.` }
      : p.key === 'free'
        ? { title: 'Nothing to pay today', sub: `${p.price} ${p.note.toLowerCase()}, counted in Agent spend` }
        : { title: 'Fits your agent budget', sub: `${p.charge} today, ${BUDGET_LEFT} left this month` };
  const n = l.asks.length;
  const expert = l.kind === 'expert';
  return [
    budget,
    { title: `${n} ${n === 1 ? 'permission' : 'permissions'}, nothing more`, sub: expert ? 'Access ends on its own after 14 days' : 'You can take them back any time in Skills' },
    expert
      ? { title: 'A person, checked by Saydeed', sub: `${l.seller} works inside your approvals like your own team` }
      : { title: 'Runs under your approvals', sub: 'Nothing goes out without you' },
  ];
}

/** What Branshs LLC already sells (phone Marketplace, Sell tab). */
export const MY_LISTINGS: { title: string; sub: string; status: 'Live' | 'In review' | 'Draft' }[] = [
  { title: 'Client portal checklist', sub: 'Workflow · 31 buyers · $25', status: 'Live' },
  { title: 'Proposal style guide', sub: 'Skill · 7 buyers · $9/mo', status: 'Live' },
  { title: 'Delivery check-in', sub: 'Workflow · sent 2 Oct', status: 'In review' },
  { title: 'Weekly cash note', sub: 'Pipeline · not listed yet', status: 'Draft' },
];

// ---------------------------------------------------------------------------------------------
// Selling

export type SellableKey = 'cash-note' | 'onboarding' | 'estimator' | 'receipt-sorter' | 'expert';
export type PriceModel = 'once' | 'month' | 'free';

export interface Sellable {
  key: SellableKey;
  kind: Exclude<ListingKind, 'skill'>;
  title: string;
  proof: string;
  pitch: string;
  price: string;
}

export const SELLABLES: Sellable[] = [
  { key: 'cash-note', kind: 'pipeline', title: 'Weekly cash note', proof: 'ran 9 times, no errors', pitch: 'Writes a short cash note every Friday from your books and bank feeds.', price: '12' },
  { key: 'onboarding', kind: 'workflow', title: 'Client onboarding', proof: 'ran 22 times this year', pitch: 'Sends the welcome pack, books the kickoff call and sets up the shared folder.', price: '35' },
  { key: 'estimator', kind: 'agent', title: 'Quote estimator', proof: 'agent with 2 skills', pitch: 'Turns a call recap into a priced quote using your rate card.', price: '25' },
  { key: 'receipt-sorter', kind: 'tool', title: 'Receipt sorter', proof: 'built in Code', pitch: 'Sorts forwarded receipts into folders by vendor and month.', price: '5' },
  { key: 'expert', kind: 'expert', title: 'Your time as an expert', proof: 'set it up for others', pitch: 'I set up client portals for small agencies in one working day.', price: '400' },
];

export const PRICE_MODELS: { key: PriceModel; label: string }[] = [
  { key: 'once', label: 'Buy once' },
  { key: 'month', label: 'Monthly' },
  { key: 'free', label: 'Free' },
];

export function priceLabel(model: PriceModel, price: string): string {
  if (model === 'free') return 'Free';
  return `$${price || '0'}${model === 'month' ? '/mo' : ''}`;
}

/** Keeps digits and one decimal point, as the sell form does. */
export function cleanPrice(raw: string): string {
  const digits = raw.replace(/[^0-9.]/g, '');
  const [whole, ...rest] = digits.split('.');
  return rest.length ? `${whole}.${rest.join('')}` : whole;
}

export const SELL_PROMISES = [
  { title: 'Your data stays out', sub: 'Client names, emails and amounts are removed from every example run.' },
  { title: 'Your files stay private', sub: 'Buyers get the steps and prompts, never your Knowledge.' },
  { title: 'Buyers stay in control', sub: 'It runs under their approvals, the same way it runs under yours.' },
  { title: 'Reviewed before it is listed', sub: 'Saydeed checks every listing before buyers can see it.' },
];

// ---------------------------------------------------------------------------------------------
// Top bar search and Create menus (web)

export type WebTarget = 'home' | 'inbox' | 'marketplace' | 'sell';

export const SEARCH_INDEX: { title: string; where: string; target: WebTarget; item?: string }[] = [
  { title: 'Send 2 payment reminders', where: 'Inbox · Billing agent needs you', target: 'inbox', item: 'remind' },
  { title: 'Review the Umoja proposal', where: 'Inbox · Proposal writer needs you', target: 'inbox', item: 'umoja' },
  { title: 'Pick a portal launch date', where: 'Inbox · Delivery lead needs you', target: 'inbox', item: 'portal' },
  { title: 'Invoice chaser', where: 'Marketplace · Workflow by Ledgerline', target: 'marketplace', item: 'invoice-chaser' },
  { title: 'Month-end close', where: 'Marketplace · Pipeline by Kora Ops', target: 'marketplace', item: 'month-end' },
  { title: 'Receipt reader', where: 'Marketplace · Tool by Pembe Data', target: 'marketplace', item: 'receipt-reader' },
  { title: 'CFO agent', where: 'Agent · reconciling September invoices', target: 'home' },
  { title: 'Cash in bank', where: 'Home · $18,420 today', target: 'home' },
  { title: 'Sell something you built', where: 'Marketplace · list a workflow, agent or tool', target: 'sell' },
];

export const CREATE_MENU: { label: string; sub: string; target: WebTarget | 'cos' }[] = [
  { label: 'Ask Chief of Staff', sub: 'Say what you need, it sets it up', target: 'cos' },
  { label: 'Hire an agent', sub: 'From the Marketplace', target: 'marketplace' },
  { label: 'Find a workflow or tool', sub: 'Browse the Marketplace', target: 'marketplace' },
  { label: 'Sell what you built', sub: 'List it on the Marketplace', target: 'sell' },
];

// ---------------------------------------------------------------------------------------------
// Navigation. Sections without a design route to an honest "not designed yet" page.

export type Mode = 'work' | 'code';

export type SectionKey =
  | 'goals' | 'tasks' | 'org' | 'knowledge' | 'skills' | 'finance'
  | 'projects' | 'runs' | 'reviews' | 'releases' | 'coding-agents' | 'repositories' | 'environments';

export const SECTIONS: Record<SectionKey, { title: string; icon: IconName; mode: Mode | 'both' }> = {
  goals: { title: 'Goals', icon: 'target', mode: 'work' },
  tasks: { title: 'Tasks', icon: 'tasks', mode: 'work' },
  org: { title: 'Org', icon: 'org', mode: 'work' },
  knowledge: { title: 'Knowledge', icon: 'knowledge', mode: 'work' },
  skills: { title: 'Skills', icon: 'skill', mode: 'both' },
  finance: { title: 'Finance', icon: 'finance', mode: 'work' },
  projects: { title: 'Projects', icon: 'folder', mode: 'code' },
  runs: { title: 'Runs', icon: 'play', mode: 'code' },
  reviews: { title: 'Reviews', icon: 'review', mode: 'code' },
  releases: { title: 'Releases', icon: 'tag', mode: 'code' },
  'coding-agents': { title: 'Coding agents', icon: 'agent', mode: 'code' },
  repositories: { title: 'Repositories', icon: 'database', mode: 'code' },
  environments: { title: 'Environments', icon: 'layers', mode: 'code' },
};

export function isSection(key: string): key is SectionKey {
  return Object.prototype.hasOwnProperty.call(SECTIONS, key);
}

/** Counts shown beside nav items. Inbox and Approvals use the live pending count instead. */
export const NAV_COUNTS = { tasks: '18', reviews: '1', runsLive: '2 live' } as const;
