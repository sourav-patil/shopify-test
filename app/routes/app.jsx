export const loader = async () => {
  return new Response(
    "This Shopify app is managed from https://bolka.ai",
    { status: 200 }
  );
};

export default function App() {
  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h2>Bolka AI</h2>
      <p>This Shopify app is managed from:</p>
      <a href="https://bolka.ai/login">https://bolka.ai</a>
    </div>
  );
}