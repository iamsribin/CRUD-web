//import
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const admin = require("./router/adminRouter");
const user = require("./router/userRouter");
const validation = require("./middleware/validation");
require("./connention/mongooseConnetion");


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use("/static", express.static(path.join(__dirname, "style")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});


//Routes 
app.use('/admin', admin);
app.use('/user', user);

const PORT = 4000 || process.env.PORT;

app.get("/",(req, res) => {
  if(req.session.errorMessage){
    const errorMessage =  req.session.errorMessage;
    req.session.errorMessage = null;
    res.render("loginPages/userLogin",{error:errorMessage, title: "user login"});
  }
  else if (req.session.user){
   res.redirect("/user/dashboard")
  }
    else{
    res.render("loginPages/userLogin",{title:"user login"});
  }
});

 
app.listen(PORT, () => {
  console.log(`server start http://localhost:${PORT}`);
});

