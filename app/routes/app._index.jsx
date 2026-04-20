import { useEffect } from "react";
import { useLoaderData } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  return { shop: session.shop };
};

export default function Index() {
  const { shop } = useLoaderData();
  const shopify = useAppBridge();

  useEffect(() => {
    shopify.navigate(
      `https://app.bolka.ai/login?shop=${shop}&source=shopify`
    );
  }, [shop]);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial", textAlign: "center" }}>
      <h2>Redirecting to Bolka AI...</h2>
      <p>
        If not redirected,{" "}
        <a href={`https://app.bolka.ai/login?shop=${shop}&source=shopify`}>
          click here
        </a>.
      </p>
    </div>
  );
}