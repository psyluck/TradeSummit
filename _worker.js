// Cloudflare Pages Function (advanced mode) in front of the static landing.
//
// The site is a fixed set of static files, so anything that looks like a
// scanner probe (dotfiles, VCS metadata, config/admin/telemetry paths) is
// refused at the edge with 403 instead of falling through to the asset server.
// The origin nginx config applies the same rules for the app host.
//
// Keep this list in step with the block in app/deploy/nginx/nginx.conf.

const SENSITIVE_PREFIXES = [
  "/config",
  "/configuration",
  "/settings",
  "/env",
  "/debug",
  "/metrics",
  "/admin",
  "/administrator",
  "/actuator",
  "/swagger",
  "/telescope",
  "/server-status",
  "/server-info",
  "/phpinfo",
  "/phpmyadmin",
  "/wp-admin",
  "/wp-login",
];

// Versioned API surfaces are not routes this site serves either:
// /api/config, /api/v1/config, /api/v2/settings, /internal/config, ...
const SENSITIVE_API_RE =
  /^\/(?:api|internal)\/(?:v[0-9]+\/)?(?:config|configuration|settings|env|debug|admin)(?:\/|\.|$)/;

function isBlocked(pathname) {
  let decoded = pathname;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    // A malformed escape is not a path this site serves; fall through to the
    // decoded-as-sent form rather than throwing.
  }
  const path = decoded.toLowerCase();

  // RFC 8615 reserved namespace: `security.txt`, ACME challenges, and the
  // like are public by design, so it is the one dot-segment that is not a
  // probe.
  if (path === "/.well-known" || path.startsWith("/.well-known/")) {
    return false;
  }

  // Any other dot-prefixed segment: /.env, /.env.local, /.git/config, /.aws/...
  if (path.split("/").some((segment) => segment.startsWith("."))) {
    return true;
  }

  if (SENSITIVE_API_RE.test(path)) {
    return true;
  }

  return SENSITIVE_PREFIXES.some(
    (prefix) =>
      path === prefix ||
      path.startsWith(`${prefix}/`) ||
      path.startsWith(`${prefix}.`),
  );
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (isBlocked(url.pathname)) {
      return new Response("Forbidden", { status: 403 });
    }
    return env.ASSETS.fetch(request);
  },
};
