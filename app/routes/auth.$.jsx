import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  // This triggers Shopify OAuth and stores session using PrismaSessionStorage
  const { session } = await authenticate.admin(request);

  console.log("Shop authenticated:", session.shop);
  console.log("Access token saved:", session.accessToken);

  // Temporary response so you can confirm authentication worked
  return new Response(
    JSON.stringify({
      message: "Authentication successful",
      shop: session.shop,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};