import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  console.log("CALLBACK ROUTE HIT:", request.url);
  try {
    await authenticate.admin(request);
    console.log("CALLBACK AUTH SUCCESS");
    return null;
  } catch (error) {
    console.log("CALLBACK ERROR:", error.message, error.stack);
    throw error;
  }
};