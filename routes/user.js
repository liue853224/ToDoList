const express = require("express");
const router = express.Router();

const db = require("../models");

router.get("/register", (req, res) => {
  res.send("get register page");
});

router.get("/login", (req, res) => {
  res.send("get login page");
});

router.post("/users", (req, res) => {
  res.send("Add a user account");
});

router.post("/login", (req, res) => {
  res.send("send user data");
});

router.post("/logout", (req, res) => {
  res.send("remove user data");
});
