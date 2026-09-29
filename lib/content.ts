// Copy shared between the homepage and the deeper pages, so each fact is stated once.
// Only claims the owner confirmed as live appear here (see redesign/CHECKPOINT-1.md).

export const AUDIT = {
  facts: [
    { term: 'Cost', detail: 'Free, with no obligation to go further.' },
    { term: 'Duration', detail: 'About two weeks from the first call to the readout.' },
    { term: 'Scope', detail: 'One department or workflow that you choose.' },
    { term: 'Access', detail: 'No access to your systems is needed. We work from walkthroughs and a list of the tools you use.' },
  ],
  attendees: [
    'An executive sponsor: the CEO, COO or CFO',
    'The head of the department in scope',
    'One or two people who do the work every day',
    'Your IT lead, if you want integration questions answered early',
  ],
  steps: [
    { title: 'Introductory call', detail: 'Thirty minutes to confirm fit and choose the department or workflow to examine.' },
    { title: 'Two working sessions', detail: 'About ninety minutes each, remote, with the people who run the work.' },
    { title: 'Readout', detail: 'Sixty minutes to walk through the findings and the proposed first implementation.' },
  ],
  deliverables: [
    { title: 'Workflow map', detail: 'The workflows in scope, with every handoff, approval and tool marked.' },
    { title: 'Tool review', detail: 'What connects, what is duplicated, and where a tool cannot do the job.' },
    { title: 'Work allocation', detail: 'Each step assigned to a person, AI-assisted work or an agent, with the reasoning.' },
    { title: 'Control points', detail: 'Where approvals sit and what escalates, and to whom.' },
    { title: 'Scoped first implementation', detail: 'A proposal with scope, timeline and fee, for you to accept or decline.' },
  ],
} as const;

export const STAGES = [
  { name: 'Discover', detail: 'We learn how the company runs and choose one department or workflow to start with.', you: 'Choose the starting point' },
  { name: 'Diagnose', detail: 'We map the workflows, handoffs and tools in scope and find where time is lost between systems.', you: 'Walk us through the work' },
  { name: 'Architect', detail: 'We decide which steps stay with people, which AI assists, and which agents run, with approvals and escalation set.', you: 'Approve the design and the rules' },
  { name: 'Build', detail: 'We configure the command center and the department, connect your existing tools and set permissions.', you: 'Review before anything goes live' },
  { name: 'Deploy', detail: 'The department goes live on a switchover plan agreed with its head, with your people approving what matters.', you: 'Sign off the switchover' },
  { name: 'Operate', detail: 'We run and improve it with you, then expand to the next department when the first has proven itself.', you: 'Decide what comes next' },
] as const;

export const GAPS = [
  { title: 'The same data, typed twice', detail: 'An order lands in one system, then someone keys it into the next, and the next.' },
  { title: 'Approvals chased over chat', detail: 'Invoices and purchase requests wait in inboxes until someone remembers to follow up.' },
  { title: 'Reports assembled by hand', detail: 'Every week someone exports from several systems and rebuilds the same spreadsheet.' },
  { title: 'Nobody sees the whole picture', detail: 'Each department sees its own tools. No one place shows how the company is running today.' },
] as const;

export const CONTROLS = [
  { title: 'Approvals', detail: 'You decide which actions need a person to approve them, and who that person is.' },
  { title: 'Permissions', detail: 'Each person and each agent sees and does only what you allow.' },
  { title: 'Policies', detail: 'Rules agents must follow, such as spending thresholds and approved suppliers.' },
  { title: 'Escalation', detail: 'Anything outside the rules goes to the person you name, with the context attached.' },
  { title: 'Audit trail', detail: 'Every action by a person or an agent is recorded: what happened, when, and on whose authority.' },
  { title: 'Your existing systems', detail: 'Devista works through the tools you already run. It does not replace them.' },
] as const;

export const PRODUCT_PARTS = [
  { title: 'Command center', detail: 'Goals, tasks, approvals, alerts, status and reports for the whole company, in one place.' },
  { title: 'Departments', detail: 'Modules configured for the departments you choose, such as finance, operations, sales or support.' },
  { title: 'AI agents', detail: 'Specialized agents that research, prepare documents, compile reports and route work, inside your rules.' },
  { title: 'Approvals', detail: 'One queue for every decision that needs a person, with the context to decide quickly.' },
] as const;

/** The homepage shows the eight objections from the brief; deeper pages pick others by question. */
export const HOME_FAQ_EXCLUDE = new Set(['How do we bring our teams along?', 'You are a young company. What if you disappear?']);

export const FAQ = [
  {
    q: 'Will this replace our staff?',
    a: 'No. Devista moves repetitive work between systems to agents so your people spend their time on judgment, relationships and decisions. We never scope a project around cutting headcount. The people who do the work help map it during the audit and decide which steps agents take on, so nothing changes without them.',
  },
  {
    q: 'How do we bring our teams along?',
    a: 'The people who do the work help map it during the audit and help decide which steps agents take on. They review AI drafts and approve what matters, so nothing changes without them.',
  },
  {
    q: 'Do we have to replace the software we already use?',
    a: 'No. Devista connects the systems you run today. Where a tool cannot do the job, we say so and recommend an alternative, and the decision stays yours.',
  },
  {
    q: 'How is our data kept safe?',
    a: 'Agents work only with the access you grant, and every action is recorded. Your IT or security lead can review hosting, access and data handling with us, in writing, before anything is connected.',
  },
  {
    q: 'Will the rollout disrupt our operations?',
    a: 'We start with one department and one workflow. The switchover plan is agreed with the head of that department, and nothing goes live without your sign-off.',
  },
  {
    q: 'What happens when something goes wrong?',
    a: 'Anything outside the rules escalates to the person you name, with the context attached. The audit trail shows exactly what happened, so the rule can be corrected.',
  },
  {
    q: 'How long does it take?',
    a: 'The audit takes about two weeks. The timeline for the first implementation depends on its scope and is set out in the proposal before any work starts.',
  },
  {
    q: 'How does pricing work?',
    a: 'The audit is free. The first implementation has a scoped fee agreed before work starts. After that, a platform subscription grows with the departments you add, and unusually heavy workloads are charged by usage. We do not publish prices because scope differs by company.',
  },
  {
    q: 'You are a young company. What if you disappear?',
    a: 'It is a fair question for any new vendor. Before any build starts, the proposal sets out in writing what you own and how your data and configuration are handled if you stop using Devista.',
  },
  {
    q: 'Is Devista right for a company like ours?',
    a: 'It fits established companies with several departments and years of accumulated tools and workflows. If you are starting a new business and want to build it on Devista from day one, mention it when you book and we will tell you honestly whether it fits.',
  },
] as const;
