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
    // _top replaces entire browser tab, escapes iframe completely
    window.open(redirectUrl, "_top");
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