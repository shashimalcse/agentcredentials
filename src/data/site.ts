export const site = {
  name: 'agentcredentials',
  title: 'Agent Credentials',
  description:
    'A field guide to verifiable credentials for AI agents: how an agent proves who it is, who it acts for and what it may do, and reveals nothing else.',
  author: 'Thilina Senarath',
  authorUrl: 'https://github.com/shashimalcse',
  github: 'https://github.com/shashimalcse',
  linkedin: 'https://www.linkedin.com/in/shashimal97/',
  /** The author's other profiles, for structured data. */
  authorSameAs: ['https://github.com/shashimalcse', 'https://www.linkedin.com/in/shashimal97/'],
  /** Default share image (1200x630), in public/. */
  image: '/og.png',
  imageAlt: 'Agent Credentials: verifiable credentials for AI agents.',
};

export const nav = [
  { label: 'A2WP', href: '/a2wp/' },
  { label: 'Writing', href: '/writing/' },
  // Learn is hidden until there is content: see src/pages/_learn.
  { label: 'Specs', href: '/specs/' },
  { label: 'Tools', href: '/tools/' },
];

export type Hue = 'cobalt' | 'violet' | 'coral' | 'teal';
