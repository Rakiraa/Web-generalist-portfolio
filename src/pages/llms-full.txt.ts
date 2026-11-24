import { markdown } from '../data/profile';

// Everything in one file: biography, every role described, expertise.
export const GET = () => new Response(markdown(true), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
