import prisma from "../db.server";

export const loader = async () => {
  const shop = "bolka-ai.myshopify.com";

  const session = await prisma.session.findFirst({
    where: {
      shop,
      isOnline: false,
    },
  });

  if (!session) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "No offline session found",
        shop,
      }),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      shop: session.shop,
      accessTokenExists: !!session.accessToken,
      accessTokenLength: session.accessToken?.length || 0,
      refreshTokenExists: !!session.refreshToken,
      refreshTokenExpires: session.refreshTokenExpires,
      expires: session.expires,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};