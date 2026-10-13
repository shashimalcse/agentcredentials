/**
 * The A2WP diagram on /a2wp/: one sequence per operation, as the agent-credential PoC runs it
 * (github.com/shashimalcse/agent-vc-poc). Binding-neutral: the same over MCP or HTTPS.
 */

/** Boxes and arrows in the diagram that a step lights up. */
export type Part = 'agent' | 'wallet' | 'issuer' | 'verifier' | 'a2wp' | 'vci' | 'vp' | 'offer' | 'req';
/** offer: issuer → agent link (top) · req: verifier → agent link (bottom). */
export type Edge = 'a2wp' | 'vci' | 'vp' | 'offer' | 'req';

export interface Step {
  text: string;
  sub?: string;
  active: Part[];
  /** A message shown on an arrow. dir 1 = left to right, -1 = right to left. */
  msg?: { edge: Edge; label: string; dir: 1 | -1 };
  /** The credential lands in the wallet at this step. */
  fill?: boolean;
}

export interface Flow {
  id: string;
  name: string;
  /** Whether the wallet already holds the credential when the flow starts. */
  startsFilled: boolean;
  steps: Step[];
}

export const flows: Flow[] = [
  {
    id: 'acquire',
    name: 'Acquire a credential',
    startsFilled: false,
    steps: [
      {
        text: 'An issuer gives the agent a credential offer link.',
        sub: 'openid-credential-offer://…',
        active: ['issuer', 'offer', 'agent'],
        msg: { edge: 'offer', label: 'credential offer', dir: -1 },
      },
      {
        text: 'The agent asks its wallet to accept the offer.',
        sub: 'acquire · the offer link, unchanged',
        active: ['agent', 'a2wp'],
        msg: { edge: 'a2wp', label: 'acquire · offer', dir: 1 },
      },
      {
        text: 'The wallet accepts and returns an operation to follow.',
        sub: 'status: pending',
        active: ['wallet', 'a2wp'],
        msg: { edge: 'a2wp', label: 'op_Qm7c… · pending', dir: -1 },
      },
      { text: 'The wallet checks the issuer and credential type against its policy.', active: ['wallet'] },
      {
        text: 'The wallet redeems the offer with a fresh holder key.',
        sub: 'OpenID4VCI · pre-authorized code · key proof',
        active: ['wallet', 'vci', 'issuer'],
        msg: { edge: 'vci', label: 'token · key proof', dir: 1 },
      },
      {
        text: 'The issuer returns the credential. The wallet verifies and stores it.',
        sub: 'SD-JWT VC · bound to the holder key',
        active: ['wallet', 'vci', 'issuer'],
        msg: { edge: 'vci', label: 'SD-JWT VC', dir: -1 },
        fill: true,
      },
      {
        text: 'The agent checks the status and gets a handle, never the credential.',
        sub: 'status: completed · credential_handle',
        active: ['agent', 'a2wp', 'wallet'],
        msg: { edge: 'a2wp', label: 'completed · cred_Jx8v…', dir: -1 },
      },
    ],
  },
  {
    id: 'present',
    name: 'Present a credential',
    startsFilled: true,
    steps: [
      {
        text: 'A verifier gives the agent a presentation request link.',
        sub: 'openid4vp://… · for example on a site the agent is using',
        active: ['verifier', 'req', 'agent'],
        msg: { edge: 'req', label: 'presentation request', dir: -1 },
      },
      {
        text: 'The agent passes the request to its wallet, unchanged.',
        sub: 'present · the request link, unchanged',
        active: ['agent', 'a2wp'],
        msg: { edge: 'a2wp', label: 'present · request', dir: 1 },
      },
      {
        text: 'The wallet accepts and returns an operation to follow.',
        sub: 'status: pending',
        active: ['wallet', 'a2wp'],
        msg: { edge: 'a2wp', label: 'op_4Tk9… · pending', dir: -1 },
      },
      {
        text: "The wallet fetches the verifier's signed request itself and checks who sent it.",
        sub: 'request_uri · certificate chain · client_id',
        active: ['wallet', 'vp', 'verifier'],
        msg: { edge: 'vp', label: 'fetch request_uri', dir: 1 },
      },
      { text: 'The wallet runs the query and applies its policy.', sub: 'DCQL · what may this agent share?', active: ['wallet'] },
      {
        text: 'The wallet sends only the claims asked for, straight to the verifier.',
        sub: 'OpenID4VP · selective disclosure · key binding',
        active: ['wallet', 'vp', 'verifier'],
        msg: { edge: 'vp', label: 'org · address.country', dir: 1 },
      },
      {
        text: 'The agent checks the status: completed. Only the verifier saw what was shared.',
        sub: 'status: completed · verifier · next URL',
        active: ['agent', 'a2wp', 'wallet'],
        msg: { edge: 'a2wp', label: 'completed', dir: -1 },
      },
    ],
  },
];
