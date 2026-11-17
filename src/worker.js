/**
 * Aminy Phone Repair — Worker entry point (the backend).
 *
 * Static files in public/ are served by Cloudflare before this code runs.
 * Only /api/* requests (see run_worker_first in wrangler.jsonc) and
 * unmatched paths reach here.
 */
import { json } from './http.js';
import { handleContact } from './contact.js';
import { handleAdmin } from './admin.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      try {
        if (url.pathname === '/api/contact') return await handleContact(request, env);
        if (url.pathname === '/api/admin' || url.pathname.startsWith('/api/admin/')) return await handleAdmin(request, env, url);
        return json({ ok: false, error: 'not_found' }, 404);
      } catch (err) {
        console.error('Unhandled API error:', err);
        return json({ ok: false, error: 'server_error' }, 500);
      }
    }

    return env.ASSETS.fetch(request);
  },
};
