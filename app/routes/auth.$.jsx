import { authenticate } from "../shopify.server";

// routes/auth.callback.jsx

export const loader = async ({ request }) => {
  await authenticate.admin(request); // never wrap in try/catch
  return null;
};