// Clock field engine — renders the generator's scenes to a canvas and animates between them.
// Scenes: idle (10:10, 1.5 s) → weather → wind → time → weather … (3 s holds after each 2.2 s sweep).
// Hands only turn clockwise; the minute hand adds one full turn. Hover leaves a Blue 60 trail; click or
// Enter/Space jumps to the next scene. Respects prefers-reduced-motion and pauses when off screen.
import * as F from './field.js';

const TZ = 'America/Sao_Paulo';
const LAT = -23.55;
const LON = -46.63;
const IDLE_MS = 1500;
const HOLD_MS = 3000;
const SWEEP_MS = F.DUR + F.STAG;
const TRAIL_MS = 900;
const RETURN_MS = 600;
const WEATHER_REFRESH_MS = 15 * 60 * 1000;
const SCENES = ['weather', 'wind', 'time'];
const POINT_NAMES = { N: 'north', NE: 'northeast', E: 'east', SE: 'southeast', S: 'south', SW: 'southwest', W: 'west', NW: 'northwest' };
const WX_LABEL = { clear: 'clear skies', night: 'a clear night', partly: 'partly cloudy skies', overcast: 'overcast skies', garoa: 'drizzle', rain: 'rain', storm: 'a thunderstorm', fog: 'fog' };

const cl = (v, a, b) => (v < a ? a : v > b ? b : v);
const d2r = Math.PI / 180;

function nowParts() {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
  const h = parts.find((p) => p.type === 'hour').value.replace('24', '00');
  const m = parts.find((p) => p.type === 'minute').value;
  return { hhmm: `${h}:${m}`, hour: +h };
}

function wxFromCode(code, isDay) {
  if (code <= 1) return isDay ? 'clear' : 'night';
  if (code === 2) return 'partly';
  if (code === 3) return 'overcast';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 57) return 'garoa';
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
  if (code >= 95) return 'storm';
  return 'overcast'; // snow (71–77, 85–86) falls back to overcast
}

