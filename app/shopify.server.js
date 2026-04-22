import "@shopify/shopify-app-react-router/adapters/node";

import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-react-router/server";

import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.April25,

  scopes: process.env.SCOPES?.split(","),

  appUrl: process.env.SHOPIFY_APP_URL || "",

  authPathPrefix: "/auth",

  sessionStorage: new PrismaSessionStorage(prisma),

  distribution: AppDistribution.AppStore,

  // 🚨 IMPORTANT
  isEmbeddedApp: false,

  hooks: {
    afterAuth: async ({ session }) => {
      console.log("✅ SESSION SAVED:", session.shop);

      // register webhooks if needed
      await shopify.registerWebhooks({ session });

      // 🔴 redirect merchant to your SaaS login page
      throw new Response(null, {
        status: 302,
        headers: {
          Location: `https://bolka.ai/login?shop=${session.shop}`,
        },
      });
    },
  },

  future: {
    expiringOfflineAccessTokens: true,
    unstable_newEmbeddedAuthStrategy: false,
  },

  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;

export const apiVersion = ApiVersion.April25;

export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;