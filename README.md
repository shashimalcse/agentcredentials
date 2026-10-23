# agentcredentials.dev

A field guide to verifiable credentials for AI agents. Built with [Astro](https://astro.build) and MDX.

## Commands

```sh
npm install
npm run dev        # http://localhost:4321 (drafts are visible here)
npm run build      # static site in dist/ (drafts excluded)
npm run preview    # serve dist/ locally
npx astro check    # type-check
```

## Writing content

Learn is switched off until there is content. To turn it on, rename `src/pages/_learn` →
`learn` and add it back to `nav` in `src/data/site.ts`.


- Essays and notes: `src/content/writing/<slug>.mdx`
- Guides: `src/content/learn/<slug>.mdx`

Front matter is validated by `src/content.config.ts`. Set `draft: true` to keep a
piece out of production builds and the RSS feed; it still shows in `npm run dev`
with a Draft badge.

## Where things live

| Path | What |
|---|---|
| `src/styles/global.css` | Design tokens (ink, greys, the four credential colours) and shared styles |
| `src/data/` | Site config and navigation, credentials and use cases, the specs list |
| `src/components/HeroArt.astro` | Abstract hero art (decorative) |
| `src/components/FlowDemo.astro` | Home demo: chat with the agent, plus the wallets, issuer and verifiers |
| `src/data/story.ts` | The demo conversation, entry by entry |
| `src/scripts/flow-demo.ts` | Demo playback: typing, approvals, wallet highlights, replay |
| `src/pages/a2wp.astro`, `src/components/A2wpDemo.astro` | A2WP page and its animated exchange (entries in `src/data/a2wp.ts`) |
| `src/lib/sd-jwt.ts` | SD-JWT decoding used by `/tools/sd-jwt-decoder/` |

The demo ships fully played out, so it reads correctly without JavaScript and with
`prefers-reduced-motion`. It plays only while on screen. Edit the conversation in
`src/data/story.ts`; wallet highlights refer to entries by `id`.

## Deploying

Pushing to `main` deploys to GitHub Pages via `.github/workflows/deploy.yml`. The site is
served at https://agentcredentials.dev/ (custom domain set under the repo's Settings → Pages).

Internal links go through `url()` in `src/lib/url.ts`, so the base path comes from config.

Search and AI discovery: `Base.astro` writes the Open Graph and Twitter tags and a JSON-LD graph
(site, author, page); pages add their own nodes through its `schema` prop (`Article.astro` adds a
`TechArticle` or `BlogPosting`). `robots.txt`, `llms.txt` and `rss.xml` are generated from
`src/pages/*.ts`. The default share image is `public/og.png` (1200x630); add the author's other
profiles to `authorSameAs` in `src/data/site.ts`.
Setting `PUBLIC_NOINDEX=true` at build time adds a robots `noindex` tag to every page.
