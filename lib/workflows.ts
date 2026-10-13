// Example workflows for the "who does each step" interactive, written for a small agency.
// Every step is built from the same four parts: agents working under rules, AI-assisted drafting,
// approval gates and escalation to a named role. Roles are generic (agency owner, account
// manager, strategist) and systems are named by kind, not by vendor. These show how a team could
// set a workflow up. They are examples, not results.

export type Mode = 'person' | 'assisted' | 'agent';

export type Step =
  | { kind: 'step'; mode: Mode; title: string; detail: string; system?: string; escalation?: string }
  | { kind: 'gate'; title: string; detail: string };

export type Workflow = {
  id: string;
  /** The part of the agency the workflow belongs to, such as Sales or Client work. */
  department: string;
  name: string;
  /** A short label for the picker tab. Falls back to the name. */
  tab?: string;
  summary: string;
  steps: Step[];
};

/** The modes from most human to most automated, the order every list and legend uses. */
export const MODE_ORDER: readonly Mode[] = ['person', 'assisted', 'agent'];

export const MODES: Record<Mode, { label: string; short: string; description: string }> = {
  person: {
    label: 'Person',
    short: 'Person',
    description: 'Decisions, approvals, relationships and exceptions.',
  },
  assisted: {
    label: 'AI prepares, a person checks',
    short: 'AI-assisted',
    description: 'AI drafts, analyzes or recommends. Someone on your team reviews it.',
  },
  agent: {
    label: 'Agent, under your rules',
    short: 'Agent',
    description: 'Repetitive, measurable work, run only within the permissions and limits you set.',
  },
};

export const WORKFLOWS: Workflow[] = [
  {
    id: 'leads',
    department: 'Sales',
    name: 'Lead research and outreach drafts',
    tab: 'Lead research',
    summary: 'From a profile you set to a batch of outreach drafts, with nothing sent until a person approves each message.',
    steps: [
      {
        kind: 'step',
        mode: 'person',
        title: 'Set the target profile',
        detail: 'The agency owner describes the kind of business to reach, where to look for them and what to leave out.',
      },
      {
        kind: 'step',
        mode: 'agent',
        title: 'Find matching prospects',
        detail: 'Searches the places you named and lists each prospect that fits the profile, with a link to where it was found.',
        system: 'Spreadsheet',
        escalation: 'A prospect already in your CRM, or on your do-not-contact list, goes to the agency owner instead of the list.',
      },
      {
        kind: 'step',
        mode: 'assisted',
        title: 'Draft the outreach messages',
        detail: 'AI writes a first message for each prospect from your notes on tone and offer. A strategist edits every draft.',
        system: 'Document tool',
      },
      {
        kind: 'gate',
        title: 'Approval',
        detail: 'The agency owner approves every message. Nothing is sent without approval.',
      },
      {
        kind: 'step',
        mode: 'agent',
        title: 'Log the approved messages',
        detail: 'Records each approved message against its prospect and creates a follow-up task.',
        system: 'CRM',
      },
      {
        kind: 'step',
        mode: 'person',
        title: 'Send and follow up',
        detail: 'Someone on the team sends the approved messages and handles every reply.',
        system: 'Inbox',
      },
    ],
  },
  {
    id: 'reports',
    department: 'Client work',
    name: 'Weekly client report',
    tab: 'Client report',
    summary: 'From the week’s numbers to a report the client receives, with an account manager checking it first.',
    steps: [
      {
        kind: 'step',
        mode: 'agent',
        title: 'Collect the numbers',
        detail: 'Gathers the week’s figures for each client from the tools you name and puts them in one sheet.',
        system: 'Spreadsheet, reporting tools',
        escalation: 'A missing number, or one far from last week’s, goes to the account manager before it is used.',
      },
      {
        kind: 'step',
        mode: 'agent',
        title: 'Fill in the report',
        detail: 'Places the numbers in the client’s report template and marks what changed since last week.',
        system: 'Document tool',
      },
      {
        kind: 'step',
        mode: 'assisted',
        title: 'Draft the commentary',
        detail: 'AI writes a short summary of what moved. The account manager corrects anything it got wrong.',
      },
      {
        kind: 'gate',
        title: 'Approval',
        detail: 'The account manager checks every report. Nothing reaches a client before that.',
      },
      {
        kind: 'step',
        mode: 'person',
        title: 'Send the report',
        detail: 'The account manager sends it with a personal note and answers the client’s questions.',
        system: 'Inbox',
      },
      {
        kind: 'step',
        mode: 'agent',
        title: 'File it and prepare next week',
        detail: 'Saves the sent report in the client folder and sets up next week’s sheet.',
        system: 'Document tool',
      },
    ],
  },
  {
    id: 'proposals',
    department: 'Sales',
    name: 'Proposal from call notes',
    tab: 'Proposal',
    summary: 'From a sales call to a proposal ready to send, with a person editing and approving every word that goes out.',
    steps: [
      {
        kind: 'step',
        mode: 'person',
        title: 'Hold the call',
        detail: 'The agency owner talks with the prospect and keeps notes.',
      },
      {
        kind: 'step',
        mode: 'assisted',
        title: 'Draft the proposal',
        detail: 'AI drafts the proposal from the call notes and your template. A strategist edits it.',
        system: 'Document tool',
      },
      {
        kind: 'step',
        mode: 'agent',
        title: 'Check for gaps',
        detail: 'Compares the draft with the template and the notes, and lists anything missing or unclear.',
        escalation: 'Anything the notes do not cover goes to the strategist as a question, not a guess.',
      },
      {
        kind: 'gate',
        title: 'Approval',
        detail: 'The agency owner approves the proposal before it goes to the prospect.',
      },
      {
        kind: 'step',
        mode: 'agent',
        title: 'File it and create the follow-up',
        detail: 'Saves the proposal against the prospect and creates a follow-up task for the day you choose.',
        system: 'CRM, document tool',
      },
      {
        kind: 'step',
        mode: 'person',
        title: 'Send and talk it through',
        detail: 'The agency owner sends the proposal and handles the questions that come back.',
        system: 'Inbox',
      },
    ],
  },
];
