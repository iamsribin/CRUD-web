const User = require("../models/userModel");
const bcrypt = require("bcrypt");

function validation(req, res, next) {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.session.errorMessage = "Invalid email ";
        return res.redirect("/");
      }
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          req.session.errorMessage = "Somthing went wrong try again";
          return res.redirect("/");
        }
        if (isMatch) {
          req.session.user = user.name;
          return next();
        } else {
          req.session.errorMessage = "Invalid password";
          return res.redirect("/");
        }
      });
    })
    .catch((error) => {
      req.session.errorMessage = "Something went wrong, please try again";
      res.redirect("/");
    });
}

module.exports = validation;
