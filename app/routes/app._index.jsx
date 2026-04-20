import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  return new Response(null, {
    status: 302,
    headers: {
      Location: `https://app.bolka.ai/login?shop=${shop}&source=shopify`,
      "Cache-Control": "no-store",
    },
  });
};

export default function Index() {
  return (
    <div style={{ padding: "40px", fontFamily: "Arial", textAlign: "center" }}>
      <h2>Redirecting to Bolka AI...</h2>
    </div>
  );
}