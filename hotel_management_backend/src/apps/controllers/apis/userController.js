const UserModel = require("../../models/user");
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone } = req.body;
    const isPhone = await UserModel.findOne({ phone });
    if (isPhone && isPhone._id.toString() !== id) {
      return res.status(400).json("Phone exists");
    }
    const user = {
      name,
      phone,
    };
    await UserModel.updateOne({ _id: id }, { $set: user });
    return res.status(200).json("Update user successfully");
  } catch (error) {
    return res.status(500).json(error);
  }
};
