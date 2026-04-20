import { useEffect } from "react";
import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  return { shop: session.shop };
};

export default function Index() {
  const { shop } = useLoaderData();

  useEffect(() => {
    // Client-side redirect breaks out of iframe properly
    window.top.location.href = `https://app.bolka.ai/login?shop=${shop}&source=shopify`;
  }, [shop]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", textAlign: "center" }}>
      <h2>Redirecting to Bolka AI...</h2>
      <p>If you are not redirected automatically,{" "}
        <a href={`https://app.bolka.ai/login?shop=${shop}&source=shopify`}>
          click here
        </a>.
      </p>
    </div>
  );
}