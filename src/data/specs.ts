import type { Hue } from './site';

export interface Spec {
  name: string;
  summary: string;
  body: string;
  href: string;
}

export interface SpecGroup {
  id: string;
  title: string;
  hue: Hue;
  note?: string;
  specs: Spec[];
}

export const specGroups: SpecGroup[] = [
  {
    id: 'formats',
    title: 'Data model & formats',
    hue: 'cobalt',
    specs: [
      {
        name: 'Verifiable Credentials Data Model 2.0',
        summary: 'The shared vocabulary: issuer, holder, verifier, claims and proofs.',
        body: 'W3C',
        href: 'https://www.w3.org/TR/vc-data-model-2.0/',
      },
      {
        name: 'SD-JWT',
        summary: 'Selective disclosure for JWTs: hash every claim, reveal only some.',
        body: 'IETF',
        href: 'https://datatracker.ietf.org/doc/draft-ietf-oauth-selective-disclosure-jwt/',
      },
      {
        name: 'SD-JWT VC',
        summary: 'A credential format on top of SD-JWT, with types and key binding.',
        body: 'IETF',
        href: 'https://datatracker.ietf.org/doc/draft-ietf-oauth-sd-jwt-vc/',
      },
      {
        name: 'mdoc (ISO/IEC 18013-5)',
        summary: 'The CBOR-based format behind mobile driving licences.',
        body: 'ISO',
        href: 'https://www.iso.org/standard/69084.html',
      },
    ],
  },
  {
    id: 'protocols',
    title: 'Issuance & presentation',
    hue: 'teal',
    specs: [
      {
        name: 'OpenID4VCI',
        summary: 'How a wallet obtains a credential from an issuer, on OAuth rails.',
        body: 'OpenID',
        href: 'https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html',
      },
      {
        name: 'OpenID4VP',
        summary: 'How a verifier asks for a presentation, with DCQL queries.',
        body: 'OpenID',
        href: 'https://openid.net/specs/openid-4-verifiable-presentations-1_0.html',
      },
    ],
  },
  {
    id: 'lifecycle',
    title: 'Lifecycle & trust',
    hue: 'coral',
    specs: [
      {
        name: 'Token Status List',
        summary: 'Revoke or suspend credentials with a compressed, privacy-friendly bit list.',
        body: 'IETF',
        href: 'https://datatracker.ietf.org/doc/draft-ietf-oauth-status-list/',
      },
    ],
  },
  {
    id: 'agents',
    title: 'Agents',
    hue: 'violet',
    note: 'Emerging work. Expect change.',
    specs: [
      {
        name: 'Agent-to-Wallet Protocol (A2WP)',
        summary: 'Lets an agent ask a wallet to acquire and present credentials without holding them.',
        body: 'IETF draft',
        href: 'https://www.ietf.org/archive/id/draft-senarath-a2wp-01.html',
      },
    ],
  },
];
