import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
let cached: Promise<Buffer> | undefined;

async function response(request: Request, head = false) {
  const bytes = await (cached ??= readFile(path.join(process.cwd(), 'public', 'home-modelo01-drone-v2.mp4')).catch(error => { cached = undefined; throw error; }));
  const headers = new Headers({
    'Content-Type': 'video/mp4',
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'public, max-age=86400, no-transform',
    'X-Content-Type-Options': 'nosniff',
  });
  const range = head ? null : request.headers.get('range');
  if (!range) {
    headers.set('Content-Length', String(bytes.length));
    return new Response(head ? null : new Uint8Array(bytes), { headers });
  }
  const match = /^bytes=(\d*)-(\d*)$/.exec(range);
  const invalid = () => { headers.set('Content-Range', `bytes */${bytes.length}`); return new Response(null, { status: 416, headers }); };
  if (!match || (!match[1] && !match[2])) return invalid();
  const suffix = !match[1];
  const start = suffix ? Math.max(0, bytes.length - Number(match[2])) : Number(match[1]);
  const end = suffix || !match[2] ? bytes.length - 1 : Math.min(Number(match[2]), bytes.length - 1);
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= bytes.length || (suffix && Number(match[2]) <= 0)) return invalid();
  headers.set('Content-Range', `bytes ${start}-${end}/${bytes.length}`);
  headers.set('Content-Length', String(end - start + 1));
  return new Response(new Uint8Array(bytes.subarray(start, end + 1)), { status: 206, headers });
}
export function GET(request: Request) { return response(request); }
export function HEAD(request: Request) { return response(request, true); }
