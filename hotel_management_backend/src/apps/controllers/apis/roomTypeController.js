const RoomTypeModel = require("../../models/room_type");
const RoomModel = require("../../models/room");
const pagination = require("../../../libs/pagination");

exports.index = async (req, res) => {
  try {
    const query = {};
    const room_type = await RoomTypeModel.find();
    return res.status(200).json({
      status: "success",
      data: {
        docs: room_type,
      },
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.show = async (req, res) => {
  try {
    const { id } = req.params;
    const room_type = await RoomTypeModel.findById(id);
    return res.status(200).json({
      status: "success",
      data: {
        docs: room_type,
      },
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.store = async (req, res) => {
  try {
    const { name, description, base_price } = req.body;
    const room_type = new RoomTypeModel({
      name: name,
      description,
      base_price,
    });
    await room_type.save();
    return res.status(200).json({
      status: "success",
      message: "Create room type successfully",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, base_price } = req.body;
    const room_type = new RoomTypeModel({
      name,
      description,
      base_price,
    });
    await RoomTypeModel.updateOne({ _id: id }, room_type);
    return res.status(200).json({
      status: "success",
      message: "Update room type successfully",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.destroy = async (req, res) => {
  try {
    const { id } = req.params;
    await RoomTypeModel.deleteOne({ _id: id });
    return res.status(200).json({
      status: "success",
      message: "Delete room type successfully",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.getRoomsByType = async (req, res) => {
  try {
    const { id } = req.params;
    const query = {};
    query.room_type = id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const rooms = await RoomModel.find(query).skip(skip).limit(limit);
    return res.status(200).json({
      status: "success",
      filters: {
        page,
        limit,
        room_type: id,
      },
      data: {
        docs: rooms,
        pagination: await pagination(page, RoomModel, query, limit),
      },
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
