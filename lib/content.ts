// Copy shared between the homepage and the deeper pages, so each fact is stated once.
// Goal 1 (see GOAL.md): every claim here must be true on the day it ships. Prices and the 7 day
// install are the offers David confirmed on 2026-10-11. No proof, results or customers appear here.
import { SITE } from './site';

/** The three offers, all paid upfront. The only prices on the site. */
export const OFFERS = [
  {
    id: 'setup',
    name: 'Agent Team Setup',
    price: 'US$1,500',
    priceNote: 'for the first 3 founding clients, then US$3,000',
    summary: 'A team of 3 to 5 AI agents installed on one workflow in 7 days, plus a training call for your team.',
    get: [
      '3 to 5 AI agents installed on one workflow you choose',
      `Built on ${SITE.shortName} Work, so you can see what the agents do`,
      'One training call so your team can run, review and correct them',
      'A fixed price and scope, written down before you pay',
    ],
    decide: ['Which workflow we start with', 'What each agent may do alone and what needs your approval', 'Who on your team reviews the work'],
    foot: 'The 7 days start when you have paid and we have agreed the workflow.',
    lit: true,
  },
  {
    id: 'ops',
    name: 'AI Ops Install',
    price: 'US$5,000',
    priceNote: 'setup, plus US$1,000 a month',
    summary: 'For teams that want more than a single workflow set up. The scope is agreed on the call.',
    get: [
      'A written scope before you pay, including what the monthly fee covers',
      'Setup paid upfront, then US$1,000 a month',
    ],
    decide: ['Which workflows are in scope', 'What the monthly fee covers', 'Who approves what'],
    foot: 'Scoped on a free call, agreed in writing, paid upfront.',
    lit: false,
  },
  {
    id: 'build',
    name: 'Custom agent or AI app',
    price: 'US$5,000 to US$15,000',
    priceNote: 'fixed price, set after the call',
    summary: 'A custom agent or AI app built to a fixed price that is agreed in writing before you pay.',
    get: ['A written scope and one fixed price', 'Paid upfront, before the build starts'],
    decide: ['What the build must do', 'What done looks like', 'Who signs it off'],
    foot: 'The price depends on the scope. It is fixed before you pay.',
    lit: false,
  },
] as const;

/** Past projects, shown as portfolio only. Add an entry only after the client agrees in writing. */
export type PortfolioItem = { title: string; what: string; client?: string };
export const PORTFOLIO: readonly PortfolioItem[] = [];

/** From the first call to a trained team. Four steps, each with what the buyer has at the end and one decision. */
export const STEPS = [
  { name: 'Free call', detail: 'Thirty minutes to find the one workflow worth starting with and to check we are a fit.', output: 'The one workflow to start with', you: 'Bring one workflow that repeats' },
  { name: 'Scope and invoice', detail: 'We send a written scope with the fixed price and what you will have at the end. Work starts after you pay.', output: 'A written scope and one fixed price', you: 'Approve the scope and pay' },
  { name: 'Install in 7 days', detail: `We set up 3 to 5 agents on your workflow in ${SITE.shortName} Work and test them on examples from your own work.`, output: '3 to 5 agents working on your workflow', you: 'Review the agents and decide what they may do alone' },
  { name: 'Training call', detail: 'One call to show your team how to run, review and correct the agents.', output: 'A team that can run and correct them', you: 'Put the agents to work' },
] as const;

/** Repeat work an agency does by hand, with how often it comes back. Examples, not measured results. */
export const PAINS = [
  { id: 'leads', title: 'Leads researched one tab at a time', detail: 'Someone copies prospect details into a sheet before a single message is written.', when: 'Every campaign' },
  { id: 'reports', title: 'Client reports rebuilt every week', detail: 'Numbers are exported from several tools and pasted into the same template again.', when: 'Every client, every week' },
  { id: 'proposals', title: 'Proposals started from a blank page', detail: 'Call notes sit in one place while the proposal gets written in another.', when: 'Every new lead' },
  { id: 'chasing', title: 'Invoices and sign-offs chased by hand', detail: 'Reminders, approvals and status updates wait until someone remembers them.', when: 'Every month' },
] as const;

/**
 * The parts of an agency where agents can take on repeat work, with example agents in each.
 * The home page shows them as the agent team; a setup starts with 3 to 5 agents on one workflow.
 */
