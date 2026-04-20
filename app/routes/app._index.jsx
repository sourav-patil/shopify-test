import { redirect } from "react-router";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  // authenticate.admin will throw a redirect Response if auth is needed
  // If it returns, session is valid
  const { session } = await authenticate.admin(request);

  const shop = session.shop;

  return redirect(
    `https://app.bolka.ai/login?shop=${shop}&source=shopify`
  );
};

export default function Index() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Redirecting to Bolka AI...</h2>
      <p>If you are not redirected automatically, please wait.</p>
    </div>
  );
}

// Remove boundary.headers for non-embedded apps