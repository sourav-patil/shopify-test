import { useEffect } from "react";
import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  return Response.json({ shop: session.shop });
};

export default function Index() {
  const { shop } = useLoaderData();
  const url = `https://app.bolka.ai/login?shop=${shop}&source=shopify`;

  useEffect(() => {
    window.top.location.href = url;
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial", textAlign: "center" }}>
      <h2>Redirecting to Bolka AI...</h2>
      <p>
        If not redirected, <a href={url}>click here</a>.
      </p>
    </div>
  );
}