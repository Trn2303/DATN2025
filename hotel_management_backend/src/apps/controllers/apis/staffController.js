const StaffModel = require("../../models/staff");
const UserModel = require("../../models/user");
const pagination = require("../../../libs/pagination");

exports.index = async (req, res) => {
  try {
    const query = {};
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.page) || 6;
    const skip = (page - 1) * limit;
    if (req.query.status != null) query.status = req.query.status;
    // lấy danh sách nhân viên
    const staffs = await StaffModel.find(query)
      .populate("user_id")
      .skip(skip)
      .limit(limit);
    return res.status(200).json({
      status: "success",
      filters: {
        status: req.query.status || null,
      },
      data: {
        docs: staffs,
        pages: await pagination(page, StaffModel, query, limit),
      },
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.show = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await StaffModel.findById(id);
    if (!staff) {
      return res.status(404).json({
        status: "fail",
        message: "Staff not found",
      });
    }
    return res.status(200).json({
      status: "success",
      data: staff,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.store = async (req, res) => {
  try {
    const { name, email, password, phone, position, address, salary } =
      req.body;
    const isEmail = await UserModel.findOne({ email });
    if (isEmail) {
      return res.status(400).json({
        status: "fail",
        message: "Email đã tồn tại",
      });
    }
    const isPhone = await UserModel.findOne({ phone });
    if (isPhone) {
      return res.status(400).json({
        status: "fail",
        message: "Phone đã tồn tại",
      });
    }
    const user = new UserModel({
      name,
      email,
      password,
      phone,
      role: "staff",
    });
    await user.save();
    const staff = new StaffModel({
      user_id: user._id,
      position,
      address,
      salary,
    });
    await staff.save();
    return res.status(200).json({
      status: "success",
      message: "Thêm mới nhân viên thành công",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, password, position, address, salary, status } =
      req.body;
    const staff = await StaffModel.findById(id);
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    const userUpdateData = { name, email, phone };
    if (password) {
      userUpdateData.password = password;
    }
    await UserModel.updateOne({ _id: staff.user_id }, { $set: userUpdateData });

    const staffUpdateData = { position, address, salary, status };
    await StaffModel.updateOne({ _id: id }, { $set: staffUpdateData });
    return res.status(200).json({
      status: "success",
      message: "Cập nhật thông tin nhân viên thành công",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.deactivate = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await StaffModel.findById(id);
    if (!staff) {
      return res.status(404).json({
        status: "fail",
        message: "Staff not found",
      });
    }
    staff.status = staff.status === "active" ? "inactive" : "active";
    await staff.save();
    return res.status(200).json({
      status: "success",
      message: "Đổi trạng thái nhân viên thành công",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
