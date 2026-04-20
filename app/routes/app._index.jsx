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
  const app = useAppBridge();

  useEffect(() => {
    const redirectUrl = `https://app.bolka.ai/login?shop=${shop}&source=shopify`;
    
    // Method 1 — App Bridge open (correct API)
    app.dispatch({
      type: "APP::NAVIGATION::REDIRECT::REMOTE",
      payload: {
        url: redirectUrl,
        newContext: false,
      },
    });
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