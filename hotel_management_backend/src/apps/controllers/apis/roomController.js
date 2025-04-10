const RoomModel = require("../../models/room");
const pagination = require("../../../libs/pagination");
const Amenity = require("../../models/amenity");
exports.index = async (req, res) => {
  try {
    const query = {};
    const page = Number(req.query.page) || 1;
    const limit = 4;
    // const skip = (page - 1) * limit;
    if (req.query.status != null) query.status = req.query.status;
    if (req.query.type != null) query.type = req.query.type;
    if (req.query.name) query.$text = { $search: req.query.name };
    // lấy danh sách phòng
    const rooms = await RoomModel.find(query);

    // nhóm phòng theo status
    const groupedRooms = {
      clean: rooms.filter((room) => room.status === "clean"),
      occupied: rooms.filter((room) => room.status === "occupied"),
      dirty: rooms.filter((room) => room.status === "dirty"),
      maintenance: rooms.filter((room) => room.status === "maintenance"),
    };
    //số lượng từng loại phòng
    const totalCounts = {
      clean: groupedRooms.clean.length,
      occupied: groupedRooms.occupied.length,
      dirty: groupedRooms.dirty.length,
      maintenance: groupedRooms.maintenance.length,
    };
    // phân trang theo từng status
    const paginatedRooms = {
      clean: groupedRooms.clean.slice((page - 1) * limit, page * limit),
      occupied: groupedRooms.occupied.slice((page - 1) * limit, page * limit),
      dirty: groupedRooms.dirty.slice((page - 1) * limit, page * limit),
      maintenance: groupedRooms.maintenance.slice(
        (page - 1) * limit,
        page * limit
      ),
    };

    return res.status(200).json({
      status: "success",
      filters: {
        status: req.query.status || null,
        type: req.query.type || null,
      },
      data: {
        docs: paginatedRooms,
        totalCounts,
        pages: await pagination(page, RoomModel, query, limit),
      },
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.show = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await RoomModel.findById(id);
    return res.status(200).json({
      status: "success",
      data: room,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.store = async (req, res) => {
  try {
    const { name, floor, room_type, status, amenities } = req.body;
    if (!name || !floor || !room_type) {
      return res.status(400).json({
        status: "fail",
        message: "Missing required fields",
      });
    }
    // Kiểm tra room_type
    const existingRoomType = await RoomType.findById(room_type);
    if (!existingRoomType) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid room type",
      });
    }
    // Kiểm tra status có hợp lệ không
    const validStatuses = ["clean", "occupied", "dirty", "maintenance"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid status value",
      });
    }
    // Kiểm tra danh sách amenities có hợp lệ không
    const validAmenities = await Amenity.find({ _id: { $in: amenities } });
    if (validAmenities.length !== amenities.length) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid amenities list",
      });
    }
    const room = new RoomModel({
      name,
      floor,
      room_type,
      status: status || "clean",
      amenities: validAmenities.map((a) => a._id),
    });
    await room.save();
    return res.status(200).json({
      status: "success",
      message: "Room created successfully!",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, floor, room_type, status, amenities } = req.body;
    // Kiểm tra status có hợp lệ không
    const validStatuses = ["clean", "occupied", "dirty", "maintenance"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid status value",
      });
    }
    // Kiểm tra danh sách amenities có hợp lệ không
    const validAmenities = await Amenity.find({ _id: { $in: amenities } });
    if (validAmenities.length !== amenities.length) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid amenities list",
      });
    }
    // Cập nhật thông tin phòng
    const room = new RoomModel({
      name,
      floor,
      room_type,
      status,
      amenities: validAmenities.map((a) => a._id),
    });
    await RoomModel.updateOne({ _id: id }, { $set: room });
    return res.status(200).json({
      status: "success",
      message: "Room updated successfully!",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await RoomModel.deleteOne({ _id: id });
    return res.status(200).json({
      status: "success",
      message: "Room deleted successfully!",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