export function mountClockField(root) {
  const canvas = root.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scheme = window.matchMedia('(prefers-color-scheme: light)');

  const t = nowParts();
  const data = { wx: t.hour >= 6 && t.hour < 18 ? 'partly' : 'night', from: 140, kmh: 12, hhmm: t.hhmm, point: 'SE' };

  let layout = null;
  let clocks = [];
  let scene = 'idle';
  let sceneIdx = -1;
  let timer = 0;
  let raf = 0;
  let visible = true;
  let colors = {};
  let lastCell = null;

  // ---------- colors (Carbon tokens, re-read when the theme changes)
  function readColors() {
    const cs = getComputedStyle(root);
    const v = (name) => cs.getPropertyValue(name).trim();
    colors = {
      dial: v('--cds-layer-01'),
      q: v('--cds-border-subtle-01'),
      s: v('--cds-border-strong-01'),
      g: v('--cds-border-strong-01'),
      p: v('--cds-icon-primary'),
      lit: v('--cds-icon-primary'),
      lits: v('--cds-border-strong-01'),
      trail: v('--cds-background-brand'),
    };
  }

  // ---------- layout: full field (66 × 20) from 1056px; compact field (33 × 11, pitch ≤ 24px) from 672px;
  // tall compact field on phones (33 × 17, e.g. 402 × 208), the same compositions at the full field's proportions
  function computeLayout() {
    const cssW = Math.max(1, Math.round(root.clientWidth));
    let nx, ny, pitch;
    if (cssW >= 1056) { nx = 66; ny = 20; pitch = cssW / 66; }
    else if (cssW >= 672) { ny = 11; pitch = Math.min(24, cssW / 33); nx = Math.max(33, Math.floor(cssW / pitch)); }
    else { nx = 33; ny = 17; pitch = cssW / 33; }
    const k = pitch / 24;
    const cssH = Math.round((ny * 24 + 2) * k);
    const offsetX = (cssW - nx * 24 * k) / 2;
    return { nx, ny, k, cssW, cssH, offsetX, dpr: Math.min(2, window.devicePixelRatio || 1) };
  }

  function sizeCanvas() {
    const { cssW, cssH, dpr } = layout;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    canvas.style.height = `${cssH}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // ---------- scenes
  function build(name) {
    F.setField(layout.nx, layout.ny);
    if (name === 'idle') return F.field(F.IDLE[0], F.IDLE[1], 's');
    return F.state(name, { wx: data.wx, from: data.from, kmh: data.kmh, hhmm: data.hhmm });
  }

  function instantScene(name) {
    const target = build(name);
    clocks = target.map((c) => ({ i: c.i, j: c.j, x: c.x, y: c.y, a1: c.a1, a2: c.a2, ro: c.ro, lit: c.lit || 0, anim: null, ov: null }));
  }

  function sample(c, now) {
    if (c.ov) {
      const age = now - c.ov.born;
      if (age < TRAIL_MS) return { a1: c.ov.a1, a2: c.ov.a2, ro: age < TRAIL_MS * 0.34 ? 't1' : age < TRAIL_MS * 0.67 ? 't2' : 't3', lit: 0 };
      // trail expired: turn clockwise back to the scene
      c.anim = { t0: now, dur: reduce.matches ? 0 : RETURN_MS, f1: c.ov.a1, f2: c.ov.a2, d1: F.cw(c.ov.a1, c.a1), d2: F.cw(c.ov.a2, c.a2), roFrom: 't3', roTo: c.ro, litFrom: 0, litTo: c.lit };
      c.ov = null;
    }
    const a = c.anim;
    if (!a) return c;
    if (now < a.t0) return { a1: a.f1, a2: a.f2, ro: a.roFrom, lit: a.litFrom };
    const p = a.dur ? cl((now - a.t0) / a.dur, 0, 1) : 1;
    if (p >= 1) { c.anim = null; return c; }
    const e = F.EASE(p);
    return { a1: a.f1 + a.d1 * e, a2: a.f2 + a.d2 * e, ro: p < 0.5 ? a.roFrom : a.roTo, lit: p < 0.5 ? a.litFrom : a.litTo };
  }

  function go(name, stagger) {
    const target = build(name);
    const now = performance.now();
    const instant = reduce.matches;
    clocks.forEach((c, k) => {
      const tg = target[k];
      if (!tg) return;
      const cur = sample(c, now);
      c.ov = null;
      if (instant) c.anim = null;
      else {
        const delay = stagger ? stagger(tg) * F.STAG : 0;
        c.anim = { t0: now + delay, dur: F.DUR, f1: cur.a1, f2: cur.a2, d1: F.cw(cur.a1, tg.a1), d2: F.cw(cur.a2, tg.a2) + 360, roFrom: cur.ro, roTo: tg.ro, litFrom: cur.lit || 0, litTo: tg.lit || 0 };
      }
      c.a1 = tg.a1; c.a2 = tg.a2; c.ro = tg.ro; c.lit = tg.lit || 0;
    });
    scene = name;
    updateLabel();
    kick();
  }

  // re-target the current scene (new minute, new weather): only clocks that change move
  function retarget() {
    if (scene === 'idle') return;
    const target = build(scene);
    const now = performance.now();
    clocks.forEach((c, k) => {
      const tg = target[k];
      if (!tg) return;
      const same = Math.abs(((tg.a1 - c.a1) % 360 + 360) % 360) < 0.5 && Math.abs(((tg.a2 - c.a2) % 360 + 360) % 360) < 0.5 && tg.ro === c.ro && (tg.lit || 0) === c.lit;
      if (same) return;
      const cur = sample(c, now);
      c.anim = reduce.matches ? null : { t0: now, dur: F.DUR, f1: cur.a1, f2: cur.a2, d1: F.cw(cur.a1, tg.a1), d2: F.cw(cur.a2, tg.a2), roFrom: cur.ro, roTo: tg.ro, litFrom: cur.lit || 0, litTo: tg.lit || 0 };
      c.a1 = tg.a1; c.a2 = tg.a2; c.ro = tg.ro; c.lit = tg.lit || 0;
    });
    updateLabel();
    kick();
  }

  function defaultStagger(from, to) {
    if (to === 'weather') return from === 'idle' ? F.ltr : F.ttb;
    if (to === 'wind') return F.along(data.from + 90); // the wave travels with the wind
    if (to === 'time') return F.radial(F.X(3), F.Y(3)); // grows out of the compass
    return null;
  }

  function advance(stagger) {
    const from = scene;
    sceneIdx = (sceneIdx + 1) % SCENES.length;
    const to = SCENES[sceneIdx];
    go(to, stagger || defaultStagger(from, to));
    schedule(reduce.matches ? HOLD_MS * 2 : SWEEP_MS + HOLD_MS);
  }

  function schedule(ms) {
    window.clearTimeout(timer);
    if (!visible || document.hidden) return;
    timer = window.setTimeout(() => advance(), ms);
  }

  // ---------- rendering
  function hand(path, x, y, a, len) {
    path.moveTo(x, y);
    path.lineTo(x + len * Math.cos(a * d2r), y + len * Math.sin(a * d2r));
  }

  function draw(now) {
    const { k, offsetX, cssW, cssH } = layout;
    ctx.clearRect(0, 0, cssW, cssH);
    const P = { dial: new Path2D(), lit: new Path2D(), lits: new Path2D(), q: new Path2D(), s: new Path2D(), g: new Path2D(), p: new Path2D(), t1: new Path2D(), t2: new Path2D(), t3: new Path2D() };
    const L = F.L * k;
    const R = F.DR * k;
    let busy = false;
    for (const c of clocks) {
      const st = sample(c, now);
      if (c.anim || c.ov) busy = true;
      const x = offsetX + c.x * k;
      const y = c.y * k;
      const ring = st.lit === 1 ? P.lit : st.lit === 2 ? P.lits : P.dial;
      ring.moveTo(x + R, y);
      ring.arc(x, y, R, 0, Math.PI * 2);
      const path = P[st.ro === '_' ? 'q' : st.ro] || P.s;
      hand(path, x, y, st.a1, L);
      const sp = Math.abs((((st.a2 - st.a1) % 360) + 360) % 360);
      if (sp > 1 && sp < 359) hand(path, x, y, st.a2, L);
    }
    ctx.lineWidth = 1;
    ctx.lineCap = 'butt';
    const stroke = (path, color, alpha = 1) => { ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.stroke(path); };
    stroke(P.dial, colors.dial);
    stroke(P.q, colors.q);
    stroke(P.lits, colors.lits);
    stroke(P.lit, colors.lit);
    stroke(P.s, colors.s);
    stroke(P.g, colors.g);
    stroke(P.p, colors.p);
    stroke(P.t3, colors.trail, 0.3);
    stroke(P.t2, colors.trail, 0.6);
    stroke(P.t1, colors.trail, 1);
    ctx.globalAlpha = 1;
    return busy;
  }

  function frame(now) {
    raf = 0;
    const busy = draw(now);
    if (busy && visible) raf = window.requestAnimationFrame(frame);
  }

  function kick() {
    if (!raf && visible) raf = window.requestAnimationFrame(frame);
  }

  // ---------- accessible description
  function updateLabel() {
    let text = 'Clock field at rest: every clock shows 10:10.';
    if (scene === 'weather') text = `Clock field showing ${WX_LABEL[data.wx] || 'the weather'} in São Paulo.`;
    if (scene === 'wind') text = `Clock field showing wind from the ${POINT_NAMES[data.point] || 'southeast'} at ${Math.round(data.kmh)} km/h in São Paulo.`;
    if (scene === 'time') text = `Clock field showing ${data.hhmm} in São Paulo.`;
    canvas.setAttribute('aria-label', `${text} Press Enter for the next scene.`);
  }

  // ---------- hover trail (Blue 60)
  function cellAt(e) {
    const r = canvas.getBoundingClientRect();
    const px = (e.clientX - r.left - layout.offsetX) / layout.k;
    const py = (e.clientY - r.top) / layout.k;
    return { i: Math.round((px - 12) / 24), j: Math.round((py - 13) / 24), px, py };
  }

  function clockAt(i, j) {
    if (i < 0 || j < 0 || i >= layout.nx || j >= layout.ny) return null;
    return clocks[j * layout.nx + i] || null;
  }

  function addTrail(cell, now) {
    const c = clockAt(cell.i, cell.j);
    if (!c) return;
    const prev = lastCell && clockAt(lastCell.i, lastCell.j);
    const back = lastCell ? Math.atan2(lastCell.j - cell.j, lastCell.i - cell.i) / d2r : 0;
    c.anim = null;
    c.ov = { a1: back, a2: back, born: now };
    if (prev && prev.ov) prev.ov.a2 = Math.atan2(cell.j - lastCell.j, cell.i - lastCell.i) / d2r;
    lastCell = { i: cell.i, j: cell.j };
  }

  function onMove(e) {
    if (reduce.matches || e.pointerType === 'touch') return;
    const cell = cellAt(e);
    if (lastCell && lastCell.i === cell.i && lastCell.j === cell.j) return;
    const now = performance.now();
    if (lastCell) {
      // fill gaps so the trail stays continuous on fast moves
      let { i, j } = lastCell;
      while (Math.max(Math.abs(cell.i - i), Math.abs(cell.j - j)) > 1) {
        i += Math.sign(cell.i - i);
        j += Math.sign(cell.j - j);
        addTrail({ i, j }, now);
      }
    }
    addTrail(cell, now);
    kick();
  }

  function onClick(e) {
    const cell = cellAt(e);
    advance(F.radial(cell.px, cell.py));
  }

  function onKey(e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); advance(null); }
  }

  // ---------- live data: São Paulo time (every 15 s) and weather (Open-Meteo, every 15 min)
  function tickTime() {
    const t = nowParts();
    if (t.hhmm !== data.hhmm) {
      data.hhmm = t.hhmm;
      if (scene === 'time') retarget();
    }
  }

  async function fetchWeather() {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=weather_code,wind_speed_10m,wind_direction_10m,is_day&wind_speed_unit=kmh&timezone=${encodeURIComponent(TZ)}`;
      const res = await fetch(url);
      if (!res.ok) return;
      const json = await res.json();
      const cur = json.current || {};
      data.wx = wxFromCode(cur.weather_code ?? 2, cur.is_day !== 0);
      data.from = Math.round(cur.wind_direction_10m ?? data.from);
      data.kmh = Math.round(cur.wind_speed_10m ?? data.kmh);
      data.point = F.POINTS[Math.round((((data.from % 360) + 360) % 360) / 45) % 8];
      if (scene === 'weather' || scene === 'wind') retarget();
      else updateLabel();
    } catch (_) {
      /* keep the defaults: the field still runs without data */
    }
  }

  // ---------- lifecycle
  function relayout() {
    const next = computeLayout();
    const changed = !layout || next.nx !== layout.nx || next.ny !== layout.ny || Math.abs(next.k - layout.k) > 0.001 || next.dpr !== layout.dpr;
    layout = next;
    if (!changed) return;
    sizeCanvas();
    instantScene(scene);
    draw(performance.now());
  }

  readColors();
  relayout();
  updateLabel();
  draw(performance.now());
  schedule(IDLE_MS);
  fetchWeather();
  window.setInterval(tickTime, 15000);
  window.setInterval(fetchWeather, WEATHER_REFRESH_MS);

  new ResizeObserver(() => relayout()).observe(root);
  new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible) { schedule(HOLD_MS); kick(); } else window.clearTimeout(timer);
  }).observe(root);
  document.addEventListener('visibilitychange', () => { if (document.hidden) window.clearTimeout(timer); else schedule(HOLD_MS); });
  scheme.addEventListener('change', () => { readColors(); draw(performance.now()); });
  // the site switches White / Gray 100 with São Paulo's day and night (data-theme on <html>)
  new MutationObserver(() => { readColors(); draw(performance.now()); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerleave', () => { lastCell = null; });
  canvas.addEventListener('click', onClick);
  canvas.addEventListener('keydown', onKey);
}
