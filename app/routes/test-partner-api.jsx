const APP_GID = process.env.APP_GID;

export const loader = async () => {
  try {
    // Hardcoded Shop GID for testing
    const shopGid = "gid://shopify/Shop/79336538270";

    const partnerOrgId = process.env.PARTNER_ORG_ID;
    const partnerApiToken = process.env.PARTNER_API_TOKEN;

    if (!partnerOrgId) {
      return Response.json(
        {
          success: false,
          message: "PARTNER_ORG_ID is missing",
        },
        { status: 500 }
      );
    }

    if (!partnerApiToken) {
      return Response.json(
        {
          success: false,
          message: "PARTNER_API_TOKEN is missing",
        },
        { status: 500 }
      );
    }

    if (!APP_GID) {
      return Response.json(
        {
          success: false,
          message: "APP_GID is missing",
        },
        { status: 500 }
      );
    }

    const url = `https://partners.shopify.com/${partnerOrgId}/api/2026-07/graphql.json`;

    console.log("Partner API URL:", url);
    console.log("App GID:", APP_GID);
    console.log("Shop GID:", shopGid);
    console.log("Partner token exists:", !!partnerApiToken);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": partnerApiToken,
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
        variables: {
          appId: APP_GID,
          shopId: shopGid,
        },
      }),
    });

    const partnerData = await response.json();

    console.log("Partner API status:", response.status);
    console.log(
      "Partner API response:",
      JSON.stringify(partnerData, null, 2)
    );

    return Response.json({
      success: response.ok,
      status: response.status,
      data: partnerData,
    });
  } catch (error) {
    console.error("Partner API error:", error);

    return Response.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};