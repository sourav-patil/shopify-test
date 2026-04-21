import { unauthenticated } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await unauthenticated.auth.callback(request);

  const shop = session.shop;

  return new Response(
    `<script>
      window.top.location.href = "https://bolka.ai/login?shop=${shop}";
    </script>`,
    {
      headers: { "Content-Type": "text/html" },
    }
  );
};