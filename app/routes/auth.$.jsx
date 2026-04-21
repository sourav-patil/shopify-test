import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  try {
    console.log("AUTH HIT:", request.url);

    const { session } = await authenticate.admin(request);

    console.log("SESSION SAVED:", session.shop);

    return new Response(null, {
      status: 302,
      headers: {
        Location: `https://app.bolka.ai/login?shop=${session.shop}&source=shopify`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error("AUTH ERROR:", error.message);
    throw error;
  }
};