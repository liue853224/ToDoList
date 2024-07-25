const express = require("express");
const router = express.Router();

const db = require("../models");
const { session } = require("passport");
const passport = require("passport");
const user = require("../models/user");
const Todo = db.Todo;

router.get("/", (req, res) => {
  console.log("session", req.session);
  console.log(req.user);
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const userId = req.user.id;

  return Todo.findAll({
    attributes: ["id", "name", "isComplete"],
    where: { userId },
    offset: (page - 1) * limit,
    limit,
    raw: true,
  })
    .then((todos) =>
      res.render("todos", {
        todos,
        prev: page > 1 ? page - 1 : page,
        next: page + 1,
        page,
      })
    )
    .catch((error) => {
      error.errorMessage = "找不到相關資料:(";
      next(error);
    });
});

router.get("/new", (req, res) => {
  return res.render("new");
});

router.post("/", (req, res, next) => {
  const name = req.body.name;
  const userId = req.user.id;

  return Todo.create({ name, userId })
    .then(() => {
      req.flash("success", "新增成功!");

      return res.redirect("/todos");
    })
    .catch((error) => {
      error.errorMessage = "新增失敗:(";
      next(error);
    });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;

  return Todo.findByPk(id, {
    attributes: ["id", "name", "isComplete", "userId"],
    raw: true,
  })
    .then((todo) => {
      if (!todo) {
        req.flash("error", "資料不存在");
        return redirect("/todos");
      }
      if (todo.userId !== userId) {
        req.flash("error", "權限不足");
        return redirect("/todos");
      }
      res.render("todo", { todo });
    })
    .catch((error) => {
      console.error(error);
      req.flash("error", "資料取得失敗:(");
      return res.redirect("back");
    });
});

router.get("/:id/edit", (req, res) => {
  const id = req.params.id;

  return Todo.findByPk(id, {
    attributes: ["id", "name", "isComplete"],
    raw: true,
  })
    .then((todo) => res.render("edit", { todo }))
    .catch((error) => {
      console.error(error);
      req.flash("error", "資料取得失敗:(");
      return res.redirect("back");
    });
});

router.put("/:id", (req, res) => {
  const { name, isComplete } = req.body;
  const id = req.params.id;
  const userId = req.user.id;

  return Todo.findByPk(id, {
    attributes: ["id", "name", "isComplete", "userId"],
  }).then((todo) => {
    if (!todo) {
      req.flash("error", "資料不存在");
      return redirect("/todos");
    }
    if (todo.userId !== userId) {
      req.flash("error", "權限不足");
      return redirect("/todos");
    }
    return todo
      .update({ name, isComplete: isComplete === "completed" })
      .then(() => {
        req.flash("success", "更新成功!");
        return res.redirect(`/todos/${id}`);
      })
      .catch((error) => {
        req.flash("error", "更新失敗:(");
        return res.redirect("back");
      });
  });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;

  return Todo.findByPk(id, {
    attributes: ["id", "name", "isComplete", "userId"],
  })
    .then((todo) => {
      if (!todo) {
        req.flash("error", "找不到資料");
        return res.redirect("/todos");
      }
      if (todo.userId !== userId) {
        req.flash("error", "權限不足");
        return res.redirect("/todos");
      }

      return todo.destroy().then(() => {
        req.flash("success", "刪除成功!");
        return res.redirect("/todos");
      });
    })
    .catch((error) => {
      error.errorMessage = "刪除失敗:(";
      next(error);
    });
});

module.exports = router;
