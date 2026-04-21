import { redirect } from "react-router";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  const url = `https://app.bolka.ai/login?shop=${session.shop}&source=shopify`;

  return redirect(url, {
    headers: {
      "X-Shopify-API-Request-Failure-Reauthorize": "1",
    },
  });
};