import { Hono } from "hono";

const app = new Hono();

// ヘルスチェック用のエンドポイント
app.get("/", (c) => {
  return c.json({
    status: "ok",
    message: "Discord Bot is running",
    node_version: process.version,
    timestamp: new Date().toISOString(),
  });
});

export default app;
