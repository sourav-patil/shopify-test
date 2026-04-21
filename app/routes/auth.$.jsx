import { LoaderFunctionArgs } from "react-router"; // if you use TypeScript; otherwise you can omit this
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request } /*: LoaderFunctionArgs */) => {
  // 1. Finish Shopify auth and get session + redirect helper
  const { session, redirect } = await authenticate.admin(request);

  // 2. Build your external URL
  const redirectUrl = `https://app.bolka.ai/login?shop=${encodeURIComponent(
    session.shop
  )}&source=shopify`;

  // 3. Use the redirect helper to send merchant to your website
  return redirect(redirectUrl);
};

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};