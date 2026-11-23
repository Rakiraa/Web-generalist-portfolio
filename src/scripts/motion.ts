// Shared motion: GSAP setup, progressive reveal, content-only page swaps, and the custom pointer.
// Everything respects prefers-reduced-motion.
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mountCursor } from './cursor';

gsap.registerPlugin(CustomEase, Flip, ScrollTrigger);
// Carbon motion curves
CustomEase.create('expressive', '0.4, 0.14, 0.3, 1');
CustomEase.create('productive', '0.2, 0, 0.38, 0.9');
CustomEase.create('exit', '0.2, 0, 1, 0.9');

export { gsap, Flip, ScrollTrigger };
export const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- progressive reveal: elements marked [data-reveal] rise in as they enter the viewport
let mainTriggers: ScrollTrigger[] = [];

export function reveal(scope: ParentNode, isMain = false) {
  const els = [...scope.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])')];
  if (!els.length) return;
  if (reduceMotion()) {
    els.forEach((el) => (el.dataset.revealed = ''));
    return;
  }
  const triggers = ScrollTrigger.batch(els, {
    start: 'top 96%',
    once: true,
    onEnter: (batch) => {
      batch.forEach((el) => ((el as HTMLElement).dataset.revealed = ''));
      gsap.fromTo(batch, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'expressive', stagger: 0.06, overwrite: true, clearProps: 'transform' });
    },
  });
  if (isMain) mainTriggers.push(...triggers);
}

// ---------- content-only navigation: the top (header, hero, intro, switcher) stays; only <main> changes
let keepY = 0;

function leaveMain(): Promise<void> {
  const els = document.querySelectorAll('main [data-reveal]');
  if (reduceMotion() || !els.length) return Promise.resolve();
  return new Promise((resolve) => {
    gsap.to(els, { autoAlpha: 0, y: -12, duration: 0.24, ease: 'exit', stagger: 0.015, overwrite: true, onComplete: () => resolve() });
  });
}

document.addEventListener('astro:before-preparation', (event) => {
  const e = event as Event & { loader: () => Promise<void> };
  const bar = document.querySelector<HTMLElement>('.cs-bar');
  // keep the view where it is, but never below the switcher, so the new content starts right under it
  keepY = bar ? Math.min(window.scrollY, bar.offsetTop) : window.scrollY;
  const load = e.loader;
  e.loader = async () => {
    await Promise.all([load(), leaveMain()]);
  };
});

document.addEventListener('astro:before-swap', () => {
  mainTriggers.forEach((t) => t.kill());
  mainTriggers = [];
});

document.addEventListener('astro:after-swap', () => {
  // the swap replaces the <html> attributes, so restore the class that gates the reveal styles
  document.documentElement.classList.add('js');
  window.scrollTo({ top: keepY, left: 0, behavior: 'instant' });
});

let firstLoad = true;
document.addEventListener('astro:page-load', () => {
  if (firstLoad) {
    firstLoad = false;
    reveal(document);
  } else {
    const main = document.querySelector('main');
    if (main) reveal(main, true);
  }
  ScrollTrigger.refresh();
});

// ---------- pointer (mouse and trackpad only), see cursor.ts
mountCursor();
