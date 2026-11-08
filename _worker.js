export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    // Block sensitive dotfiles and VCS metadata at the edge.
    if (path === "/.env" || path.startsWith("/.env.") || path.startsWith("/.git") || /\/\./.test(path.split("/").pop() || "")) {
      return new Response("Forbidden", { status: 403 });
    }
    return env.ASSETS.fetch(request);
  },
};
