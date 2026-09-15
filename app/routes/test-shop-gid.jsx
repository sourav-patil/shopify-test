import prisma from "../db.server";

export const loader = async () => {
  try {
    const shop = "bolka-ai.myshopify.com";

    // 1. Get offline session from Prisma
    const storedSession = await prisma.session.findFirst({
      where: {
        shop,
        isOnline: false,
      },
    });

    if (!storedSession) {
      return Response.json(
        {
          success: false,
          message: "No offline session found",
        },
        { status: 404 }
      );
    }

    console.log("Shop:", storedSession.shop);
    console.log("Access token exists:", !!storedSession.accessToken);

    // 2. Direct Shopify Admin GraphQL request
    const response = await fetch(
      `https://${storedSession.shop}/admin/api/2026-07/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": storedSession.accessToken,
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
    console.log(
      "Admin API response:",
      JSON.stringify(data, null, 2)
    );

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
        message:
          error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};