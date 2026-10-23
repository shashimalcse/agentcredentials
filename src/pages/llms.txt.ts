import type { APIContext } from 'astro';
import { getWriting } from '../lib/content';
import { site } from '../data/site';
import { url } from '../lib/url';

// A plain-text map of the site for language models (https://llmstxt.org).
export async function GET(context: APIContext) {
  const abs = (path: string) => new URL(url(path), context.site).href;
  const writing = (await getWriting()).filter((e) => !e.data.draft);

  const pages = [
    ['A2WP', '/a2wp/', 'A2WP, the Agent-to-Wallet Protocol: how an AI agent asks a credential wallet to act for it.'],
    ['Specs', '/specs/', 'The standards behind verifiable credentials, and the emerging work for agents.'],
    ['SD-JWT decoder', '/tools/sd-jwt-decoder/', 'Decode an SD-JWT and see which claims it discloses. Runs entirely in the browser.'],
  ];

  const body = [
    `# ${site.title}`,
    '',
    `> ${site.description}`,
    '',
    `Written by ${site.author} (${site.authorUrl}). Topics: verifiable credentials for AI agents, SD-JWT VC, Delegate SD-JWT, OpenID4VCI, OpenID4VP, credential wallets for agents, and A2WP.`,
    '',
    '## Writing',
    '',
    ...writing.map((e) => `- [${e.data.title}](${abs(`/writing/${e.id}/`)}): ${e.data.description}`),
    '',
    '## Pages',
    '',
    ...pages.map(([name, path, desc]) => `- [${name}](${abs(path)}): ${desc}`),
    '',
    '## Optional',
    '',
    `- [RSS feed](${abs('/rss.xml')})`,
    `- [Sitemap](${abs('/sitemap-index.xml')})`,
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
