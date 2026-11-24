// Pointer modeled on azumbrunnen.me (an iPadOS-style pointer), rebuilt for this site with Carbon tokens.
// - Idle: a 36px thin ring with a small blue dot follows the mouse directly, with no lag.
// - Over text (the letters themselves, not blank space or icons) it becomes a 3px caret, 1.4 × the font size tall.
// - Over buttons, links and project rows it snaps onto the element (its size and corner radius) in 0.1s.
//   Neither the highlight nor the element moves with the pointer while locked (no parallax).
// Mouse and trackpad only: touch devices keep the system behavior, and a touch turns the pointer off.

const TEXT = 'h1, h2, h3, h4, h5, h6, p, dd, dt, figcaption, blockquote';
const LOCK = 'a[href], button:not(:disabled), [role="button"], .row';

type Box = { left: number; top: number; width: number; height: number };

export function mountCursor(): void {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const root = document.documentElement;
  const el = document.createElement('div');
  el.className = 'pointer';
  el.setAttribute('aria-hidden', 'true');

  let x = 0;
  let y = 0;
  let seen = false; // nothing is drawn before the first mouse move
  let dead = false; // set by a touch
  let mode: 'circle' | 'text' | 'lock' = 'circle';
  let textSize = 0;
  let target: HTMLElement | null = null; // the element the pointer is locked onto
  let box: Box = { left: 0, top: 0, width: 0, height: 0 }; // its rect
  let scrollEnd = 0;
  let frame = 0;

  const still = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const attach = () => {
    if (!el.isConnected) document.body.appendChild(el);
    root.classList.add('has-pointer');
  };

  const follow = () => {
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
  };

  const release = () => {
    target = null;
  };

  const circle = () => {
    release();
    mode = 'circle';
    textSize = 0;
    el.classList.remove('is-text', 'is-locked');
    el.style.width = el.style.height = el.style.borderRadius = el.style.transform = '';
  };

  const measure = () => {
    if (!target) return;
    const r = target.getBoundingClientRect();
    box = { left: r.left, top: r.top, width: r.width, height: r.height };
    el.style.left = `${box.left + box.width / 2}px`;
    el.style.top = `${box.top + box.height / 2}px`;
  };

  const lock = (t: HTMLElement) => {
    release();
    target = t;
    mode = 'lock';
    textSize = 0;
    const cs = getComputedStyle(t);
    el.classList.remove('is-text');
    el.classList.add('is-locked');
    measure();
    el.style.width = `${box.width}px`;
    el.style.height = `${box.height}px`;
    el.style.borderRadius = cs.borderRadius;
  };

  const text = (t: Element) => {
    const size = parseFloat(getComputedStyle(t).fontSize) || 16;
    if (mode === 'text' && size === textSize) return;
    release();
    mode = 'text';
    textSize = size;
    el.classList.remove('is-locked');
    el.classList.add('is-text');
    // the box keeps its idle size; the dot inside stretches to the caret height (see .pointer.is-text::after)
    el.style.width = el.style.height = el.style.borderRadius = el.style.transform = '';
    el.style.setProperty('--caret-h', `${size * 1.4}px`);
  };

  // the element whose letters sit under the point, or null over blank space, icons, images and the canvas
  const range = document.createRange();
  type CaretDoc = Document & {
    caretPositionFromPoint?: (px: number, py: number) => { offsetNode: Node; offset: number } | null;
    caretRangeFromPoint?: (px: number, py: number) => Range | null;
  };
  const glyphAt = (px: number, py: number): Element | null => {
    const d = document as CaretDoc;
    let node: Node | null = null;
    let offset = 0;
    if (d.caretPositionFromPoint) {
      const pos = d.caretPositionFromPoint(px, py);
      if (pos) ({ offsetNode: node, offset } = pos);
    } else if (d.caretRangeFromPoint) {
      const r = d.caretRangeFromPoint(px, py);
      if (r) { node = r.startContainer; offset = r.startOffset; }
    }
    if (!node || node.nodeType !== Node.TEXT_NODE) return null;
    const len = node.textContent?.length ?? 0;
    for (const o of [offset - 1, offset]) {
      if (o < 0 || o >= len) continue;
      range.setStart(node, o);
      range.setEnd(node, o + 1);
      for (const r of range.getClientRects()) {
        if (r.width > 0 && px >= r.left - 1 && px <= r.right + 1 && py >= r.top && py <= r.bottom) return node.parentElement;
      }
    }
    return null;
  };

  // what sits under the pointer decides its shape; links inside running text read as text
  const resolve = (node: Element | null) => {
    const lockT = node?.closest<HTMLElement>(LOCK) ?? null;
    if (lockT && !lockT.parentElement?.closest(TEXT)) {
      if (lockT !== target) lock(lockT);
      return;
    }
    const hit = node?.closest('[aria-disabled="true"]') ? null : glyphAt(x, y);
    if (hit) text(hit);
    else if (mode !== 'circle') circle();
  };

  // locked: the highlight stays on the element's center; otherwise it follows the pointer
  const place = () => {
    if (!target) follow();
  };

  document.addEventListener(
    'pointermove',
    (e) => {
      if (dead || e.pointerType === 'touch') return;
      x = e.clientX;
      y = e.clientY;
      if (!seen) {
        seen = true;
        attach();
      }
      el.classList.remove('is-out');
      resolve(e.target as Element);
      place();
    },
    { passive: true },
  );

  // the page moves under a still mouse: keep a locked highlight on its element, and re-check the shape
  window.addEventListener(
    'scroll',
    () => {
      if (!seen || dead || frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        el.classList.add('is-scrolling');
        clearTimeout(scrollEnd);
        scrollEnd = window.setTimeout(() => el.classList.remove('is-scrolling'), 150);
        measure();
        resolve(document.elementFromPoint(x, y));
        place();
      });
    },
    { passive: true },
  );

  window.addEventListener('resize', () => measure(), { passive: true });

  // leaving the window hides it, like the system cursor
  document.addEventListener('mouseout', (e) => {
    if (e.relatedTarget || !seen) return;
    circle();
    el.classList.add('is-out');
  });

  window.addEventListener(
    'touchstart',
    () => {
      dead = true;
      circle();
      el.remove();
      root.classList.remove('has-pointer');
    },
    { passive: true, once: true },
  );

  // Work ⇄ About swaps <body> and the <html> attributes: put the pointer back and re-check what is under it
  document.addEventListener('astro:after-swap', () => {
    if (dead || !seen) return;
    if (target && !target.isConnected) target = null;
    attach();
    resolve(document.elementFromPoint(x, y));
    place();
  });
}
