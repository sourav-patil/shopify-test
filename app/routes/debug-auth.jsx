import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  try {
    const { session } = await authenticate.admin(request);

    console.log("AUTH SUCCESS");
    console.log("SHOP:", session.shop);
    console.log("TOKEN:", session.accessToken);

    return Response.json({
      auth: true,
      shop: session.shop,
      token: !!session.accessToken,
    });
  } catch (error) {
    console.log("AUTH FAILED", error);

    return Response.json({
      auth: false,
      error: error.message,
         errorName: error.name,
      errorStack: error.stack?.split('\n').slice(0,5),  // first 5 lines
    });
  }
};

export default function DebugAuth() {
  return <div>Check server logs</div>;
}