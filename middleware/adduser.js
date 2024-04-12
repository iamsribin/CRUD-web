const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const fs = require("fs");

function adduser(req, res, next) {
  const { name, email, password, number } = req.body;
  const avatarPath = req.file.path;
  console.log("avatar path:", avatarPath);
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      req.session.errorMessage = "Somthig went wrong try again";
      if (req.session.admin) {
        return res.redirect("/admin/addUser");
      } else {
        return res.redirect("/user/userSignup");
      }
    }

    const newUser = new User({
      name: name,
      email: email,
      number: number,
      image: avatarPath,
      password: hashedPassword,
    });

    newUser
      .save()
      .then(() => {
        console.log("User created:", newUser);
        if (
          req.session.admin &&
          typeof req.body === "object" &&
          !("userTrue" in req.body)
        ) {
          req.session.success = "New User has been successfully added";
          return res.redirect("/admin/dashboard");
        } else {
          req.session.user = name;
          next();
        }
      })
      .catch((error) => {
        if (error.code === 11000 && error.keyPattern.email === 1) {
          req.session.errorMessage = "Email already exists";

          try {
            fs.unlinkSync(avatarPath);
            console.log("Image file deleted:", avatarPath);
          } catch (err) {
            console.error("Error deleting image file:", err);
          }
          if (req.session.admin) {
            return res.redirect("/admin/addUser");
          } else {
            return res.redirect("/user/userSignup");
          }
        } else {
          console.error("Error creating user:", error);
          req.session.errorMessage = "Somthig went wrong try again";

          try {
            fs.unlinkSync(avatarPath);
            console.log("Image file deleted:", avatarPath);
          } catch (err) {
            console.error("Error deleting image file:", err);
          }
          if (req.session.admin) {
            return res.redirect("/admin/addUser");
          } else {
            return res.redirect("/user/userSignup");
          }
        }
      });
  });
}
module.exports = adduser;
