import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  // This explicitly handles the /auth/callback route
  // exchanges code for token and saves session to Supabase
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  // Server side redirect works perfectly for non-embedded
  return new Response(null, {
    status: 302,
    headers: {
      Location: `https://app.bolka.ai/login?shop=${shop}&source=shopify`,
      "Cache-Control": "no-store",
    },
  });
};