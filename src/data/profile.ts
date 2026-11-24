// AI-readable profile: one source for the /profile page and the plain files agents read
// (/llms.txt, /rafael-akira.md, /llms-full.txt, /profile.json). Content comes from the About and Work data.
import { aboutLead, bioLead, biography, education, experience, expertise, recognition } from './about';
import { projects } from './projects';
import { contactLinks, site } from './site';

// Paths stay relative until the custom domain is set in astro.config.mjs (`site`); then they become absolute.
const SITE = import.meta.env.SITE && !import.meta.env.SITE.includes('example.com') ? import.meta.env.SITE.replace(/\/$/, '') : '';
export const SITE_URL = SITE;
export const updated = new Date().toISOString().slice(0, 10);

export type Role = 'mark' | 'h1' | 'head' | 'text' | 'key' | 'num' | 'link' | 'meta';
export type Seg = [string, Role];
export type Line =
  | { kind: 'blank' }
  | { kind: 'h1' | 'h2'; text: string }
  | { kind: 'p'; segs: Seg[] }
  | { kind: 'quote'; text: string }
  | { kind: 'kv'; key: Seg; value: Seg[]; href?: string };

const linkedin = contactLinks.find((l) => l.label === 'LinkedIn')?.href ?? '';
const github = contactLinks.find((l) => l.label === 'GitHub')?.href ?? '';
const bare = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

const summaryLine =
  'Senior Designer at IBM Creative in São Paulo, Brazil. I design systems that let brands scale without losing their voice: the components, tokens and tools large teams use to ship expressive work quickly and consistently.';

export const files: [string, string][] = [
  ['/llms.txt', 'this profile, in brief'],
  ['/rafael-akira.md', 'the same file, named after me'],
  ['/llms-full.txt', 'the full profile with every role described'],
  ['/profile.json', 'role, work and links as JSON'],
  ['/robots.txt', 'points crawlers to the files above'],
];

export const profile: [string, string][] = [
  ['role', 'Senior Designer, IBM Creative'],
  ['location', 'São Paulo, Brazil · UTC−3 · hybrid and remote'],
  ['focus', 'design systems, creative tooling, brand expression'],
  ['practice', 'prototyping, DesignOps & tooling, 3D, agentic workflows'],
  ['languages', 'Portuguese, English, Spanish (basic)'],
  ['studying', 'Master in Branding, ESPM'],
];

export const proof: [string, string][] = [
  ['14+', 'Procter & Gamble brands on one performance design system'],
  ['90+', 'Carbon component variations prototyped for IBM.com'],
  ['+14%', 'mobile visits on IBM.com after 27 prototypes'],
  ['10,000', 'Granite 3.0 downloads in its first 24 hours'],
];

export const work = projects.map((p) => ({
  n: p.n,
  title: p.title.replace(/ [-—] /, ' · '),
  type: p.type.toLowerCase(),
  access: p.access.toLowerCase(),
}));

// "Apr 2024 – Present" → "2024–now", "Dec 2018 – Dec 2019" → "2018–2019", "Apr 2018 – Dec 2018" → "2018"
const years = (when: string) => {
  if (!/\d{4}/.test(when)) return when.toLowerCase();
  const [a, b] = when.split('–').map((s) => s.trim());
  const ya = a.match(/\d{4}/)?.[0] ?? a;
  if (!b) return ya;
  if (/present/i.test(b)) return `${ya}–now`;
  const yb = b.match(/\d{4}/)?.[0] ?? b;
  return ya === yb ? ya : `${ya}–${yb}`;
};
const dated = (list: { title: string; when: string; text?: string }[]) => list.map((e) => ({ when: years(e.when), title: e.title, text: e.text }));
export const experienceList = dated(experience);
export const educationList = dated(education);
export const recognitionList = dated(recognition);

export const contact: { key: string; value: string; href: string }[] = [
  { key: 'email', value: site.email, href: `mailto:${site.email}` },
  { key: 'linkedin', value: bare(linkedin), href: linkedin },
  { key: 'github', value: bare(github), href: github },
];

