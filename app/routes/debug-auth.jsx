import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  try {
    const { session } = await authenticate.admin(request);

    console.log("AUTH SUCCESS");
    console.log("SHOP:", session.shop);
    console.log("TOKEN:", session.accessToken);
    console.log("SESSION FULL:", session);

    return json({
      auth: true,
      shop: session.shop,
      tokenExists: !!session.accessToken,
      session,
    });
  } catch (error) {
    console.log("AUTH FAILED");
    console.log(error);

    return json({
      auth: false,
      error: error.message,
    });
  }
};

export default function DebugAuth() {
  return <div>Check server logs for auth result</div>;
}