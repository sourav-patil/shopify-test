import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  const shop = session.shop;

  // 🔥 AFTER AUTH SUCCESS → redirect to your SaaS
  return Response.redirect(
    `https://bolka.ai/login?shop=${shop}`,
    302
  );
};