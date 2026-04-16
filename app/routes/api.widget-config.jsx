export const loader = async ({ request }) => {
  
  const response = await fetch(
    'https://api.bolka.ai/api/v1/integrations/shopify-widget-script',
    {
      headers: { "accept": "application/json" }
    }
  );

  const config = await response.json();

  return new Response(JSON.stringify(config), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"  
    }
  });
};