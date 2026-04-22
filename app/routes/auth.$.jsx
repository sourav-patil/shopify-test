import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  console.log("🚀 AUTH START");

  const result = await authenticate.admin(request);

  console.log("✅ AUTH SUCCESS");
  console.log("SESSION:", result.session);

  return {
    shop: result.session.shop,
    accessToken: result.session.accessToken ? "EXISTS" : "MISSING",
  };
};