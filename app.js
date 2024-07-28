// 定義express
const express = require("express");
const app = express();
const port = 3000;
// 設置路由
const router = require("./routes/index");

// 定義cookie、flash
const flash = require("connect-flash");
const session = require("express-session");

// 加入hbs模組
const { engine } = require("express-handlebars");

// 為request加入put、delete功能
const methodOverride = require("method-override");

// 導入訊息處理中介軟體
const messageHandler = require("./middlewares/message-handler");
const errorHandler = require("./middlewares/error-handler");

// 驗證機制
const passport = require("passport");

// 導入環境變數

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
  console.log("env", process.env.SESSION_SECRET);
}

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
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

// 使用passport驗證機制
app.use(passport.initialize());
app.use(passport.session());

// 提示訊息處理
app.use(messageHandler);

// 模組route使用
app.use(router);

// 錯誤中介軟體處理
app.use(errorHandler);
// 伺服器監聽
app.listen(port, () => {
  console.log(`The server is running on port:${port}`);
});
