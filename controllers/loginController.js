const User = require("../models/User");
const bcrypt = require("bcryptjs");

module.exports = {
  viewLogin: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      if (req.session.user === null || req.session.user === undefined) {
        res.render("index", {
          alert,
          title: "Stycation | Login",
        });
      } else {
        res.redirect("/admin");
      }
    } catch (error) {
      res.redirect("/auth/login");
    }
  },
  actionLogin: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username: username });
      if (!user) {
        req.flash("alertMessage", "User Not Found");
        req.flash("alertStatus", "danger");
        res.redirect("/auth/login");
      } else {
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
          req.flash("alertMessage", "Worng Password");
          req.flash("alertStatus", "danger");
          res.redirect("/auth/login");
        } else {
          req.session.user = {
            id: user._id,
            username: user.username,
          };
          res.redirect("/admin");
        }
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/auth/login");
    }
  },

  actionLogout: async (req, res) => {
    try {
      req.session.destroy();
      res.redirect("/auth/login");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin");
    }
  },
};
