import prisma from "../db.server";
import { shopify } from "../shopify.server";

export const loader = async () => {
  try {
    const shop = "bolka-ai.myshopify.com";

    // 1. Get the unified offline Session ID string from Shopify's helper
    const offlineSessionId = shopify.session.getOfflineId(shop);

    // 2. Load the session via Shopify storage adapter (forces refresh token logic if needed)
    let session = await shopify.config.sessionStorage.loadSession(offlineSessionId);

    if (!session) {
      return Response.json(
        { success: false, message: `No offline session found for shop: ${shop}` },
        { status: 404 }
      );
    }

    // 3. Proactively check if the access token has expired and trigger a refresh
    if (session.expires && new Date(session.expires) <= new Date()) {
      console.log("Token expired. Attempting token refresh via Shopify API...");
      
      try {
        // This exchanges the refresh_token for a brand new short-lived accessToken
        const refreshResponse = await shopify.auth.refresh({ session });
        session = refreshResponse.session;
        
        // Save the freshly minted credentials back to your Prisma Database
        await shopify.config.sessionStorage.storeSession(session);
        console.log("✅ Token successfully refreshed and updated in Prisma.");
      } catch (refreshError) {
        console.error("❌ Failed to automatically refresh access token:", refreshError);
        return Response.json(
          { success: false, message: "Token expired and refresh failed. Re-authentication required." },
          { status: 401 }
        );
      }
    }

    console.log("Shop:", session.shop);
    console.log("Access token format validated:", !!session.accessToken);

    // 4. Execute the Direct Shopify Admin GraphQL request with your valid/refreshed token
    const response = await fetch(
      `https://${session.shop}/admin/api/2026-07/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": session.accessToken,
        },
        body: JSON.stringify({
          query: `
            query {
              shop {
                id
              }
            }
          `,
        }),
      }
    );

    const data = await response.json();

    console.log("Admin API status:", response.status);
    console.log("Admin API response:", JSON.stringify(data, null, 2));

    return Response.json({
      success: response.ok,
      status: response.status,
      data,
    });

  } catch (error) {
    console.error("Shop GID error:", error);

    return Response.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
