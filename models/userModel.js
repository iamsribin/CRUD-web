const mongo = require("mongoose");
const bcrypt = require("bcrypt");

const {Schema,model} = mongo;

const UserSchema = Schema({
    name: {type: String, require:true},
    email: {type: String, require:  true, unique:true},
    number: {type: String, require:  true},
    image: {type: String, require:true},
    password: { type: String, required: true },
  });

  module.exports = model("Users",UserSchema);
