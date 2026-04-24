import { shopifyApi } from "@shopify/shopify-api";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";

export const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,

  scopes: process.env.SCOPES.split(","),

  hostName: process.env.SHOPIFY_APP_URL.replace(/^https?:\/\//, ""),

  apiVersion: "2024-10",

  isEmbeddedApp: false,

  sessionStorage: new PrismaSessionStorage(prisma),
});

export const authenticate = shopify.authenticate;