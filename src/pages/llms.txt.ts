import { markdown } from '../data/profile';

// The short profile for AI agents (llmstxt.org convention).
export const GET = () => new Response(markdown(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
