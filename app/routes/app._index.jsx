import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  console.log("📦 APP LOADER HIT");
  
  const { session } = await authenticate.admin(request);
  
  console.log("🟢 SESSION:", session.shop);
  
  return {
    shop: session.shop,
    token: session.accessToken ? true : false,
  };
};

export default function Index() {
  const data = useLoaderData();
  return (
    <div style={{ padding: 20 }}>
      <h2>🧪 Auth Debug Screen</h2>
      <p>Shop: {data.shop}</p>
      <p>Access Token: {data.token ? "YES" : "NO"}</p>
    </div>
  );
}