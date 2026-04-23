import { authenticate } from "../shopify.server";
import { Outlet } from "react-router";

export const loader = async ({ request }) => {
  // Just authenticate - this protects ALL child routes
  const { session } = await authenticate.admin(request);
  console.log("APP LOADER HIT - shop:", session.shop);
  return { shop: session.shop };
};

export default function App() {
  return (
    <div>
      {/* Outlet renders the child route (app._index.jsx etc) */}
      <Outlet />
    </div>
  );
}