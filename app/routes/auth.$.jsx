import { authenticate } from "../shopify.server";

// routes/auth.$.jsx  - add logging
export const loader = async ({ request }) => {
  console.log("AUTH ROUTE HIT:", request.url);
  try {
    await authenticate.admin(request);
  } catch (error) {
    console.log("AUTH ERROR:", error.message);
    throw error;
  }
};