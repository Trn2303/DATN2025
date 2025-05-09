const RoomModel = require("../../models/room");
const RoomTypeModel = require("../../models/room_type");
const BookingModel = require("../../models/booking");
const pagination = require("../../../libs/pagination");
const Amenity = require("../../models/amenity");
exports.index = async (req, res) => {
  try {
    const query = {};
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 4;
    // lấy danh sách phòng
    const rooms = await RoomModel.find(query)
      .sort({ updatedAt: -1 })
      .populate([
        { path: "roomTypeId", select: "name base_price" },
        { path: "amenities", select: "name" },
      ]);

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
exports.customerIndex = async (req, res) => {
  try {
    const { checkIn, checkOut, roomTypeId } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    const query = {};
    let bookedRoomIds = [];

    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      bookedRoomIds = await BookingModel.find({
        status: { $in: ["pending", "confirmed"] },
        checkInDate: { $lt: checkOutDate },
        checkOutDate: { $gt: checkInDate },
      }).distinct("room_id");

      query.$and = [
        { status: "clean" },
        { _id: { $nin: bookedRoomIds } }, // loại trừ phòng đã đặt
      ];
    } else {
      query.status = "clean";
    }

    if (roomTypeId) {
      query.roomTypeId = roomTypeId;
    }

    const totalRows = await RoomModel.countDocuments(query);
    const totalPages = Math.ceil(totalRows / limit);

    const rooms = await RoomModel.find(query)
      .skip(skip)
      .limit(limit)
      .populate([
        { path: "roomTypeId", select: "name base_price" },
        { path: "amenities", select: "name" },
      ]);

    return res.status(200).json({
      status: "success",
      data: {
        docs: rooms.map((room) => ({
          _id: room._id,
          name: room.name,
          floor: room.floor,
          room_type: room.roomTypeId
            ? {
                name: room.roomTypeId.name,
                base_price: room.roomTypeId.base_price,
              }
            : null,
          image: room.image,
          status: room.status,
          amenities: (room.amenities || []).map((a) => ({ name: a.name })),
          createdAt: room.createdAt,
          updatedAt: room.updatedAt,
        })),
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
    const room = await RoomModel.findById(id).populate([
      { path: "roomTypeId", select: "name base_price description" },
      { path: "amenities", select: "name" },
    ]);
    return res.status(200).json({
      status: "success",
      data: {
        _id: room._id,
        name: room.name,
        floor: room.floor,
        room_type: room.roomTypeId
          ? {
              name: room.roomTypeId.name,
              base_price: room.roomTypeId.base_price,
              description: room.roomTypeId.description,
            }
          : null,
        image: room.image,
        status: room.status,
        amenities: (room.amenities || []).map((amenity) => ({
          name: amenity.name,
        })),
        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
      },
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.store = async (req, res) => {
  try {
    const { name, floor, room_type, status } = req.body;
    const image = req.file?.filename || null;
    let amenities = req.body.amenities;

    if (typeof amenities === "string") {
      try {
        amenities = JSON.parse(amenities);
      } catch {
        return res.status(400).json({
          status: "fail",
          message: "Invalid amenities format",
        });
      }
    }

    if (!name || !floor || !room_type) {
      return res.status(400).json({
        status: "fail",
        message: "Missing required fields",
      });
    }

    const floorNumber = Number(floor);
    if (isNaN(floorNumber)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid floor value",
      });
    }

    const existingRoomType = await RoomTypeModel.findById(room_type);
    if (!existingRoomType) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid room type",
      });
    }

    const validStatuses = ["clean", "occupied", "dirty", "maintenance"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid status value",
      });
    }

    const validAmenities = await Amenity.find({ _id: { $in: amenities } });
    if (validAmenities.length !== amenities.length) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid amenities list",
      });
    }

    const room = new RoomModel({
      name,
      floor: floorNumber,
      roomTypeId: room_type,
      status,
      amenities: validAmenities.map((a) => a._id),
      image,
    });

    await room.save();

    return res.status(200).json({
      status: "success",
      message: "Tạo phòng thành công!",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Đã xảy ra lỗi khi tạo phòng",
      error: error.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, floor, room_type, status } = req.body;
    const image = req.file?.filename || req.body.imageFile || null;

    let amenities = req.body.amenities;
    if (typeof amenities === "string") {
      try {
        amenities = JSON.parse(amenities);
      } catch {
        return res.status(400).json({
          status: "fail",
          message: "Invalid amenities format",
        });
      }
    }

    const floorNumber = Number(floor);
    if (isNaN(floorNumber)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid floor value",
      });
    }

    const validStatuses = ["clean", "occupied", "dirty", "maintenance"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid status value",
      });
    }

    const validAmenities = await Amenity.find({ _id: { $in: amenities } });
    if (validAmenities.length !== amenities.length) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid amenities list",
      });
    }

    const updatedRoom = {
      name,
      floor: floorNumber,
      roomTypeId: room_type,
      status,
      amenities: validAmenities.map((a) => a._id),
    };

    if (image) updatedRoom.image = image;

    await RoomModel.updateOne({ _id: id }, { $set: updatedRoom });

    return res.status(200).json({
      status: "success",
      message: "Cập nhật phòng thành công!",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Đã xảy ra lỗi khi cập nhật phòng",
      error: error.message,
    });
  }
};

exports.destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await RoomModel.findById(id);
    if (room.status === "occupied") {
      return res.status(400).json({
        status: "fail",
        message: "Phòng đang có khách!",
      });
    }
    await RoomModel.deleteOne({ _id: id });
    return res.status(200).json({
      status: "success",
      message: "Xóa phòng thành công!",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
