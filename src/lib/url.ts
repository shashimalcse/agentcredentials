/**
 * Prefix an internal path with the site's base path, so links work both at a sub-path
 * (e.g. GitHub Pages: /agentcredentials/) and at the root of a custom domain.
 */
export const url = (path: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}`;
