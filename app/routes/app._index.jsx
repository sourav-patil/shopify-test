import { useEffect } from "react";
import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";

export async function loader({ request }) {
  const { session } = await authenticate.admin(request);

  return {
    shop: session.shop,
  };
}

export default function Index() {
  const { shop } = useLoaderData();

  useEffect(() => {
    const redirectUrl = `https://app.bolka.ai/login?shop=${shop}&source=shopify`;
    window.location.href = redirectUrl;
  }, [shop]);

  return (
    <div style={{ padding: 24, textAlign: "center", fontFamily: "Arial" }}>
      <h2>Redirecting to Bolka AI...</h2>
      <p>Please wait while we connect your store.</p>
    </div>
  );
}

export function headers(headersArgs) {
  return boundary.headers(headersArgs);
}