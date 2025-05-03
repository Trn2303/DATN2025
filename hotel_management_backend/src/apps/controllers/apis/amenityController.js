const AmenityModel = require("../../models/amenity");

exports.index = async (req, res) => {
  try {
    const query = {};
    // lấy danh sách tiện nghi
    const amenities = await AmenityModel.find(query);
    return res.status(200).json({
      status: "success",
      data: {
        docs: amenities,
      },
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.store = async (req, res) => {
  try {
    const amenity = req.body;
    // Kiểm tra nếu đã có tiện nghi cùng tên
    const existingAmenity = await AmenityModel.findOne({ name: amenity.name });
    if (existingAmenity) {
      return res
        .status(400)
        .json({ status: "fail", message: "Tiện nghi đã tồn tại" });
    }
    await new AmenityModel(amenity).save();
    return res.status(200).json({
      status: "success",
      message: "Thêm mới thành công",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const amenity = req.body;
    await AmenityModel.updateOne({ _id: id }, { $set: amenity });
    return res.status(200).json({
      status: "success",
      message: "Cập nhật thành công",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.destroy = async (req, res) => {
  try {
    const { id } = req.params;
    await AmenityModel.deleteOne({ _id: id });
    return res.status(200).json({
      status: "success",
      message: "Xóa thành công",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
