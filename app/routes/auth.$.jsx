// app/routes/auth.$.jsx - correct for non-embedded
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};