// 定義
const express = require("express");
const app = express();
const port = 3000;
const flash = require("connect-flash");
const session = require("express-session");
const { engine } = require("express-handlebars");
const methodOverride = require("method-override");

const router = require("./routes/index");

// 樣板引擎設置
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");

// 讓express取得網址中的資料
app.use(express.urlencoded({ extended: true }));

// 讓表單可以使用PUT Method功能
app.use(methodOverride("_method"));

// 增添flash功能以及使用session&cookie
app.use(
  session({
    secret: "ThisIsSecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

// 模組route使用
app.use(router);

// 伺服器監聽
app.listen(port, () => {
  console.log(`The server is running on port:${port}`);
});
