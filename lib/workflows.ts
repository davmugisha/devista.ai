// Example workflows for the "who does each step" interactive. Every step uses only the
// capabilities the owner confirmed as live: agents working under rules, AI-assisted drafting,
// approval gates and escalation to a named role. Systems are named generically, not by vendor.

export type Mode = 'person' | 'assisted' | 'agent';

export type Step =
  | { kind: 'step'; mode: Mode; title: string; detail: string; system?: string; escalation?: string }
  | { kind: 'gate'; title: string; detail: string };

export type Workflow = {
  id: string;
  department: string;
  name: string;
  summary: string;
  steps: Step[];
};

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
    id: 'finance',
    department: 'Finance',
    name: 'Supplier invoice approval',
    summary: 'From invoice received to payment scheduled, with nothing paid before it is approved.',
    steps: [
      {
        kind: 'step',
        mode: 'agent',
        title: 'Capture the invoice',
        detail: 'Reads each invoice from the accounts inbox and records supplier, amounts, tax and due date.',
        system: 'Accounts inbox',
      },
      {
        kind: 'step',
        mode: 'agent',
        title: 'Match it to the order',
        detail: 'Checks the invoice against the purchase order and the goods receipt.',
        escalation: 'A mismatch above your tolerance goes to the accounts payable lead.',
      },
      {
        kind: 'step',
        mode: 'assisted',
        title: 'Code and prepare the entry',
        detail: 'AI suggests the cost center and ledger account. An accounts payable clerk confirms them.',
        system: 'Accounting system',
      },
      {
        kind: 'gate',
        title: 'Approval',
        detail: 'The budget owner approves. Above the approval limit, the CFO approves as well.',
      },
      {
        kind: 'step',
        mode: 'agent',
        title: 'Schedule the payment',
        detail: 'Adds the approved invoice to the next payment run. Nothing is scheduled without approval.',
        system: 'Payments',
      },
      {
        kind: 'step',
        mode: 'person',
        title: 'Review exceptions',
        detail: 'The finance lead reviews every escalation each week and adjusts the rules.',
      },
    ],
  },
  {
    id: 'sales',
    department: 'Sales',
    name: 'New customer onboarding',
    summary: 'From deal won to kickoff, with the account manager signing off everything the customer sees.',
    steps: [
      {
        kind: 'step',
        mode: 'agent',
        title: 'Open the onboarding record',
        detail: 'When a deal is marked won, collects the contract terms, contacts and start date.',
        system: 'CRM',
      },
      {
        kind: 'step',
        mode: 'assisted',
        title: 'Prepare the welcome pack',
        detail: 'AI drafts the welcome email and kickoff agenda from the contract. The account manager edits them.',
      },
      {
        kind: 'gate',
        title: 'Approval',
        detail: 'The account manager approves anything that goes to the customer.',
      },
      {
        kind: 'step',
        mode: 'agent',
        title: 'Set up billing and projects',
        detail: 'Creates the customer in the billing and project tools with the agreed terms.',
        system: 'Billing, project tools',
        escalation: 'Missing tax or billing details go to finance before anything is created.',
      },
      {
        kind: 'step',
        mode: 'person',
        title: 'Run the kickoff call',
        detail: 'The account manager leads the call and agrees priorities with the customer.',
      },
      {
        kind: 'step',
        mode: 'agent',
        title: 'Report progress',
        detail: 'Adds onboarding status to the weekly leadership report.',
      },
    ],
  },
  {
    id: 'operations',
    department: 'Operations',
    name: 'Purchase requests',
    summary: 'From request to purchase order, checked against budget and policy before anyone approves it.',
    steps: [
      {
        kind: 'step',
        mode: 'person',
        title: 'Request a purchase',
        detail: 'An employee describes what they need and why.',
      },
      {
        kind: 'step',
        mode: 'agent',
        title: 'Check budget and policy',
        detail: 'Checks the remaining budget, the purchasing policy and the approved supplier list.',
        escalation: 'A supplier outside the approved list goes to the procurement lead.',
      },
      {
        kind: 'step',
        mode: 'assisted',
        title: 'Compare quotes',
        detail: 'AI compares the quotes and drafts a recommendation. The operations coordinator checks it.',
      },
      {
        kind: 'gate',
        title: 'Approval',
        detail: 'The budget owner approves. Above the threshold you set, the COO approves as well.',
      },
      {
        kind: 'step',
        mode: 'agent',
        title: 'Raise the purchase order',
        detail: 'Creates the purchase order in the ERP and sends it to the supplier.',
        system: 'ERP',
      },
      {
        kind: 'step',
        mode: 'agent',
        title: 'Track delivery',
        detail: 'Follows up on late deliveries and keeps the requester informed.',
      },
    ],
  },
  {
    id: 'support',
    department: 'Support',
    name: 'Support ticket triage',
    summary: 'Every ticket sorted in minutes, with complaints and refunds always handled by a person.',
    steps: [
      {
        kind: 'step',
        mode: 'agent',
        title: 'Sort incoming tickets',
        detail: 'Classifies each ticket by topic, urgency and customer, and routes it to the right queue.',
        system: 'Help desk',
        escalation: 'Complaints, refund requests and anything legal go straight to the support lead.',
      },
      {
        kind: 'step',
        mode: 'agent',
        title: 'Answer routine questions',
        detail: 'Replies on its own only to question types you have approved, such as order status.',
      },
      {
        kind: 'step',
        mode: 'assisted',
        title: 'Draft the other replies',
        detail: 'AI drafts answers from your knowledge base. A support specialist reviews each one before it is sent.',
      },
      {
        kind: 'gate',
        title: 'Approval',
        detail: 'Refunds above your limit need the support lead to approve them.',
      },
      {
        kind: 'step',
        mode: 'person',
        title: 'Handle escalations',
        detail: 'The support lead owns complaints and exceptions from start to finish.',
      },
      {
        kind: 'step',
        mode: 'assisted',
        title: 'Review weekly trends',
        detail: 'AI summarizes recurring issues. The head of support decides what to fix.',
      },
    ],
  },
];
