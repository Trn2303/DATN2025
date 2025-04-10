const UserModel = require("../../models/user");
const jwt = require("jsonwebtoken");
const config = require("config");

exports.registerCustomer = async (req, res) => {
  try {
    const { email, password, phone, name } = req.body;
    const isEmail = await UserModel.findOne({ email });
    if (isEmail) {
      return res.status(400).json({
        status: "fail",
        message: "Email already exists!",
      });
    }
    const isPhone = await UserModel.findOne({ phone });
    if (isPhone) {
      return res.status(400).json({
        status: "fail",
        message: "Phone already exists!",
      });
    }
    const newCustomer = new UserModel({
      name,
      email,
      password,
      phone,
    });
    await new UserModel(newCustomer).save();
    return res.status(200).json({
      status: "success",
      message: "Customer created successfully!",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isEmail = await UserModel.findOne({ email });
    if (!isEmail) {
      return res.status(400).json({ message: "Email invalid!" });
    }
    const isPassword = isEmail.password === password;
    if (!isPassword) {
      return res.status(400).json({ message: "Password invalid!" });
    }
    if (isEmail && isPassword) {
      const accessToken = jwt.sign({ email }, config.get("app.jwtAccessKey"), {
        expiresIn: "1h",
      });
      const { password, ...others } = isEmail._doc;
      return res.status(200).json({
        message: "Login successfully!",
        customer: others,
        accessToken,
      });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.logoutCustomer = async (req, res) => {};
