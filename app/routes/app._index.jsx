import { redirect } from "react-router";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";

export const loader = async ({ request }) => {
  // Verify Shopify session
  const { session } = await authenticate.admin(request);

  const shop = session.shop;

  // Redirect merchant to Bolka dashboard
  return redirect(
    `https://app.bolka.ai/login?shop=${shop}&source=shopify`
  );
};

// Optional fallback UI (rarely shown)
export default function Index() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Redirecting to Bolka AI...</h2>
      <p>If you are not redirected automatically, please wait.</p>
    </div>
  );
};

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};