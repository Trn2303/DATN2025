const mongoose = require("../../common/init.mongodb")();

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "customer", "staff"],
      default: "customer",
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("Users", userSchema, "users");
module.exports = UserModel;
