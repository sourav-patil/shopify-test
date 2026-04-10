import { useEffect } from "react";
import { useFetcher } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($product: ProductCreateInput!) {
        productCreate(product: $product) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
            demoInfo: metafield(namespace: "$app", key: "demo_info") {
              jsonValue
            }
          }
        }
      }`,
    {
      variables: {
        product: {
          title: `${color} Snowboard`,
          metafields: [
            {
              namespace: "$app",
              key: "demo_info",
              value: "Created by React Router Template",
            },
          ],
        },
      },
    },
  );
  const responseJson = await response.json();
  const product = responseJson.data.productCreate.product;
  const variantId = product.variants.edges[0].node.id;
  const variantResponse = await admin.graphql(
    `#graphql
    mutation shopifyReactRouterTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants {
          id
          price
          barcode
          createdAt
        }
      }
    }`,
    {
      variables: {
        productId: product.id,
        variants: [{ id: variantId, price: "100.00" }],
      },
    },
  );
  const variantResponseJson = await variantResponse.json();
  const metaobjectResponse = await admin.graphql(
    `#graphql
    mutation shopifyReactRouterTemplateUpsertMetaobject($handle: MetaobjectHandleInput!, $metaobject: MetaobjectUpsertInput!) {
      metaobjectUpsert(handle: $handle, metaobject: $metaobject) {
        metaobject {
          id
          handle
          title: field(key: "title") {
            jsonValue
          }
          description: field(key: "description") {
            jsonValue
          }
        }
        userErrors {
          field
          message
        }
      }
    }`,
    {
      variables: {
        handle: {
          type: "$app:example",
          handle: "demo-entry",
        },
        metaobject: {
          fields: [
            { key: "title", value: "Demo Entry" },
            {
              key: "description",
              value:
                "This metaobject was created by the Shopify app template to demonstrate the metaobject API.",
            },
          ],
        },
      },
    },
  );
  const metaobjectResponseJson = await metaobjectResponse.json();

  return {
    product: responseJson.data.productCreate.product,
    variant: variantResponseJson.data.productVariantsBulkUpdate.productVariants,
    metaobject: metaobjectResponseJson.data.metaobjectUpsert.metaobject,
  };
};

export default function Index() {
  const fetcher = useFetcher();
  const shopify = useAppBridge();
  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";

  useEffect(() => {
    if (fetcher.data?.product?.id) {
      shopify.toast.show("Product created");
    }
  }, [fetcher.data?.product?.id, shopify]);
  const generateProduct = () => fetcher.submit({}, { method: "POST" });

 const openAppEmbedSettings = () => {
    const shop = shopify.config.shop;
    const url = `https://${shop}/admin/themes/current/editor?context=apps`;
    window.open(url, "_top");
  };
   const openBolkaDashboard = () => {
    const shop = shopify.config.shop;
  window.open(`https://app.bolka.ai/?shop=${shop}`, "_blank");
  };
  return (
   <s-page heading="Welcome to Bolka AI Voice Agent">

<s-section heading="Step 1: Enable Voice Widget">
  <s-paragraph>
    Activate the Bolka voice widget inside your Shopify theme.
  </s-paragraph>

  <s-button variant="primary" onClick={openAppEmbedSettings}>
    Enable Voice Widget
  </s-button>
</s-section>

<s-section heading="Step 2: Configure Voice Agent">
  <s-paragraph>
    Configure your AI voice agent, knowledge base and widget settings.
  </s-paragraph>

  <s-button variant="secondary" onClick={openBolkaDashboard}>
    Configure Agent
  </s-button>
</s-section>

</s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