export const AGENT_TEAM = [
  { id: 'new-business', name: 'New business', agents: ['Lead research', 'Outreach drafts', 'Follow-up reminders', 'CRM updates', 'Proposal drafts'] },
  { id: 'client-work', name: 'Client work', agents: ['Status updates', 'Meeting notes', 'Client onboarding', 'Request triage'] },
  { id: 'reporting', name: 'Reporting', agents: ['Weekly client reports', 'Campaign summaries', 'Data pulls from your tools', 'Report review'] },
  { id: 'admin', name: 'Admin and finance', agents: ['Invoice chasing', 'Timesheet reminders', 'Contract filing', 'Expense logging'] },
] as const;

/** Promises the business can keep. Each matches the offer and FAQ wording in this file. */
export const COMMITMENTS = [
  'The price is on this page, and the scope is written down before you pay.',
  'You decide what the agents may do alone. Everything else waits for your approval.',
  'We show real work only. No made-up clients, results or reviews.',
  'If we are not a fit, we tell you on the free call.',
] as const;

export const CONTROLS = [
  { title: 'Approvals', detail: 'You decide which actions need a person to approve them, and who that person is.' },
  { title: 'Permissions', detail: 'Each person and each agent sees and does only what you allow.' },
  { title: 'Rules', detail: 'Limits agents must follow, such as which actions always wait for your approval.' },
  { title: 'Escalation', detail: 'Anything outside the rules goes to the person you name, with the context attached.' },
  { title: 'Activity record', detail: 'Every action by a person or an agent is recorded: what happened and when.' },
  { title: 'Your existing tools', detail: `${SITE.shortName} works alongside the tools you already use. It does not replace them.` },
] as const;

/** The homepage shows every question. Deeper pages pick the ones they need by question text. */
export const HOME_FAQ_EXCLUDE = new Set<string>();

export const FAQ = [
  {
    q: 'Will the agents replace my team?',
    a: 'No. The agents take over repeat work, such as researching leads or drafting reports. Your people review the drafts and approve what matters. We do not scope work around cutting staff.',
  },
  {
    q: 'What exactly do I get for US$1,500?',
    a: `The Agent Team Setup: 3 to 5 AI agents installed on one workflow you choose, built on ${SITE.shortName} Work, and one training call for your team. The price and scope are fixed and written down before you pay. US$1,500 is the founding price for the first 3 clients. After that it is US$3,000.`,
  },
  {
    q: 'Why do I pay before the work starts?',
    a: 'Every offer is paid upfront. It keeps the scope fixed and lets us set the 7 days aside for you. Nothing starts until the scope is written down and the invoice is paid.',
  },
  {
    q: 'Which workflow should we start with?',
    a: 'Pick one that repeats every week and costs your team the most time. Common starting points are researching leads and drafting outreach, building client reports and drafting proposals. We choose the final one together on the free call.',
  },
  {
    q: 'Do we have to replace the tools we use?',
    a: `No. We work with the tools you have where they can be connected, and we tell you on the call if one cannot be. ${SITE.shortName} sits alongside them.`,
  },
  {
    q: 'How is our data kept safe?',
    a: `Agents work only with the access you give them, and what they do is recorded in ${SITE.shortName} Work. Before you pay, we tell you in writing which access each agent needs, so you can say no to any of it.`,
  },
  {
    q: 'How long does it take?',
    a: 'The Agent Team Setup takes 7 days. The days start when you have paid and we have agreed the workflow. The AI Ops Install and custom builds get a timeline in their written scope.',
  },
  {
    q: 'What is the AI Ops Install?',
    a: 'It costs US$5,000 to set up and US$1,000 a month. We agree the scope on a free call and write it down before you pay, including what the monthly fee covers.',
  },
  {
    q: 'You are new. Do you have past work to show?',
    a: `Not yet, and we will not invent any. ${SITE.shortName} is new, which is why the setup has a founding price, a fixed scope and a short 7 day timeline: you see the result quickly and the risk stays small. Past projects appear on the Company page only when the client has agreed.`,
  },
  {
    q: `Is ${SITE.shortName} right for a team like ours?`,
    a: 'It is built first for small agencies, and it also suits founders and solo operators with one workflow that repeats. If your work is mostly one off, or you need agents across a large company, say so on the call and we will tell you honestly whether it fits.',
  },
] as const;
