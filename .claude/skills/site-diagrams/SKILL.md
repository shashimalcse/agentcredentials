---
name: site-diagrams
description: Draw diagrams for the agentcredentials website (home page, A2WP page, articles) in the site's own diagram style. Use whenever a page or article needs a diagram of parties, flows, protocols or an interaction between two parties.
---

# Diagrams for the agentcredentials site

Every diagram on this site looks like the home page's "See it in action" demo (`src/components/FlowDemo.astro`). Build diagrams in **HTML and CSS with the site tokens**, not as SVG drawings with text, and never as images.

## Pick the right component

| Need | Use |
| --- | --- |
| Two or three parties exchanging messages, in order (one protocol, one interaction point) | `src/components/diagram/Exchange.astro` |
| Who talks to whom across the whole system (topology) | A small topology component modelled on `src/components/diagram/AgentCredentialMap.astro` |
| An animated story with chat and wallets | `FlowDemo.astro` (home page only) |

In MDX:

```mdx
import Exchange from '../../components/diagram/Exchange.astro';

<Exchange
  summary="One or two plain sentences that say what the diagram shows. Screen readers get this instead of the drawing."
  parties={[
    { id: 'wallet', role: 'Agent wallet', name: 'Wallet', tone: 'wallet' },
    { id: 'reg', role: 'Issuer', name: 'Agent Registry', hue: 'violet' },
  ]}
  steps={[
    { from: 'wallet', to: 'reg', label: 'fetch offer', hue: 'violet' },
    { from: 'wallet', to: 'wallet', label: 'issuer allowed' },
    { from: 'reg', to: 'wallet', label: 'Agent credential', term: 'SD-JWT VC', chip: 'violet', hue: 'violet' },
  ]}
/>
```

A step whose `from` equals its `to` renders as a teal ✓ check the party makes itself. `chip` renders the label as a credential chip instead of a pill. `term` adds an emphasised term after the label: a protocol, tool or value.

## Visual language (taken from the home demo)

- **Party box:** white, 1px `--line` border, 14 to 16px radius. Above a bold 14 to 15px name sits a role label in mono, 10 to 11px, uppercase, letter-spacing 0.08em, `--muted`. A 3px top border in the party's hue marks its role.
- **Agent wallet:** a dark panel, `#111114`, with a light `#c8c8d0` label. It is the only dark box.
- **Credential chip:** a filled pill in the credential's hue, white 12 to 13px semibold text, and an optional mono 10px "by" label at 85% opacity.
- **Arrow:** a 1.5px line in the flow's hue, with a small triangle head, and a pill label centred on it. The pill is white with a `--line` border, mono 10 to 11px, `--muted` text, and `<b>` in `--ink` for the protocol or term. Idle flows in the home demo are dashed `#c8c8d0`; static diagrams use the hue directly.
- **Check:** a teal ✓ circle with `--teal-ink` text, used only for a successful verification or check.
- **Frame:** `--surface` background, 1px `--line` border, 20px radius, 16 to 24px padding.
- **No** gradients, shadows on arrows, 3D, icons with text inside, or decorative illustration.

## Colour means something

| Hue | Means |
| --- | --- |
| `--violet` | the agent's own credential and its issuing (issuer, OpenID4VCI) |
| `--teal` | delegated credentials (the person's wallet, dSD-JWT); also ✓ checks |
| `--cobalt` | presenting and verifiers (OpenID4VP) |
| `--ink` | the agent and A2WP (agent ⇄ wallet) |
| `--coral` | reserved: errors, denials, warnings |

Use at most two hues per diagram besides the checks. Keep the same hue for the same thing on every page.

## Text: as little as possible

- **Labels:** at most three words, plus one `term`. Write "fetch offer", not "The wallet fetches the credential offer".
- **Names:** a party's name is a noun, at most two words. Its role is one or two words.
- **No sentences inside a diagram.** The paragraph above it gives the one or two sentences of context, and the `summary` prop gives the full meaning to screen readers.
- **Example values:** use them only when they teach something (`agt_7Hk2pQ`, `openid4vp://`). Use `.example` hosts, never the local test hosts.
- **Size:** a diagram has 3 to 8 steps. If it needs more, split the interaction.
- **Wording:** follow the site's writing style. Use sentence case, no Latin abbreviations, and spell out what a term means in the prose the first time it appears.

## Layout and accessibility

- Diagrams sit in the article column and must work from 360px wide. On narrow screens chips drop their "by" label and pills shrink, so check that no label wraps onto two lines at 375px. If one does, shorten it.
- Every diagram is a `<figure>`. The drawing is `aria-hidden`, and a visually hidden `<figcaption>` holds the summary.
- Never put a diagram's only copy of a fact in the drawing. Anything a reader must know is also in the prose or in the summary.

## Check before you finish

1. Run `astro dev`. Articles in `src/content/writing` with `draft: true` render only in dev, under `/writing/<file name>/`.
2. Look at each diagram at desktop width and at 375px. The browser pane may not scroll long pages: hide the other figures with a little JavaScript and screenshot one figure at a time.
3. Check that arrows point the right way, that chips don't hide their arrow, that ✓ checks sit on the right party's lifeline, and that the hues follow the table above.
4. `npx astro build` passes.
