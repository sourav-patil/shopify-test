import { useEffect } from "react";
import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  return { shop: session.shop };
};

export default function Index() {
  const { shop } = useLoaderData();
  const redirectUrl = `https://app.bolka.ai/login?shop=${shop}&source=shopify`;

  useEffect(() => {
    // Try parent window first (escapes iframe)
    try {
      window.top.location.href = redirectUrl;
    } catch {
      // Fallback if cross-origin blocks it
      window.location.href = redirectUrl;
    }
  }, [shop]);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial", textAlign: "center" }}>
      <h2>Redirecting to Bolka AI...</h2>
      <p>
        If not redirected,{" "}
        <a href={redirectUrl} target="_top">
          click here
        </a>.
      </p>
    </div>
  );
}