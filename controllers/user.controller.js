const User = require("../models/user.model")

module.exports.renderSignup = (req, res) => {
  res.render("users/signup");
}

module.exports.signup = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcom To Wanderlust!");
        res.redirect("/listings");
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/signup");
    }
  }

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged you out successfully!!");
    res.redirect("/listings");
  });
}