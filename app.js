// 定義
const express = require("express");
const app = express();
const port = 3000;
// 伺服器監聽
app.listen(port, () => {
  console.log(`The server is running on port:${port}`);
});
