const UserModel = require("../../models/user");
const jwt = require("jsonwebtoken");
const { jwtDecode } = require("jwt-decode");
const { redisClient } = require("../../../common/init.redis");
const config = require("config");
const TokenModel = require("../../models/token");
const bcrypt = require("bcrypt");

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
        message: "Email đã được sử dụng!",
      });
    }
    const isPhone = await UserModel.findOne({ phone });
    if (isPhone) {
      return res.status(400).json({
        status: "fail",
        message: "Số điện thoại đã được sử dụng!",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel({
      name,
      email,
      hashedPassword,
      phone,
    }).save();
    return res.status(200).json({
      status: "success",
      message:
        "Đăng ký tài khoản thành công! Bạn sẽ được chuyển hướng đến trang đăng nhập sau 5 giây",
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
      return res.status(400).json({ message: "Email không tồn tại!" });
    }
    const isPassword = await bcrypt.compare(password, isEmail.password);
    if (!isPassword) {
      return res.status(400).json({ message: "Sai mật khẩu!" });
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
        secure: true,
        sameSite: "None",
      });
      const { password, ...others } = isEmail._doc;
      return res.status(200).json({
        status: "success",
        message: "Đăng nhập thành công!",
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
exports.forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại!" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Đặt lại mật khẩu thành công!" });
  } catch (error) {
    return res.status(500).json(error);
  }
};
