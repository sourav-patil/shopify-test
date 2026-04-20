import { useEffect } from "react";
import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";

export async function loader({ request }) {
  const { session } = await authenticate.admin(request);

  return {
    shop: session.shop,
  };
}

export default function Index() {
  const { shop } = useLoaderData();
  const app = useAppBridge();

  useEffect(() => {
    if (!shop || !app) return;

    const redirectUrl = `https://app.bolka.ai/login?shop=${shop}&source=shopify`;

    const redirect = Redirect.create(app);
    // REMOTE means navigate the browser to an external URL (outside Shopify admin)
    redirect.dispatch(Redirect.Action.REMOTE, redirectUrl);
  }, [shop, app]);

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