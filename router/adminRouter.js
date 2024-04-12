const express = require("express");
const Router = express.Router();
const adminvalidation = require("../middleware/adminValidation");
const addUser = require("../middleware/adduser");
const User = require("../models/userModel")
const editUser = require("../middleware/editUser")
const upload = require("../multer/storageConfigeration")
const fs = require("fs");
const app = express();

Router.use(express.json());
Router.use(express.urlencoded({ extended: true }));

Router.post("/adminSignup", adminvalidation, (req, res) => {
  res.redirect("/admin/dashboard");
});
Router.get("/adminSignup", (req, res) => {
  if (req.session.errorMessage) {
    const errorMessage = req.session.errorMessage;
    req.session.errorMessage = null;
    res.render("loginPages/adminLogin", {
      error: errorMessage,
      title: "admin signup",
    });
  } else if (req.session.admin) {
    res.redirect("/admin/dashboard");
  } else {
    res.render("loginPages/adminLogin", { title: "admin signup" });
  }
});
Router.post("/adduser", upload.single("avatar"), addUser, (req, res) => {
  res.redirect("/admin/addUser");
});
Router.get("/addUser", (req, res) => {
  if (req.session.errorMessage) {
    const errorMessage = req.session.errorMessage;
    req.session.errorMessage = null;
    res.render("userManagement/createUser", {
      title: "admin dashboard",
      error: errorMessage,
    });
  } else if (req.session.admin) {

    res.render("userManagement/createUser", );
  } else {
    res.redirect("/admin/adminSignup");
  }
});
Router.get("/Edit/:id", (req, res) => {
  let id = req.params.id;
  if (req.session.admin) {
    User.findById(id)
      .then(user => {
        if (user === null) {
          res.redirect("/admin/dashboard");
        } else {
          res.render("userManagement/editUser", { title: "admin dashboard", user: user });
        }
      })
      .catch(err => {
        console.log("Error finding user by ID:", err);
        res.redirect("/admin/dashboard");
      });
  } else {
    res.redirect("/admin/adminSignup");
  }
});

Router.get("/dashboard", (req, res) => {
  if (req.session.admin) {
    if(req.session.success){
      const sucess = req.session.success;
      req.session.success = null;
      User.find().exec() 
        .then(users => {
          res.render("adminDashbord", { title: "admin dashboard", success: sucess,users: users});
        })
        .catch(error => {
          console.error("Error retrieving users:", error);
          res.render("adminDashbord", { title: "admin dashboard", error: "something went wrong" });
        });
      
    }else {
      User.find().exec()
        .then(users => {
          res.render("adminDashbord", { title: "admin dashboard", users: users });
        })
        .catch(error => {
          console.error("Error retrieving users:", error);
          res.render("adminDashbord", { title: "admin dashboard", error: "something went wrong" });
        });
      }
  } else {
    res.redirect("/admin/adminSignup");
  }
});
                 
Router.post("/Edit/:id",upload.single("avatar"),editUser,(req,res)=>{
  res.redirect("/admin/dashboard");
});
            
Router.post("/delete/:id", (req, res) => {
  let id = req.params.id;
  User.findOneAndDelete({_id: id})
    .then(result => {
      if (result.image !== '') {
        try {
          fs.unlinkSync("./" + result.image);
          req.session.success = "User deleted successfully";
          req.session.user = null;
          return res.redirect("/admin/dashboard");
        } catch (error) {
          console.log("Delete image error:", error);
          req.session.error = "Error deleting user image";
          return res.redirect("/admin/dashboard");
        }
      } else {
        req.session.success = "User deleted successfully";
        return res.redirect("/admin/dashboard");
      }
    })
    .catch(err => {
      console.log("Delete user error:", err);
      req.session.error = "Error deleting user";
      return res.redirect("/admin/dashboard");
    });
})

Router.get("/logout",(req,res)=>{
  req.session.admin=null;
  res.redirect("/admin/adminSignup");
})
module.exports = Router;
