import { redirect } from "react-router"; // ⬅️ if this import fails, see note below
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  // 1. Finish Shopify authentication, get session
  const { session } = await authenticate.admin(request);

  // 2. Get the shop domain from the session
  const shop = session.shop; // e.g. "my-store.myshopify.com"

  // 3. Build your external redirect URL
  const redirectUrl = `https://app.bolka.ai/login?shop=${shop}&source=shopify`;

  // 4. Redirect merchant to your website
  return redirect(redirectUrl);
};

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};