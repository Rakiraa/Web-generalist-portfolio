import { json } from '../data/profile';

// The profile as structured data.
export const GET = () => new Response(JSON.stringify(json(), null, 2) + '\n', { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
