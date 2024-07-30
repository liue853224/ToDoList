const express = require("express");
const router = express.Router();

const passport = require("passport");
const LocalStrategy = require("passport-local");
const FacebookStrategy = require("passport-facebook");

require("dotenv").config();

const db = require("../models");
const User = db.User;

// 設置加密組件
const bcrypt = require("bcryptjs");

passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    return User.findOne({
      attributes: ["id", "name", "email", "password"],
      where: { email },
      raw: true,
    })
      .then((user) => {
        if (!user) {
          return done(null, false, {
            message: "email或密碼錯誤",
          });
        }
        return bcrypt.compare(password, user.password).then((isMatch) => {
          if (!isMatch) {
            return done(null, false, { message: "email 或密碼錯誤" });
          }

          return done(null, user);
        });
      })
      .catch((error) => {
        error.errorMessage = "登入失敗";
        done(error);
      });
  })
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["email", "displayName"],
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("accessToken:", accessToken);
      console.log("refreshToken:", refreshToken);
      console.log("profile:", profile);

      const email = profile.emails[0].value;
      const name = profile.displayName;

      return User.findOne({
        attributes: ["id", "name", "email"],
        where: { email },
        raw: true,
      })
        .then((user) => {
          if (user) return done(null, user);

          const randomPwd = Math.random().toString(36).slice(-8);

          return bcrypt
            .hash(randomPwd, 10)
            .then((hash) => User.create({ name, email, password: hash }))
            .then((user) =>
              done(null, { id: user.id, name: user.name, email: user.email })
            );
        })
        .catch((error) => {
          error.errorMessage = "登入失敗";
          done(error);
        });
    }
  )
);

passport.serializeUser((user, done) => {
  const { id, name, email } = user;
  return done(null, { id, name, email });
});

passport.deserializeUser((user, done) => {
  done(null, { id: user.id });
});

const todos = require("./todos");
const users = require("./users");
const authHandler = require("../middlewares/auth-handler");

router.use("/todos", authHandler, todos);
router.use("/users", users);

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/register", (req, res) => {
  return res.render("register");
});

router.get("/login", (req, res) => {
  return res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/todos",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get(
  "/login/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/oauth2/redirect/facebook",
  passport.authenticate("facebook", {
    successRedirect: "/todos",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.post("/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) {
      next(error);
    }
    return res.redirect("/login");
  });
});

module.exports = router;
