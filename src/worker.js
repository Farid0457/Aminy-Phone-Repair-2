/**
 * Aminy Phone Repair — Worker entry point.
 *
 * Static files in public/ are served by Cloudflare before this code runs.
 * Only /api/* requests (see run_worker_first in wrangler.jsonc) and
 * unmatched paths reach here.
 */

export function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...headers,
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      // Routes are added in Phase 2 (POST /api/contact).
      return json({ ok: false, error: 'not_found' }, 404);
    }

    return env.ASSETS.fetch(request);
  },
};
