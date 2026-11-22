// Carbon icons, rendered to inline SVG at build time (no client JS).
import arrowRight16 from '@carbon/icons/es/arrow--right/16.js';
import bullhorn16 from '@carbon/icons/es/bullhorn/16.js';
import chemistry16 from '@carbon/icons/es/chemistry/16.js';
import cicsSystemGroup16 from '@carbon/icons/es/cics--system-group/16.js';
import copy16 from '@carbon/icons/es/copy/16.js';
import dataEnrichment16 from '@carbon/icons/es/data-enrichment/16.js';
import dataViewAlt16 from '@carbon/icons/es/data--view--alt/16.js';
import documentMultiple16 from '@carbon/icons/es/document--multiple-01/16.js';
import dotMark16 from '@carbon/icons/es/dot-mark/16.js';
import eventsAlt16 from '@carbon/icons/es/events--alt/16.js';
import fingerprint16 from '@carbon/icons/es/fingerprint-recognition/16.js';
import locked16 from '@carbon/icons/es/locked/16.js';
import logoFigma16 from '@carbon/icons/es/logo--figma/16.js';
import moon20 from '@carbon/icons/es/moon/20.js';
import portfolio16 from '@carbon/icons/es/portfolio/16.js';
import presentationFile16 from '@carbon/icons/es/presentation-file/16.js';
import reset16 from '@carbon/icons/es/reset/16.js';
import sun20 from '@carbon/icons/es/sun/20.js';
import sunrise16 from '@carbon/icons/es/sunrise/16.js';
import sunrise20 from '@carbon/icons/es/sunrise/20.js';
import sunset20 from '@carbon/icons/es/sunset/20.js';
import toolBox16 from '@carbon/icons/es/tool-box/16.js';
import visualInspection16 from '@carbon/icons/es/visual-inspection/16.js';

type IconNode = { elem: string; attrs?: Record<string, string | number>; content?: IconNode[] };

const ICONS: Record<string, IconNode> = {
  'arrow--right/16': arrowRight16,
  'bullhorn/16': bullhorn16,
  'chemistry/16': chemistry16,
  'cics--system-group/16': cicsSystemGroup16,
  'copy/16': copy16,
  'data-enrichment/16': dataEnrichment16,
  'data--view--alt/16': dataViewAlt16,
  'document--multiple-01/16': documentMultiple16,
  'dot-mark/16': dotMark16,
  'events--alt/16': eventsAlt16,
  'fingerprint-recognition/16': fingerprint16,
  'locked/16': locked16,
  'logo--figma/16': logoFigma16,
  'moon/20': moon20,
  'portfolio/16': portfolio16,
  'presentation-file/16': presentationFile16,
  'reset/16': reset16,
  'sun/20': sun20,
  'sunrise/16': sunrise16,
  'sunrise/20': sunrise20,
  'sunset/20': sunset20,
  'tool-box/16': toolBox16,
  'visual-inspection/16': visualInspection16,
};

const esc = (v: string | number) => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

function serialize(node: IconNode): string {
  const attrs = Object.entries(node.attrs ?? {})
    .map(([k, v]) => ` ${k}="${esc(v)}"`)
    .join('');
  const inner = (node.content ?? []).map(serialize).join('');
  return `<${node.elem}${attrs}>${inner}</${node.elem}>`;
}

export function iconSvg(name: string, size = 16, className = ''): string {
  const node = ICONS[`${name}/${size}`];
  if (!node) throw new Error(`Icon not registered: ${name}/${size}`);
  const root: IconNode = {
    ...node,
    attrs: {
      ...node.attrs,
      fill: 'currentColor',
      'aria-hidden': 'true',
      focusable: 'false',
      ...(className ? { class: className } : {}),
    },
  };
  return serialize(root);
}
