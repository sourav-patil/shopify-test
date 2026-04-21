import { redirect } from "react-router";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  const redirectUrl = `https://app.bolka.ai/login?shop=${session.shop}&source=shopify`;

  return redirect(redirectUrl);
};

export default function Index() {
  return null;
}