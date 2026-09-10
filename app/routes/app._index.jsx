import { useEffect } from "react";
import { useLoaderData } from "react-router";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  if (!shop) {
    // No shop param — just show generic page
    return { shop: null };
  }

  return { shop };
};

export default function Index() {
  const { shop } = useLoaderData();

  const redirectUrl = shop
    ? `https://app.bolka.ai/login?shop=${shop}&source=shopify`
    : `https://app.bolka.ai`;

  useEffect(() => {
    // ✅ _top escapes Shopify iframe completely
    if (typeof window !== "undefined") {
      window.top.location.href = redirectUrl;
    }
  }, [redirectUrl]);

  return (
    <div style={{
      padding: "40px",
      fontFamily: "Arial",
      textAlign: "center",
      marginTop: "100px"
    }}>
      <h2>Redirecting to Bolka AI...</h2>
      <p style={{ color: "#666", marginTop: "16px" }}>
        If you are not redirected automatically,{" "}
        <a href={redirectUrl} target="_top" style={{ color: "#008060" }}>
          click here
        </a>
      </p>
    </div>
  );
}