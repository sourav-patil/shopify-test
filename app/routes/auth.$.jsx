// auth.$.jsx - handles ALL /auth/* routes
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  console.log("AUTH.$ HIT:", request.url);
  await authenticate.admin(request);
  return null;
};