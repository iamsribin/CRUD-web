const fs = require("fs");
const User = require("../models/userModel");

function editUser(req, res, next) {
  let id = req.params.id;
  console.log("id:", id);
  const { name, email, number } = req.body;
  console.log("body:",req.body,"name:", name, "email:", email, "number:", number);
  let new_image = "";
  console.log("ile:", req.file);

  if (req.file) {
    new_image =  req.file.path;
    console.log("newimg:", new_image);
    console.log("oldimg:", req.body.old_img);
    try {
      fs.unlinkSync('./' + req.body.old_img);
      console.log("Image file deleted:", req.body.old_img);
    } catch (err) {
      console.error("Error deleting image file:", err);
    }
  } else {
    new_image = req.body.old_img;             
    console.log("No file uploaded. Using old image:", new_image);
  }

  User.findByIdAndUpdate(id, {
    name: name,
    email: email,
    number: number,
    image: new_image,
  })
    .then(result => {
      console.log("User updated:", result);
      req.session.success = "User updated successfully";
      return next();
    })
    .catch(err => {
      console.error("Error updating user:", err);
      return next(err);
    });
}

module.exports = editUser;
