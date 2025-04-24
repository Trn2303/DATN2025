const UserModel = require("../../models/user");
const jwt = require("jsonwebtoken");
const { jwtDecode } = require("jwt-decode");
const { redisClient } = require("../../../common/init.redis");
const config = require("config");
const TokenModel = require("../../models/token");

const generateAccessToken = async (user) => {
  return jwt.sign(
    { _id: user._id, email: user.email },
    config.get("app.jwtAccessKey"),
    {
      expiresIn: "15m",
    }
  );
};

const generateRefreshToken = async (user) => {
  return jwt.sign(
    { _id: user._id, email: user.email },
    config.get("app.jwtRefreshKey"),
    {
      expiresIn: "1d",
    }
  );
};

const setTokenBlackList = async (token) => {
  const decoded = jwtDecode(token);
  if (decoded.exp > Date.now() / 1000) {
    redisClient.set(token, token, {
      EXAT: decoded.exp,
    });
  }
};

exports.register = async (req, res) => {
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
    await UserModel({
      name,
      email,
      password,
      phone,
    }).save();
    return res.status(200).json({
      status: "success",
      message: "Customer created successfully!",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.login = async (req, res) => {
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
      const accessToken = await generateAccessToken(isEmail);
      const refreshToken = await generateRefreshToken(isEmail);
      const isToken = await TokenModel.findOne({ user_id: isEmail._id });
      if (isToken) {
        // move token to redis
        setTokenBlackList(isToken.accessToken);
        setTokenBlackList(isToken.refreshToken);
        // delete token from db
        await TokenModel.deleteOne({ user_id: isEmail._id });
      }
      await TokenModel({
        user_id: isEmail._id,
        accessToken,
        refreshToken,
      }).save();
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
      });
      const { password, ...others } = isEmail._doc;
      return res.status(200).json({
        message: "Login successfully!",
        user: others,
        accessToken,
      });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json("Authentication required!");
    }
    const dirtyToken = await redisClient.get(refreshToken);
    if (dirtyToken) {
      return res.status(401).json("Token expired");
    }
    jwt.verify(
      refreshToken,
      config.get("app.jwtRefreshKey"),
      async (error, decoded) => {
        if (error) {
          return res.status(401).json("Authentication required!");
        }

        const newAccessToken = await generateAccessToken(decoded);
        await TokenModel.updateOne(
          { refreshToken },
          { $set: { accessToken: newAccessToken } }
        );
        return res.status(200).json({
          accessToken: newAccessToken,
        });
      }
    );
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.logout = async (req, res) => {
  try {
    const { user_id } = req;
    const token = await TokenModel.findOne({ user_id });
    setTokenBlackList(token.accessToken);
    setTokenBlackList(token.refreshToken);
    await TokenModel.deleteOne({ user_id });
    return res.status(200).json("Logout successfully!");
  } catch (error) {
    return res.status(500).json(error);
  }
};
