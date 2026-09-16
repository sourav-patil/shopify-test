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
 if (params["*"] === "callback") {
    try {
      const { session } = await shopify.auth.callback({ rawRequest: request });

      // Build Shopify's hosted pricing page URL
      const storeHandle = session.shop.replace(".myshopify.com", "");
      const appHandle = "bolka-ai"; // <-- from shopify.app.toml

      const pricingUrl = `https://admin.shopify.com/store/${storeHandle}/charges/${appHandle}/pricing_plans`;

      return Response.redirect(pricingUrl, 302);

    } catch (error) {
      console.error("Auth callback error:", error);
      return new Response(`Auth failed: ${error.message}`, { status: 500 });
    }
  }

  return new Response("Route not found", { status: 404 });
};


