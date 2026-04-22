import { json } from "react-router";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  try {
    const { session } = await authenticate.admin(request);

    console.log("SESSION:", session);

    return json({ shop: session.shop });
  } catch (error) {
    console.log("AUTH FAILED:", error);

    return json({
      debug: "Auth failed but reload prevented",
    });
  }
};

export default function AppIndex() {
  return <div>Debug Auth Page</div>;
}