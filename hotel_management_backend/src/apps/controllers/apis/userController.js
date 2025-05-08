const UserModel = require("../../models/user");
const bcrypt = require("bcrypt");
exports.index = async (req, res) => {
  try {
    const query = {};
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (req.query.role) {
      query.role = req.query.role;
    }

    const users = await UserModel.find(query)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      status: "success",
      filters: {
        role: req.query.role || null,
        keyword: req.query.keyword || null,
      },
      data: {
        docs: users,
        pages: await pagination(page, UserModel, query, limit),
      },
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone } = req.body;
    const isPhone = await UserModel.findOne({ phone });
    if (isPhone && isPhone._id.toString() !== id) {
      return res.status(400).json("Số điện thoại đã tồn tại");
    }
    const user = {
      name,
      phone,
    };
    await UserModel.updateOne({ _id: id }, { $set: user });
    const updatedUser = await UserModel.findById(id).lean();
    return res.status(200).json({
      status: "success",
      message: "Cập nhật thành công",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.show = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id).select("-password");
    if (!user) {
      return res.status(404).json("User not found");
    }
    return res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json("User not found");
    }
    return res.status(200).json({
      status: "success",
      message: "Xóa thành công",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.create = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
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
      role,
    }).save();
    return res.status(201).json({
      status: "success",
      message: "Tạo người dùng thành công",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.updateByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, role } = req.body;

    const isPhone = await UserModel.findOne({ phone });
    if (isPhone && isPhone._id.toString() !== id) {
      return res.status(400).json("Số điện thoại đã tồn tại");
    }

    const user = { name, phone, role };
    await UserModel.updateOne({ _id: id }, { $set: user });

    return res.status(200).json({
      status: "success",
      message: "Cập nhật thành công",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
