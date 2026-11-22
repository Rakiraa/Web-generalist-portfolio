// About page content, as set in the Figma clean copy. Bracketed text is still to be confirmed.
export const aboutIntro =
  'A designer between systems and expression. Where I have worked, what I studied, and the brands and teams I have designed for.';

export const biography = [
  'I’m a designer based in São Paulo, Brazil, by way of Florianópolis, where I studied Business Administration at UFSC and then Industrial Design at UDESC.',
  'My way into digital design ran through 3D. I started out modeling and rendering products, materials and shaders for retail, then moved into UX research, interaction and visual design at Accenture Song, where I helped build the Performance Design System that scaled creative production across 14+ Procter & Gamble brands.',
  'I like work that sits between systems and expression: components, tokens and tooling on one side; brand, motion and craft on the other. I prototype a lot, build small plugins when a process gets in the way, and use AI to make design operations faster without making them sloppier.',
  'Currently I’m a Senior Visual Designer at IBM, working on IBM.com with Carbon, editorial hubs and AI launches, while completing a Master in Branding at ESPM. Reach me at rakira.design@protonmail.com.',
];

export type Entry = { title: string; when: string; text?: string };

export const experience: Entry[] = [
  { title: 'Senior Visual Designer at IBM (São Paulo, Hybrid)', when: 'Apr 2024 – Present', text: 'Visual design and interaction lead in the IBM.com Design-Led Innovation squad: 27 mobile-optimization prototypes and 90+ component variations that lifted mobile visits 14%. Launch visuals for Granite 3.0 (10,000 model downloads in 24 hours), a Tier 1 AI campaign with 96% engagement, Carbon component work, editorial hubs, AEM and mentoring.' },
  { title: 'Visual Design Specialist, Performance Design System at Accenture Song (Remote)', when: 'May 2022 – Jan 2024', text: 'Built and scaled a performance design system for 14+ P&G brands: atomic, WCAG 2.2-compliant email and banner components, webGL and 3D banners, and Figma plugin prototypes. Email open rates above 50%, CTOR 13%, unsubscribes down from 57% to 28%.' },
  { title: 'Product Designer at Walcraft Cabinetry (US, Remote)', when: 'Dec 2022 – Aug 2023', text: 'UX and UI for a desktop 3D kitchen builder in Unreal Engine 5, from journey and story maps to Figma prototypes and a handover adapted to engine constraints.' },
  { title: '3D Artist at Accenture Song', when: 'Aug 2020 – May 2022', text: 'Real-time and offline 3D for global brands: materials, shaders and product visualization for retail.' },
  { title: 'Design Intern at Accenture', when: 'Dec 2019 – Aug 2020', text: 'Process and platform UX for a CGI production pipeline: workflow mapping, a material library and a faster retouch request flow.' },
  { title: '3D Artist at UNICOBA', when: 'Dec 2018 – Dec 2019', text: '3D modeling and product visualization.' },
  { title: 'Graphic Design Intern', when: 'Apr 2018 – Dec 2018' },
  { title: 'UX Research Intern (Florianópolis)', when: 'Aug 2016 – Oct 2017' },
];

export const academics: Entry[] = [
  { title: 'Master in Branding — ESPM', when: 'In progress', text: 'Brand strategy, brand equity and visual identity: the strategic layer behind design systems and creative direction.' },
  { title: 'Full Stack Design — EBAC', when: '2023', text: 'UX research, UI and front-end fundamentals, with a research project on fashion e-commerce.' },
  { title: 'B.Sc. Industrial Design — UDESC', when: '2020', text: 'Thesis on the evolutionary process of artifacts.' },
  { title: 'Business Administration — UFSC', when: '2015' },
  { title: 'Certifications', when: '2020 – 2025', text: 'Adobe Experience Manager, Analytics and Customer Journey Analytics; IBM Enterprise Design Thinking and Accessibility; Interaction Design Foundation.' },
];

export const recognitions: Entry[] = [
  { title: 'Accenture V360 Award — Meta Marketplace Medallions', when: 'Jan 2023', text: 'Hackathon prototype using on-chain verification to reduce counterfeit listings on Instagram.' },
  { title: 'Prêmio Bornancini de Design', when: '[Year — to confirm]' },
  { title: 'UX Seminary', when: '[Year — to confirm]' },
];

export const expertise = {
  Vertical: ['Enterprise & AI', 'Thought Leadership', 'Growth & Performance', 'Healthcare', 'Home & Furniture', 'Retail & E-commerce', 'Consumer Goods (CPG)', 'Nonprofit'],
  Horizontal: ['Design Systems', 'Creative Systems', 'Tooling', 'DesignOps', 'Prototyping', '3D Interaction', 'Visual Design', 'Enterprise Design Thinking', 'Agentic Workflows'],
};

// NOTE: the design currently repeats the expertise lists here as placeholder copy.
export const clients = [
  ['Enterprise & AI', 'Thought Leadership', 'Growth & Performance', 'Healthcare', 'Home & Furniture', 'Retail & E-commerce', 'Consumer Goods (CPG)', 'Nonprofit'],
  ['Design Systems', 'Creative Systems', 'Tooling', 'DesignOps', 'Prototyping', '3D Interaction', 'Visual Design', 'Enterprise Design Thinking', 'Agentic Workflows'],
];
