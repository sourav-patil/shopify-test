import { redirect } from "react-router";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  if (!shop) {
    return new Response("Shop parameter missing", { status: 400 });
  }

  return redirect(`/auth/login?shop=${shop}`);
};