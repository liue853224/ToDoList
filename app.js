// 定義
const express = require("express");
const app = express();
const port = 3000;
// Route
app.get("/", (req, res) => {
  res.send("It works!");
});
app.get("/todos", (req, res) => {
  res.send("get all todos");
});

app.get("/todos/new", (req, res) => {
  res.send("create todo");
});

app.post("/todos", (req, res) => {
  res.send("add todo");
});

app.get("/todos/:id", (req, res) => {
  res.send(`get todo: ${req.params.id}`);
});

app.get("/todos/:id/edit", (req, res) => {
  res.send(`get todo edit: ${req.params.id}`);
});

app.put("/todos/:id", (req, res) => {
  res.send("modify todo");
});

app.delete("/todos/:id", (req, res) => {
  res.send("delete todo");
});
// 伺服器監聽
app.listen(port, () => {
  console.log(`The server is running on port:${port}`);
});
