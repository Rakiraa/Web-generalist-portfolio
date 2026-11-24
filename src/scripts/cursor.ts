// Pointer modeled on azumbrunnen.me (an iPadOS-style pointer), rebuilt for this site with Carbon tokens.
// - A 36px translucent circle follows the mouse directly, with no lag.
// - Over headings and paragraphs it becomes a 3px text caret, 1.4 × the font size tall.
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
  let textEl: Element | null = null;
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
    textEl = null;
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
    textEl = null;
    const cs = getComputedStyle(t);
    el.classList.remove('is-text');
    el.classList.add('is-locked');
    measure();
    el.style.width = `${box.width}px`;
    el.style.height = `${box.height}px`;
    el.style.borderRadius = cs.borderRadius;
  };

  const text = (t: Element) => {
    release();
    mode = 'text';
    textEl = t;
    el.classList.remove('is-locked');
    el.classList.add('is-text');
    el.style.width = el.style.borderRadius = el.style.transform = '';
    el.style.height = `${parseFloat(getComputedStyle(t).fontSize) * 1.4}px`;
  };

  // what sits under the pointer decides its shape; links inside running text read as text
  const resolve = (node: Element | null) => {
    const lockT = node?.closest<HTMLElement>(LOCK) ?? null;
    const textT = node?.closest(TEXT) ?? null;
    const next = lockT && !(textT && textT !== lockT && textT.contains(lockT)) ? lockT : null;
    if (next) {
      if (next !== target) lock(next);
    } else if (textT) {
      if (mode !== 'text' || textEl !== textT) text(textT);
    } else if (mode !== 'circle') {
      circle();
    }
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
