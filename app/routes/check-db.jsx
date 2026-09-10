import prisma from "../db.server";

export const loader = async () => {
  try {
    const count = await prisma.session.count();
    return Response.json({ db: "connected", sessionCount: count });
  } catch (e) {
    return Response.json({ db: "failed", error: e.message });
  }
};