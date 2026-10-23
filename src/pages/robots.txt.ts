import type { APIContext } from 'astro';
import { url } from '../lib/url';

// Every crawler is welcome, AI crawlers included: being cited by answer engines is part of the point.
export function GET(context: APIContext) {
  const sitemap = new URL(url('/sitemap-index.xml'), context.site).href;
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
