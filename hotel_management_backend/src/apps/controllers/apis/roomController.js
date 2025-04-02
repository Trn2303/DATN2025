const RoomModel = require("../../models/room");
const pagination = require("../../../libs/pagination");
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

    res.status(200).json({
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
    res.status(500).json(error);
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
