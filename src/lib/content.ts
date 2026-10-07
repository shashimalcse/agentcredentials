import { getCollection } from 'astro:content';

const visible = (entry: { data: { draft: boolean } }) => import.meta.env.DEV || !entry.data.draft;

export async function getWriting() {
  const entries = await getCollection('writing', visible);
  return entries.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getLearn() {
  const entries = await getCollection('learn', visible);
  return entries.sort((a, b) => a.data.order - b.data.order);
}

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
