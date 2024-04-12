
const adminName_DB = "sribin";
const password_DB = "123";

function adminvalidation(req, res, next) {
  const  adminName = req.body.name; 
  const password =req.body.password
  if(adminName_DB === adminName && password_DB === password){
    req.session.admin = true
    return next();
  }else{
    req.session.errorMessage = "Invalid password or name";
    return res.redirect("/admin/adminSignup");
  }
}

module.exports = adminvalidation;
