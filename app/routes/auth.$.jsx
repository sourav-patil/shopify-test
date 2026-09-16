import { shopify } from "../shopify.server";

export const loader = async ({ request, params }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  // START AUTH
  if (params["*"] === "login") {
    if (!shop) {
      return new Response("Shop parameter missing", { status: 400 });
    }

    try {
      // With web-api adapter, auth.begin() returns a Response directly
      const response = await shopify.auth.begin({
        shop,
        callbackPath: "/auth/callback",
        isOnline: false,
        rawRequest: request,
      });

      // ✅ Just return it — it's already a redirect Response
      return response; 

    } catch (error) {
      console.error("Auth begin error:", error);
      return new Response(`Auth begin failed: ${error.message}`, { status: 500 });
    }
  }

  // CALLBACK
// CALLBACK BLOCK INSIDE YOUR ROUTE LOADER
if (params["*"] === "callback") {
  try {
    // Clean up the extraction payload config
    const { session } = await shopify.auth.callback({
      rawRequest: request,
    });

    console.log("Auth success for store:", session.shop);
    console.log("Token Lifespan (Expires):", session.expires); // 📅 Should log 1 hour from now
    console.log("Refresh Token Status:", session.refreshToken ? "EXISTS" : "MISSING"); // 🔑 Should log EXISTS

    // Manually store session to your Prisma Database
    try {
      await shopify.config.sessionStorage.storeSession(session);
      console.log("✅ storeSession updated successfully.");
    } catch (dbError) {
      console.error("❌ storeSession database layout mismatch:", dbError.message);
      return new Response("Database write failed during token exchange", { status: 500 });
    }

    return Response.redirect(
      `https://bolka.ai{session.shop}`,
      302
    );

  } catch (error) {
    console.error("Auth callback verification error:", error);
    return new Response(`Auth failed: ${error.message}`, { status: 500 });
  }
}

  return new Response("Route not found", { status: 404 });
};


