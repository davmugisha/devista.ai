// Example data for the pictures adapted from the Saydeed app boards (extracted/saydeed-app).
// Every count, label and screen reader description in those pictures is computed from these
// arrays, so a picture and its description cannot disagree. All names and numbers are invented
// for illustration and are captioned as example data wherever they appear.

export type AgentKey = 'research' | 'outreach' | 'reporting' | 'proposal' | 'status';

/** The three letter chip the app shows beside each agent. */
export const AGENT: Record<AgentKey, { chip: string; name: string; workflow: string }> = {
  research: { chip: 'RES', name: 'Research agent', workflow: 'Lead research' },
  outreach: { chip: 'OUT', name: 'Outreach agent', workflow: 'Lead research' },
  reporting: { chip: 'REP', name: 'Reporting agent', workflow: 'Client reports' },
  proposal: { chip: 'PRO', name: 'Proposal agent', workflow: 'Proposals' },
  status: { chip: 'STA', name: 'Status agent', workflow: 'Status updates' },
};

export type Need = {
  id: string;
  agent: AgentKey;
  /** What the agent wants to do, written as the action (the app titles a decision this way). */
  title: string;
  sub: string;
  time: string;
  /** What the person is asked to do to the item. */
  noun: string;
  /** Two steps it traces back to, nearest first: [kind, title, owner or setter]. */
  traces: [string, string, string][];
  /** The draft the person reads before deciding. */
  draft: { count: string; to: string; subject: string; body: string };
  /** What will happen on approval. */
  sends: string;
  /** Why the agent stopped and asked, for "Ask why". */
  why: string;
};

export const NEEDS: Need[] = [
  {
    id: 'outreach',
    agent: 'outreach',
    title: 'Send 12 outreach messages',
    sub: 'Outreach agent · checked against your do-not-contact list',
    time: '8:04',
    noun: 'outreach messages',
    traces: [
      ['Task', 'Find 12 prospects that fit your profile', 'owned by Research agent'],
      ['Workflow', 'Lead research', 'set by you'],
    ],
    draft: {
      count: 'Email 1 of 12',
      to: 'Founder · Northwind Studio',
      subject: 'An idea for Northwind’s weekly client reports',
      body: 'Hi, I saw that Northwind builds its client reports by hand each week. We set up agents that collect the numbers and write the first draft, and you check it before it goes out. Would a short call be useful?',
    },
    sends: '12 emails',
    why: 'Every outreach message needs your yes before anything is sent. This is a rule you set, and the agent will not send without it.',
  },
  {
    id: 'report',
    agent: 'reporting',
    title: 'Send the weekly client report',
    sub: 'Reporting agent · Harbor & Pine, numbers collected',
    time: '7:52',
    noun: 'client report',
    traces: [
      ['Task', 'Collect this week’s numbers for Harbor & Pine', 'owned by Reporting agent'],
      ['Workflow', 'Client reports', 'set by you'],
    ],
    draft: {
      count: 'Email 1 of 1',
      to: 'Accounts team · Harbor & Pine',
      subject: 'Your weekly report',
      body: 'Hi team, your report for the week is attached, with the numbers from each channel and a short summary. The one number we could not pull is flagged on page two. Reply with any questions.',
    },
    sends: '1 email',
    why: 'Every client report is checked by a person before it leaves. The agent collected the numbers and wrote the commentary, then stopped.',
  },
  {
    id: 'proposal',
    agent: 'proposal',
    title: 'Review the Northwind Studio proposal',
    sub: 'Proposal agent · drafted from your call notes',
    time: '7:30',
    noun: 'proposal',
    traces: [
      ['Task', 'Draft a proposal from the call notes', 'owned by Proposal agent'],
      ['Workflow', 'Proposals', 'set by you'],
    ],
    draft: {
      count: 'Draft 1 of 1',
      to: 'Founder · Northwind Studio',
      subject: 'Proposal: weekly reports and outreach',
      body: 'Built from your call notes and your template. Two things the notes did not cover are marked for you: the start date and who signs off on the reports.',
    },
    sends: '1 email',
    why: 'The agency owner approves every proposal before it goes to a prospect. The agent marked two gaps for you to fill first.',
  },
];

export type Rostered = { agent: AgentKey; doing: string; state: 'Working' | 'Waiting' };

export const ROSTER: Rostered[] = [
  { agent: 'research', doing: 'Finding agencies that match your profile', state: 'Working' },
  { agent: 'status', doing: 'Writing Friday’s project updates', state: 'Working' },
  { agent: 'outreach', doing: 'Holding 12 messages for your approval', state: 'Waiting' },
  { agent: 'reporting', doing: 'Holding the weekly report for your approval', state: 'Waiting' },
  { agent: 'proposal', doing: 'Holding a proposal for your review', state: 'Waiting' },
];

export const WORKING = ROSTER.filter((r) => r.state === 'Working').length;
export const WAITING = ROSTER.length - WORKING;
export const WORKSPACE = 'Example agency';
export const USER = 'Alex';
export const USER_INITIALS = 'AL';
