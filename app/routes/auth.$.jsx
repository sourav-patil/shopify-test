import { redirect } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  const redirectUrl = `https://app.bolka.ai/login?shop=${encodeURIComponent(
    session.shop
  )}&source=shopify`;

  return redirect(redirectUrl);
};

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};