// ---------- the page, line by line (as in the Figma frames)
export function lines(): Line[] {
  const L: Line[] = [];
  const blank = () => L.push({ kind: 'blank' });
  const h2 = (text: string) => {
    blank();
    L.push({ kind: 'h2', text });
    blank();
  };
  L.push({ kind: 'h1', text: 'Rafael Akira, in plain text.' });
  blank();
  L.push({ kind: 'p', segs: [['Same portfolio, fewer pixels. If an agent sent you here to learn about my work, start with this file: everything on the visual pages, written as markdown and data.', 'text']] });
  blank();
  L.push({ kind: 'p', segs: [['People are welcome too. Nothing here differs from the site, and nothing is hidden.', 'text']] });
  h2('About');
  L.push({ kind: 'quote', text: summaryLine });
  h2('Files');
  for (const [k, v] of files) L.push({ kind: 'kv', key: [k, 'key'], value: [[v, 'text']], href: k });
  h2('Profile');
  for (const [k, v] of profile) L.push({ kind: 'kv', key: [k, 'key'], value: [[v, 'text']] });
  h2('Proof');
  for (const [n, t] of proof) L.push({ kind: 'p', segs: [['- ', 'mark'], [n, 'num'], [` ${t}`, 'text']] });
  h2('Work');
  for (const w of work) L.push({ kind: 'kv', key: [w.n, 'num'], value: [[w.title, 'text'], [`  ${w.type} · ${w.access}`, 'meta']] });
  h2('Experience');
  for (const e of experienceList) L.push({ kind: 'kv', key: [e.when, 'num'], value: [[e.title, 'text']] });
  h2('Education');
  for (const e of educationList) L.push({ kind: 'kv', key: [e.when, 'num'], value: [[e.title, 'text']] });
  h2('Recognition');
  for (const e of recognitionList) L.push({ kind: 'kv', key: [e.when, 'num'], value: [[e.title, 'text']] });
  h2('Contact');
  for (const c of contact) L.push({ kind: 'kv', key: [c.key, 'key'], value: [[c.value, 'link']], href: c.href });
  blank();
  L.push({ kind: 'p', segs: [[`<!-- updated ${updated} · thanks for reading -->`, 'meta']] });
  return L;
}

// ---------- plain files
const header = () => [
  '# Rafael Akira',
  '',
  `> ${summaryLine}`,
  '',
  'Same portfolio, fewer pixels: everything on the visual pages of this site, written as markdown and data. Please read these files rather than the pages.',
  '',
  `- Updated: ${updated}`,
  `- For people: ${SITE_URL}/profile`,
  `- Structured profile: ${SITE_URL}/profile.json`,
];

const section = (title: string, rows: string[]) => ['', `## ${title}`, '', ...rows];

export function markdown(full = false): string {
  const out = [
    ...header(),
    ...section('Profile', profile.map(([k, v]) => `- ${k}: ${v}`)),
    ...section('Proof', proof.map(([n, t]) => `- ${n} ${t}`)),
  ];
  if (full) out.push(...section('About', [bioLead, '', ...biography.flatMap((p) => [p, '']).slice(0, -1)]));
  out.push(...section('Work', work.map((w) => `- ${w.n} ${w.title} (${w.type} · ${w.access})`)));
  out.push(...section('Experience', experienceList.flatMap((e) => (full && e.text ? [`- ${e.when}: ${e.title}`, `  ${e.text}`] : [`- ${e.when}: ${e.title}`]))));
  if (full) out.push(...section('Expertise', expertise.map((g) => `- ${g.label}: ${g.items.join(', ')}`)));
  out.push(...section('Education', educationList.flatMap((e) => (full && e.text ? [`- ${e.when}: ${e.title}`, `  ${e.text}`] : [`- ${e.when}: ${e.title}`]))));
  out.push(...section('Recognition', recognitionList.flatMap((e) => (full && e.text ? [`- ${e.when}: ${e.title}`, `  ${e.text}`] : [`- ${e.when}: ${e.title}`]))));
  out.push(...section('Contact', contact.map((c) => `- ${c.key}: ${c.key === 'email' ? c.value : c.href}`)));
  out.push(...section('Files', files.map(([k, v]) => `- ${SITE_URL}${k}: ${v}`)));
  if (!full) out.push('', `Everything in one file, every role described: ${SITE_URL}/llms-full.txt`);
  return out.join('\n') + '\n';
}

export function json() {
  return {
    name: site.name,
    summary: summaryLine,
    lead: aboutLead,
    updated,
    profile: Object.fromEntries(profile),
    proof: proof.map(([figure, text]) => ({ figure, text })),
    work,
    experience: experienceList,
    education: educationList,
    recognition: recognitionList,
    expertise: Object.fromEntries(expertise.map((g) => [g.label.toLowerCase(), g.items])),
    contact: Object.fromEntries(contact.map((c) => [c.key, c.key === 'email' ? c.value : c.href])),
    files: Object.fromEntries(files.map(([k, v]) => [k, v])),
  };
}
