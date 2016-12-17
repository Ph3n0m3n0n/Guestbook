var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// creates a schema
var userSchema = new Schema({
  name: String,
  email: String,
  // username: { type: String, required: true, unique: true },
  // password: { type: String, required: true },
  admin: Boolean,
  location: String,
  message: String,
  created_at: Date,
  updated_at: Date
});

// useing the model
var User = mongoose.model('User', userSchema);

// exporting this module to the rest of the app
module.exports = User;