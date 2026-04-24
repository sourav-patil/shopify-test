import { shopify } from "../shopify.server";

export const loader = async ({ request, params }) => {

  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  // START AUTH
  if (params["*"] === "login") {

    if (!shop) {
      return new Response("Shop parameter missing", { status: 400 });
    }

    const authRoute = await shopify.auth.begin({
      shop,
      callbackPath: "/auth/callback",
      isOnline: false,
    });

    return Response.redirect(authRoute);
  }

  // CALLBACK
  if (params["*"] === "callback") {

    try {
      const { session } = await shopify.auth.callback({
        rawRequest: request,
      });

      console.log("Auth success:", session.shop);

      // Redirect to your company website
      return Response.redirect(
        `https://app.bolka.ai/login?shop=${session.shop}`
      );

    } catch (error) {
      console.error("Auth error:", error);
      return new Response("Auth failed", { status: 500 });
    }
  }

  return new Response("Route not found", { status: 404 });
};