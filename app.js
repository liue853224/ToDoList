// 定義
const express = require("express");
const app = express();
const port = 3000;
const flash = require("connect-flash");
const session = require("express-session");
const { engine } = require("express-handlebars");
const methodOverride = require("method-override");

const db = require("./models");
const Todo = db.Todo;

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
// Route
app.get("/", (req, res) => {
  res.redirect("todos");
});

app.get("/todos", (req, res) => {
  const message = req.flash("success");

  return Todo.findAll({
    attributes: ["id", "name", "isComplete"],
    raw: true,
  })
    .then((todos) => res.render("todos", { todos, message }))
    .catch((err) => res.status(422).json(err));
});

app.get("/todos/new", (req, res) => {
  return res.render("new");
});

app.post("/todos", (req, res) => {
  const name = req.body.name;

  return Todo.create({ name })
    .then(() => {
      req.flash("success", "新增成功!");
      return res.redirect("/todos");
    })
    .catch((err) => console.log(err));
});

app.get("/todos/:id", (req, res) => {
  const id = req.params.id;

  return Todo.findByPk(id, {
    attributes: ["id", "name", "isComplete"],
    raw: true,
  })
    .then((todo) => res.render("todo", { todo }))
    .catch((err) => console.log(err));
});

app.get("/todos/:id/edit", (req, res) => {
  const id = req.params.id;

  return Todo.findByPk(id, {
    attributes: ["id", "name", "isComplete"],
    raw: true,
  }).then((todo) => res.render("edit", { todo }));
});

app.put("/todos/:id", (req, res) => {
  const { name, isComplete } = req.body;
  const id = req.params.id;

  return Todo.update(
    { name, isComplete: isComplete === "completed" },
    { where: { id } }
  ).then(() => res.redirect(`/todos/${id}`));
});

app.delete("/todos/:id", (req, res) => {
  const id = req.params.id;
  return Todo.destroy({ where: { id } }).then(() => res.redirect("/todos"));
});
// 伺服器監聽
app.listen(port, () => {
  console.log(`The server is running on port:${port}`);
});
