export const loader = async ({ request }) => {
  console.log("APP LOADED", request.url);

  return new Response("Debug Mode");
};