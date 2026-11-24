// About page content, as set in the Figma "Ready to deploy V2 — Clean" About frames.

export const aboutTitle = 'I design systems that let brands scale without losing their voice.';

export const aboutLead =
  'Senior Designer at IBM Creative, working across design systems, creative tooling and brand expression.';

export const facts: { figure: string; text: string }[] = [
  { figure: '10 years', text: 'Across design systems, visual design and UX.' },
  { figure: '14+', text: 'Brands on one performance design system.' },
  { figure: '90+', text: 'Carbon component variations prototyped for IBM.' },
  { figure: '+14%', text: 'Mobile visits on IBM.com after 27 prototypes.' },
];

export const bioLead =
  'I’m a design systems designer with a brand mind. I build the components, tokens and tools that let large teams ship expressive work quickly and consistently.';

export const biography = [
  'At IBM I led visual design and interaction in the IBM.com Design-Led Innovation squad: 27 mobile prototypes and 90+ Carbon component variations that lifted mobile visits 14%, and launch visuals for Granite 3.0, downloaded 10,000 times in its first 24 hours. Today, at IBM Creative, I build reusable patterns, foundational layouts and tools that help teams work within enterprise CMS constraints without losing design quality.',
  'Before that, at Accenture Song, I helped build the Performance Design System: accessible, atomic email and banner components that scaled creative production across 14+ Procter & Gamble brands and cut unsubscribes from 57% to 28%.',
  'I came to digital design through 3D, rendering products, materials and shaders for retail. It still shapes how I work: I prototype in the real medium, build small plugins when a process gets in the way, and use AI to make design operations faster. I’m based in São Paulo and completing a Master in Branding at ESPM, the strategy behind what a system should express.',
];

export type Entry = { title: string; when: string; text?: string };

export const experience: Entry[] = [
  {
    title: 'Senior Designer, IBM',
    when: 'Apr 2024 – Present',
    text: 'At IBM Creative: reusable patterns, foundational layouts and tools for enterprise CMS work. Before that, visual design and interaction lead for the IBM.com Design-Led Innovation squad: 27 mobile prototypes, 90+ Carbon component variations and 20 new micro-interaction components lifted mobile visits 14% and cut bounce rate by 3.5 points. Launch visuals for Granite 3.0 and a Tier 1 AI campaign (96% engagement).',
  },
  {
    title: 'Visual Design Specialist, Accenture Song',
    when: 'May 2022 – Jan 2024',
    text: 'Built and scaled the Performance Design System for 14+ P&G brands: atomic, WCAG 2.2 email and banner components, WebGL and 3D banners, and Figma plugin prototypes. Open rates above 50%, CTOR 13%, unsubscribes down from 57% to 28%.',
  },
  {
    title: 'Product Designer, Walcraft Cabinetry',
    when: 'Dec 2022 – Aug 2023',
    text: 'UX and UI for a 3D kitchen builder in Unreal Engine 5, from journey maps to Figma prototypes and a handover shaped by engine constraints.',
  },
  { title: '3D Artist, Accenture Song', when: 'Aug 2020 – May 2022', text: 'Real-time and offline 3D for global brands: materials, shaders and product visualization for retail.' },
  {
    title: 'Design Intern, Accenture Song',
    when: 'Dec 2019 – Aug 2020',
    text: 'UX for a CGI production pipeline: workflow mapping, a shared material library and a faster retouch request flow.',
  },
  { title: '3D Artist, UNICOBA', when: 'Dec 2018 – Dec 2019', text: 'Product modeling and visualization.' },
  { title: 'Graphic Design Intern, UDESC Graphic Design Lab', when: 'Apr 2018 – Dec 2018' },
  { title: 'UX Research Intern, UDESC UX Lab', when: 'Aug 2016 – Oct 2017' },
];

export const expertise: { label: string; items: string[] }[] = [
  {
    label: 'Industries',
    items: ['Enterprise & AI', 'Thought Leadership', 'Growth & Performance', 'Healthcare', 'Home & Furniture', 'Retail & E-commerce', 'Consumer Goods (CPG)', 'Nonprofit'],
  },
  {
    label: 'Practice',
    items: ['Design Systems', 'DesignOps & Tooling', 'Creative Systems', 'Prototyping', 'Visual Design', 'User Experience', 'Agentic Workflows', 'Brand Strategy', 'Enterprise Design Thinking'],
  },
];

export const education: Entry[] = [
  { title: 'Master in Branding, ESPM', when: 'In progress', text: 'Brand strategy, brand equity and visual identity: the strategic layer behind design systems and creative direction.' },
  { title: 'Full Stack Design, EBAC', when: '2023', text: 'A program across the whole product design process: UX research, UI design, prototyping and front-end fundamentals.' },
  { title: 'B.Sc. Industrial Design, UDESC', when: '2020', text: 'Thesis on the evolutionary process of artifacts.' },
  { title: 'Business Administration, UFSC', when: '2015' },
  {
    title: 'Certifications',
    when: '2020 – 2025',
    text: 'Adobe Experience Manager, Analytics and Customer Journey Analytics; IBM Enterprise Design Thinking and Accessibility; Interaction Design Foundation.',
  },
];

export const recognition: Entry[] = [
  { title: 'Accenture V360 Award — Meta Marketplace Medallions', when: 'Jan 2023', text: 'Hackathon prototype using on-chain verification to reduce counterfeit listings on Instagram.' },
  {
    title: 'Prêmio Bornancini de Design',
    when: 'Jan 2021',
    text: 'Third place, wayfinding category: new wayfinding and a wheelchair-accessible service desk for the UDESC main library, in the LabDesign extension program.',
  },
];
