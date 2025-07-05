const express = require('express');
const app = express();

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

app.listen(3000, () => {
  console.log(`サーバーを開きました`);
});

require('./server.js')
