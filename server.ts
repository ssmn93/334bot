import { Hono } from "hono";
import { serve } from "@hono/node-server";

const app = new Hono();

// ヘルスチェック用エンドポイント
app.get("/", (c) => {
  return c.json({
    status: "ok",
    message: "Discord Bot is running",
    node_version: process.version,
    timestamp: new Date().toISOString(),
  });
});

const port = parseInt(process.env.PORT || '3000', 10);

serve({
  fetch: app.fetch,
  port,
}, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
