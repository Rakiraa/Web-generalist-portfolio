// Site-wide content. Links without a URL render as plain text until one is added.
export type Link = { label: string; href?: string };

export const site = {
  name: 'Rafael Akira',
  title: 'Rafael Akira — Senior Designer, São Paulo',
  description:
    'Rafael Akira is a systems thinker and designer based in São Paulo, with ten years across brand expression, craft and design systems. Currently at IBM.',
  email: 'rakira.design@protonmail.com',
  npx: 'npx rafael-akira-md',
  availability: 'Open to senior / lead design roles and selected independent projects. [confirm wording]',
};

// Footer contact links (desktop list and mobile line)
export const footerLinks: (Link & { mark: string })[] = [
  { label: 'LinkedIn', mark: '↗', href: 'https://www.linkedin.com/in/rafaelakiraimairozner/' },
  { label: 'Behance', mark: '↗' }, // TODO: add URL
  { label: 'Résumé (PDF)', mark: '↓' }, // TODO: add the PDF to /public and link it
  { label: 'AI-readable profile', mark: '→' }, // future: /profile.md and /llms.txt
];

// About page: contact navigation
export const contactLinks: Link[] = [
  { label: 'Bluesky' }, // TODO: add URL
  { label: 'Threads' }, // TODO: add URL
  { label: 'Mastodon' }, // TODO: add URL
  { label: 'Cosmos' }, // TODO: add URL
  { label: 'Instagram' }, // TODO: add URL
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rafaelakiraimairozner/' },
  { label: 'GitHub', href: 'https://github.com/Rakiraa' },
];
