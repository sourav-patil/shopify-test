import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import { useEffect } from "react";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  return {
    shop: session.shop,
  };
};

export default function Index() {
  const { shop } = useLoaderData();

  useEffect(() => {
    if (shop) {
      // safe full-page redirect
      window.location.href = `https://app.bolka.ai/login?shop=${shop}&source=shopify`;
    }
  }, [shop]);

  return <p>Redirecting to Bolka AI...</p>;
}