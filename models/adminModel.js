const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const AdminSchema = Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

module.exports = model('Admin', AdminSchema);