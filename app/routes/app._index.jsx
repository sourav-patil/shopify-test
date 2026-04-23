import { useLoaderData } from "react-router";
import { redirect } from "react-router";

export const loader = async ({ request }) => {
  // Session already verified by app.jsx parent
  // Just do page-specific logic here
  
  // Since you want to redirect to bolka.ai after install:
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  
  return redirect(`https://bolka.ai/login?shop=${shop}`);
};

export default function Index() {
  return <div>Redirecting to Bolka...</div>;
}