import { LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";

// Handles /auth and /auth/callback routes
export const loader = async ({ request }) => {
  return authenticate.admin(request);
};