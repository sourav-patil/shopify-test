import { shopify } from "../shopify.server";
import prisma from "../db.server";

// Add these two to your .env file:
// PARTNER_API_TOKEN=your_partner_api_access_token
// PARTNER_ORG_ID=your_numeric_organization_id
// Replace this with your app's numeric App ID from the Partner Dashboard URL
const APP_GID = process.env.APP_GID;

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const planHandle = url.searchParams.get("plan_handle");

  if (!shop) {
    return new Response("Missing shop", { status: 400 });
  }

  try {
    // 1. Load this shop's stored offline session (saved during OAuth)
    const storedSession = await prisma.session.findFirst({
      where: { shop, isOnline: false },
    });
    // console.log("Stored session:", storedSession);

    if (!storedSession) { 
      return new Response("No session found for shop", { status: 404 });
    }

    // 2a. Get the shop's GID via the Admin API (this call is fine, not billing-related)
    const session = { shop: storedSession.shop, accessToken: storedSession.accessToken };
    const client = new shopify.clients.Graphql({ session });

    const shopResponse = await client.request(`
      query {
        shop {
          id
        }
      }
    `);
    const shopGid = shopResponse.data.shop.id;
console.log("Shop GID:", shopGid);
    // 2b. Verify the subscription via the Partner API (the correct source of truth
    // for Shopify App Pricing — the Admin API's activeSubscriptions is NOT used here)
    const partnerResponse = await fetch(
      `https://partners.shopify.com/${process.env.PARTNER_ORG_ID}/api/2026-07/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": process.env.PARTNER_API_TOKEN,
        },
        body: JSON.stringify({
          query: `
            query ActiveSubscription($appId: ID!, $shopId: ID!) {
              activeSubscription(appId: $appId, shopId: $shopId) {
                billingPeriod
                trialEndsAt
                items {
                  handle
                }
              }
            }
          `,
          variables: { appId: APP_GID, shopId: shopGid },
        }),
      }
    );

    // const partnerData = await partnerResponse.json();

    // if (partnerData.errors) {
    //   console.error("Partner API errors:", JSON.stringify(partnerData.errors, null, 2));
    //   throw new Error("Partner API request failed");
    // }

    // const activeSub = partnerData.data.activeSubscription;
    // const confirmedPlan = activeSub ? activeSub.items[0]?.handle : "free";
    const partnerData = await partnerResponse.json();

if (partnerData.errors) {
  console.error(
    "Partner API errors:",
    JSON.stringify(partnerData.errors, null, 2)
  );

  return new Response(
    JSON.stringify(partnerData.errors, null, 2),
    {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

const activeSub = partnerData.data.activeSubscription;
const confirmedPlan = activeSub ? activeSub.items[0]?.handle : "free";

    // 3. Save into Bolka AI's shared DB
    await prisma.shopifySubscription.upsert({
      where: { shop },
      update: {
        plan: confirmedPlan,
        active: !!activeSub,
        status: activeSub ? "ACTIVE" : "NONE",
      },
      create: {
        shop,
        plan: confirmedPlan,
        active: !!activeSub,
        status: activeSub ? "ACTIVE" : "NONE",
      },
    });

    // 4. Call Bolka AI's API to get credentials — PLACEHOLDER, see below
    // const credResponse = await fetch("https://app.bolka.ai/api/create-paid-user", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ shop, plan: confirmedPlan }),
    // });
    // const credentials = await credResponse.json();

    // 5. Redirect to Bolka AI, passing along whatever it needs
    return Response.redirect(`https://app.bolka.ai/login?shop=${shop}`, 302);

  } catch (error) {
    console.error("Plan-selected route error:", error);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
};