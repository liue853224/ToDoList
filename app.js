// 定義
const express = require("express");
const app = express();
const port = 3000;

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

// Route
app.get("/", (req, res) => {
  res.redirect("todos");
});

app.get("/todos", (req, res) => {
  return Todo.findAll({
    attributes: ["id", "name"],
    raw: true,
  })
    .then((todos) => res.render("todos", { todos }))
    .catch((err) => res.status(422).json(err));
});

app.get("/todos/new", (req, res) => {
  return res.render("new");
});

app.post("/todos", (req, res) => {
  const name = req.body.name;

  return Todo.create({ name })
    .then(() => res.redirect("/todos"))
    .catch((err) => console.log(err));
});

app.get("/todos/:id", (req, res) => {
  const id = req.params.id;

  return Todo.findByPk(id, {
    attributes: ["id", "name"],
    raw: true,
  })
    .then((todo) => res.render("todo", { todo }))
    .catch((err) => console.log(err));
});

app.get("/todos/:id/edit", (req, res) => {
  const id = req.params.id;

  return Todo.findByPk(id, {
    attributes: ["id", "name"],
    raw: true,
  }).then((todo) => res.render("edit", { todo }));
});

app.put("/todos/:id", (req, res) => {
  const body = req.body;
  const id = req.params.id;

  return Todo.update({ name: body.name }, { where: { id } }).then(() =>
    res.redirect(`/todos/${id}`)
  );
});

app.delete("/todos/:id", (req, res) => {
  res.send("delete todo");
});
// 伺服器監聽
app.listen(port, () => {
  console.log(`The server is running on port:${port}`);
});
