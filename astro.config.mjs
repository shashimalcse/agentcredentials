// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// SITE_URL and BASE_PATH are set by the deploy workflow. Until the custom domain is live the site is
// served from GitHub Pages under /agentcredentials/; with the domain, BASE_PATH becomes '/'.
// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://agentcredentials.dev',
  base: process.env.BASE_PATH ?? '/',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: { theme: 'github-dark-default' },
  },
});
