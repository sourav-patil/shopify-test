import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";

// export const loader = async ({ request }) => {
//   await authenticate.admin(request);

//   return null;
// };
export const loader = async ({ request }) => {

  const { session } = await authenticate.admin(request);

  const shop = session.shop;

  return redirect(
    `https://app.bolka.ai/login?shop=${shop}&source=shopify`
  );
};


export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
