import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  try {
    const { session } = await authenticate.admin(request);

    console.log("SESSION:", session);

    return new Response(
      JSON.stringify({ shop: session.shop }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.log("AUTH FAILED:", error);

    return new Response(
      JSON.stringify({ debug: "Auth failed but reload prevented" }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
};

export default function AppIndex() {
  return <div>Debug Auth Page</div>;
}