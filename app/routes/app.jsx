import { Outlet, useLoaderData, useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  const apiKey = process.env.SHOPIFY_API_KEY || "";

  const shop = session.shop;

  // 🔥 REDIRECT LOGIC (safe)
  const redirectUrl = `https://yourcompany.com/login?shop=${shop}`;

  return new Response(null, {
    status: 302,
    headers: {
      Location: redirectUrl,
    },
  });
};