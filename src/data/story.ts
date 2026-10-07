/**
 * The hero conversation between Ada and her agent. Entries play in order.
 * `id` lets the wallet panel react to specific moments.
 */

export type StepKind = 'a2wp' | 'issue' | 'delegate' | 'ask' | 'present' | 'verified';

export type Entry =
  | { id?: string; kind: 'agent'; text: string }
  | { id?: string; kind: 'user'; text: string }
  | { id: string; kind: 'approval'; source: string; title: string; details: string[] }
  /** Ada presses Approve on the approval card with this id. */
  | { id?: string; kind: 'approve'; target: string }
  | { id?: string; kind: 'step'; step: StepKind; text: string; sub?: string };

export const story: Entry[] = [
  { kind: 'agent', text: "Hi Ada, I'm your new Acme assistant. To act for you, I need a verified identity from Acme AI." },
  {
    id: 'activate',
    kind: 'approval',
    source: 'Acme AI',
    title: 'Activate your agent',
    details: ['Acme AI issues this agent a credential', 'certified for: bookings, purchases'],
  },
  { kind: 'approve', target: 'activate' },
  { id: 'a2wp-issue', kind: 'step', step: 'a2wp', text: "Asked my wallet to accept Acme AI's offer", sub: 'A2WP' },
  { id: 'issued', kind: 'step', step: 'issue', text: 'Acme AI issued Verified agent to my wallet', sub: 'OpenID4VCI' },
  { kind: 'agent', text: "All set. Sites can now check I'm a genuine, accountable agent." },

  { kind: 'user', text: "Order a bottle of wine for Friday's team dinner." },
  { kind: 'agent', text: "The store will ask if you're over 18. Can I prove that for you?" },
  {
    id: 'delegation',
    kind: 'approval',
    source: "Ada's wallet",
    title: 'Delegate to your agent',
    details: ['Age · Gov ID', 'share only age_over_18', 'valid 30 days · bound to this agent'],
  },
  { kind: 'approve', target: 'delegation' },
  { id: 'delegated', kind: 'step', step: 'delegate', text: "Your wallet delegated age_over_18 to my wallet", sub: 'dSD-JWT · expires 6 Nov' },
  { id: 'ask-store', kind: 'step', step: 'ask', text: 'store.example asks: Is the buyer over 18?' },
  { id: 'a2wp-store', kind: 'step', step: 'a2wp', text: 'Asked my wallet to answer it', sub: 'A2WP · the wallet decides what to share' },
  { id: 'present-store', kind: 'step', step: 'present', text: 'Presenting age_over_18: true', sub: 'delegated by Ada · OpenID4VP' },
  {
    id: 'verified-store',
    kind: 'step',
    step: 'verified',
    text: 'store.example verified',
    sub: 'Gov ID signed it · Ada delegated it · not expired',
  },
  { kind: 'agent', text: "Ordered. Your name and birthdate weren't shared." },

  { kind: 'user', text: 'Also book my flight to Singapore for Tuesday.' },
  {
    id: 'ask-flights',
    kind: 'step',
    step: 'ask',
    text: 'flights.example only accepts verified agents: Who are you, and who is accountable for you?',
  },
  { id: 'a2wp-flights', kind: 'step', step: 'a2wp', text: 'Asked my wallet to answer it', sub: 'A2WP' },
  { id: 'present-flights', kind: 'step', step: 'present', text: 'Presenting Verified agent', sub: 'issued by Acme AI · OpenID4VP' },
  {
    id: 'verified-flights',
    kind: 'step',
    step: 'verified',
    text: 'flights.example verified',
    sub: 'genuine Acme AI agent · certified for bookings',
  },
  { kind: 'agent', text: 'Booked SQ 403, Tue 08:40.' },
];

/** Index of the entry with this id. */
export const at = (id: string) => {
  const i = story.findIndex((e) => e.id === id);
  if (i < 0) throw new Error(`No story entry with id "${id}"`);
  return i;
};

/** Index of the approve entry for an approval card. */
export const approvedAt = (target: string) => story.findIndex((e) => e.kind === 'approve' && e.target === target);
