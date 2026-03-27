// Worker entry point - routes /api/* to the functions handler, serves static for everything else
// This is only used for wrangler deploy (Workers mode), not Pages mode

export { onRequest as onRequestApi } from "./functions/api/[[route]]";
export { onRequest as onRequestMcp } from "./functions/mcp/index";

export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    const url = new URL(request.url);
    
    // Create a context-like object matching Pages EventContext
    const context = {
      request,
      env,
      params: {},
      waitUntil: ctx.waitUntil.bind(ctx),
      passThroughOnException: () => {},
      next: async () => new Response("Not Found", { status: 404 }),
      data: {},
      functionPath: url.pathname,
    };

    // Route /api/* to the API handler
    if (url.pathname.startsWith("/api/")) {
      const { onRequest } = await import("./functions/api/[[route]]");
      return onRequest(context as any);
    }
    
    // Route /mcp/* to the MCP handler  
    if (url.pathname.startsWith("/mcp")) {
      const { onRequest } = await import("./functions/mcp/index");
      return onRequest(context as any);
    }

    // Everything else falls through to static assets (handled by [assets])
    return new Response("Not Found", { status: 404 });
  },
};
