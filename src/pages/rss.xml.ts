import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getWriting } from '../lib/content';
import { site } from '../data/site';

export async function GET(context: APIContext) {
  const entries = (await getWriting()).filter((e) => !e.data.draft);
  return rss({
    title: site.title,
    description: site.description,
    site: context.site!,
    items: entries.map((e) => ({
      title: e.data.title,
      description: e.data.description,
      pubDate: e.data.date,
      link: `/writing/${e.id}/`,
    })),
  });
}
