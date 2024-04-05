const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema({
  googleId: String,
  name: String,
  email: String,
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
