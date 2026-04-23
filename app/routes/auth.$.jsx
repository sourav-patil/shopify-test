export const loader = async ({ request }) => {
  console.log("AUTH ROUTE HIT");

  const { session } = await authenticate.admin(request);

  console.log("SESSION CREATED:", session.shop);

  return new Response("done");
};