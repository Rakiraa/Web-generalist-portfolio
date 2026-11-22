// Work index — one line per project. Project pages are future work, so rows are not links yet.
export type DisciplineId = 'ux' | 'ds' | 'cd' | 'vd' | 'tools' | 'ops';

export const disciplines: { id: DisciplineId; label: string; icon: string }[] = [
  { id: 'ux', label: 'User Experience', icon: 'logo--figma' },
  { id: 'ds', label: 'Design Systems', icon: 'cics--system-group' },
  { id: 'cd', label: 'Creative Direction', icon: 'bullhorn' },
  { id: 'vd', label: 'Visual Design', icon: 'visual-inspection' },
  { id: 'tools', label: 'Tools', icon: 'tool-box' },
  { id: 'ops', label: 'DesignOps', icon: 'events--alt' },
];

export type WorkType = 'Case Study' | 'Showcase' | 'Proof of concept' | 'Documentation';
export type Access = 'Meeting Only' | 'Public';

export const workTypeIcon: Record<WorkType, string> = {
  'Case Study': 'portfolio',
  Showcase: 'presentation-file',
  'Proof of concept': 'data-enrichment',
  Documentation: 'document--multiple-01',
};

export const accessIcon: Record<Access, string> = {
  'Meeting Only': 'locked',
  Public: 'dot-mark',
};

export type Project = { n: string; title: string; client: string; type: WorkType; access: Access; d: DisciplineId[] };

const M: Access = 'Meeting Only';
const P: Access = 'Public';

export const projects: Project[] = [
  { n: '01', title: 'IBM - Think Leadership Creative System', client: '[for whom]', type: 'Case Study', access: M, d: ['ux', 'ds', 'vd', 'ops'] },
  { n: '02', title: 'IBM - Apostrophe Tool', client: '[for whom]', type: 'Showcase', access: M, d: ['ux', 'tools'] },
  { n: '03', title: 'IBM - 3D Animated Leadspaces Toolkit', client: '[for whom]', type: 'Showcase', access: M, d: ['ux', 'tools'] },
  { n: '04', title: 'IBM - Cost of a Data Breach', client: '[for whom]', type: 'Showcase', access: M, d: ['ux', 'cd', 'vd'] },
  { n: '05', title: 'IBM - Layout Modernization Carbon for AEM', client: '[for whom]', type: 'Proof of concept', access: M, d: ['ux', 'ds', 'vd'] },
  { n: '06', title: 'IBM - Future Home Page', client: '[for whom]', type: 'Proof of concept', access: M, d: ['ux', 'vd'] },
  { n: '07', title: 'IBM - Illustrations & Visuals 01', client: '[for whom]', type: 'Showcase', access: P, d: ['vd'] },
  { n: '08', title: 'IBM - Mobile Optimisation Carbon for AEM', client: '[for whom]', type: 'Case Study', access: M, d: ['ux', 'ds', 'vd'] },
  { n: '09', title: 'IBM - Product Finder', client: '[for whom]', type: 'Showcase', access: M, d: ['ux', 'vd'] },
  { n: '10', title: 'IBM - New comers onboarding', client: '[for whom]', type: 'Documentation', access: M, d: ['vd', 'ops'] },
  { n: '11', title: 'Accenture - Performance Design System', client: '[for whom]', type: 'Case Study', access: M, d: ['ds', 'vd', 'tools'] },
  { n: '12', title: 'Walcraft Cabinetry — Unreal Kitchen Builder', client: '[for whom]', type: 'Case Study', access: P, d: ['ux', 'vd'] },
  { n: '13', title: 'Roche Viewicz - 3D Landing Page', client: '[for whom]', type: 'Proof of concept', access: P, d: ['ux', 'vd'] },
  { n: '14', title: 'Save the Children - Ad Banners', client: '[for whom]', type: 'Showcase', access: P, d: ['vd'] },
  { n: '15', title: 'Accenture - Subscription Manager App', client: '[for whom]', type: 'Case Study', access: P, d: ['ux'] },
  { n: '16', title: 'Mobile Game - 3D Art', client: '[for whom]', type: 'Showcase', access: P, d: ['vd'] },
  { n: '17', title: 'UNICOBA - Batch Industrial CGI Rendering', client: '[for whom]', type: 'Showcase', access: P, d: ['vd'] },
  { n: '18', title: 'Accenture - CGI & AR/VR for Furniture E-comm', client: '[for whom]', type: 'Showcase', access: P, d: ['vd'] },
];
