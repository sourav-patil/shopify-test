import { authenticate } from "../shopify.server";
import { Outlet } from "react-router";

export const loader = async ({ request }) => {
  console.log("APP.JSX LOADER HIT");
  await authenticate.admin(request);
  return null;
};

export default function App() {
  return <Outlet />;  // ← this is critical
}