module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "尚未登入,正在導回登入頁面");
  return res.redirect("/login");
};
