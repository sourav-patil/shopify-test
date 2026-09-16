import { shopify } from "../shopify.server";

export const loader = async ({ request, params }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  // ==========================================
  // START AUTHENTICATION FLOW
  // ==========================================
  if (params["*"] === "login") {
    if (!shop) {
      return new Response("Shop parameter missing", { status: 400 });
    }

    try {
      // auth.begin() returns a native Web API Response object directly
      const response = await shopify.auth.begin({
        shop,
        callbackPath: "/auth/callback",
        isOnline: false,
        rawRequest: request,
      });

      return response; 
    } catch (error) {
      console.error("Auth begin error:", error);
      return new Response(`Auth begin failed: ${error.message}`, { status: 500 });
    }
  }

  // ==========================================
  // OAUTH CALLBACK PROCESSING
  // ==========================================
  if (params["*"] === "callback") {
    try {
      // ✅ CRITICAL FIX: Pass 'expiring: true' directly into the modern web-api callback method
      // This explicitly maps to 'expiring=1' on Shopify's OAuth POST body payload.
      const { session } = await shopify.auth.callback({
        rawRequest: request,
        expiring: true, 
      });

      console.log("---------------- OAUTH SUCCESS ----------------");
      console.log("Shop Context:", session.shop);
      console.log("Generated Session ID:", session.id);
      console.log("Access Token Structure:", session.accessToken ? "PRESENT" : "MISSING");
      console.log("Short-Lived Expiry Timestamp:", session.expires ? session.expires : "⚠️ NON-EXPIRING FORMAT!");
      console.log("Refresh Token Structure:", session.refreshToken ? "PRESENT" : "⚠️ MISSING (REQUIRED FOR REFRESH)");
      console.log("-----------------------------------------------");

      // Stop the flow immediately if the server didn't grant an expiring token layout
      if (!session.refreshToken) {
        throw new Error("Shopify returned a legacy non-expiring token layout instead of an offline short-lived token.");
      }

      // Explicitly commit the new credential structure to Prisma Session Storage
      try {
        const stored = await shopify.config.sessionStorage.storeSession(session);
        console.log("✅ storeSession database write result:", stored);
      } catch (dbError) {
        console.error("❌ storeSession database engine execution FAILED:", dbError.message);
        return new Response(`Session storage write failure: ${dbError.message}`, { status: 500 });
      }

      // Verify the storage engine committed the entry successfully
      const savedSession = await shopify.config.sessionStorage.loadSession(session.id);
      if (savedSession) {
        console.log("✅ Verification Check: Session successfully confirmed in Prisma.");
      } else {
        console.error("❌ Verification Check Error: Session record missing from storage engine following execution.");
      }

      return Response.redirect(
        `https://bolka.ai{session.shop}`,
        302
      );

    } catch (error) {
      console.error("Auth callback system mapping error:", error);
      return new Response(`Auth verification processing failed: ${error.message}`, { status: 500 });
    }
  }

  return new Response("Route endpoint mapping configuration not found", { status: 404 });
};
