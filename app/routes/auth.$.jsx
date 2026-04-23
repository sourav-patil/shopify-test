import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const location = `https://app.bolka.ai/login?shop=${encodeURIComponent(
    session.shop
  )}&source=shopify`;

  return new Response(null, {
    status: 302,
    headers: {
      Location: location,
      "Cache-Control": "no-store",
    },
  });
};

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
