// app/routes/test-shop-data.jsx (or wherever your routes live)
import { shopify } from "../shopify.server";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  if (!shop) {
    return new Response("Missing ?shop= param", { status: 400 });
  }

  try {
    // Reuse the stored offline session
    const storedSession = await prisma.session.findFirst({
      where: { shop, isOnline: false },
    });

    if (!storedSession) {
      return new Response("No session found for shop", { status: 404 });
    }

    const session = {
      shop: storedSession.shop,
      accessToken: storedSession.accessToken,
    };
    const client = new shopify.clients.Graphql({ session });

    const response = await client.request(`
      query {
        shop {
          email
          contactEmail
          shopOwnerName
        }
      }
    `);

    console.log("Shop data from Admin API:", JSON.stringify(response.data, null, 2));

    return new Response(JSON.stringify(response.data, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Test route error:", error);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
};