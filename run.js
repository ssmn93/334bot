const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'pages')));

app.get("/", (req, res) => {
  fs.readFile("./pages/index.html", (err, data) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(data);
    res.end();
  });
})

const port = parseInt(process.env.PORT || '3000', 10);

app.listen(3000, () => {
  console.log(`サーバーを開きました`);
});

require('./server.js')
