import { markdown } from '../data/profile';

// Same file as /llms.txt, under my name.
export const GET = () => new Response(markdown(), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
