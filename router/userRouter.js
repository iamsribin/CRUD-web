const express = require("express");
const Router = express.Router();
const app = express();
const adduser = require("../middleware/adduser");
const validation = require("../middleware/validation");
const upload = require("../multer/storageConfigeration")
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

Router.post("/signup",upload.single('avatar'), adduser, (req, res) => {
  res.redirect("/user/dashboard");
});

Router.get("/userSignup", (req, res) => {
  if (req.session.errorMessage) {
    const errorMessage = req.session.errorMessage;
    req.session.errorMessage = null;
    res.render("loginPages/userSingup", { error: errorMessage, title:"Singnup page" });
  } else if (req.session.user) {
    res.redirect("/user/dashboard");
  } else {
    res.render("loginPages/userSingup",{title:"Singnup page" });
  }
});

Router.post("/userlogin", validation, (req, res) => {
  res.redirect("/user/dashboard");
});

Router.get("/dashboard", (req, res) => {
  if (req.session.user) {
    res.render("index",{title:"user dashboard",userName:req.session.user});
  } else {
    res.redirect("/");
  }
});

Router.get("/logout",(req,res)=>{
  req.session.destroy((err)=>{
    if(err){
      res.send("logout err");
    }else{
      res.redirect("/");
    }
  })
});

module.exports = Router;
