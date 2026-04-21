import { redirect } from "react-router"
import shopify from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await shopify.auth.callback({ request });

  // session.shop → store domain
  const shop = session.shop;

  // redirect to your SaaS login page
  return redirect(`https://bolka.ai/login?shop=${shop}`);
};