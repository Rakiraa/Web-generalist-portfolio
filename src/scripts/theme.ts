// Day and night theme on São Paulo time, driven by the navbar clock's period:
// sunrise and morning (5:00–17:59, "Good morning" / "Good afternoon") → White;
// sunset and night (18:00–4:59, "Good evening" / "Good night") → Gray 100.
// The inline script in Base.astro applies the same rule before the first paint.

export type Theme = 'white' | 'g100';

const THEME_COLOR: Record<Theme, string> = { white: '#ffffff', g100: '#161616' };

export const themeForPeriod = (period: string): Theme => (period === 'sunrise' || period === 'morning' ? 'white' : 'g100');

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (root.dataset.theme !== theme) root.dataset.theme = theme;
  root.style.colorScheme = theme === 'white' ? 'light' : 'dark';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
}
