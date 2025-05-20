const BookingModel = require("../../models/booking");
const UserModel = require("../../models/user");
const RoomModel = require("../../models/room");
const AmenityModel = require("../../models/amenity");
const transporter = require("../../../libs/transporter");
const pagination = require("../../../libs/pagination");
const ejs = require("ejs");
const RoomTypeModel = require("../../models/room_type");
exports.index = async (req, res) => {
  try {
    const query = {};
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i"); // không phân biệt hoa thường
      query.$or = [
        { "room_id.name": searchRegex },
        { "room_id.floor": searchRegex },
      ];
    }

    const bookings = await BookingModel.find(query)
      .sort({
        checkInDate: -1
      })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "room_id",
        select: "_id name floor",
      })
      .lean();
    const formattedBookings = bookings.map((booking) => {
      const room = booking.room_id
        ? {
          name: booking.room_id.name,
          floor: booking.room_id.floor,
        }
        : null;
      return {
        ...booking,
        room,
        room_id: booking.room_id?._id || null,
      };
    });

    res.status(200).json({
      status: "success",
      filters: {
        status: req.query.status || null,
      },
      data: {
        docs: formattedBookings,
        pages: await pagination(page, BookingModel, query, limit),
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error" });
  }
};

exports.getBookingsByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const query = { user_id: id };

    const bookings = await BookingModel.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: "room_id",
        select: "name floor",
      })
      .lean();
    return res.status(200).json({
      status: "success",
      data: {
        docs: bookings.map((booking) => ({
          _id: booking._id,
          checkInDate: booking.checkInDate,
          checkOutDate: booking.checkOutDate,
          totalPrice: booking.totalPrice,
          status: booking.status,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt,
          room: booking.room_id
            ? {
              name: booking.room_id.name,
              floor: booking.room_id.floor,
            }
            : null,
        })),
        pages: await pagination(page, BookingModel, query, limit),
      },
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.booking = async (req, res) => {
  try {
    const { email, ...bookingData } = req.body;
    bookingData.checkInDate = new Date(bookingData.checkInDate);
    bookingData.checkOutDate = new Date(bookingData.checkOutDate);
    const user = await UserModel.findById(bookingData.user_id);
    const room = await RoomModel.findById(bookingData.room_id);
    const room_type = await RoomTypeModel.findById(room.roomTypeId);

    // Lấy danh sách amenity
    const AmenityIds = room.amenities.map((item) => item._id);
    const amenities = await AmenityModel.find({ _id: { $in: AmenityIds } });
    // Ghép tên của amenity vào danh sách
    const amenitiesList = room.amenities.map((item) => {
      const amenity = amenities.find(
        (a) => a._id.toString() === item._id.toString()
      );
      return {
        name: amenity ? amenity.name : "Unknown",
      };
    });

    const checkin = new Date(bookingData.checkInDate);
    checkin.setHours(14, 0, 0, 0);
    const checkout = new Date(bookingData.checkOutDate);
    checkout.setHours(12, 0, 0, 0);
    const numberOfNight = Math.round(((checkout - checkin) / (1000 * 60 * 60 * 24)));
    const totalPrice =
      room_type.base_price * numberOfNight;
    bookingData.totalPrice = totalPrice;
    await new BookingModel(bookingData).save();
    await RoomModel.updateOne(
      { _id: room._id },
      { $set: { status: "occupied" } }
    );
    const newBody = {
      roomName: room.name,
      checkInTime: bookingData.checkInDate.toLocaleString(),
      checkOutTime: bookingData.checkOutDate.toLocaleString(),
      amenities: amenitiesList,
      totalPrice: totalPrice,
    };
    // send mail
    const html = await ejs.renderFile(`${__dirname}/../../views/mail.ejs`, {
      newBody,
    });
    await transporter.sendMail({
      from: '"Binh Dan Hotel 💫" <binhdanhotel@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Booking Confirmation ✔️",
      html, // html body
    });
    return res.status(200).json({
      status: "success",
      message: "Đặt phòng thành công",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.show = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await BookingModel.findById(id)
      .populate({
        path: "room_id",
        select: "name floor",
      })
      .lean();
    if (!booking) {
      return res.status(404).json({
        status: "fail",
        message: "Booking not found",
      });
    }
    return res.status(200).json({
      status: "success",
      data: {
        ...booking,
        room: booking.room_id
          ? {
            name: booking.room_id.name,
            floor: booking.room_id.floor,
          }
          : null,
      },
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.checkIn = async (req, res) => {
  try {
    const { id } = req.params;
    await BookingModel.updateOne(
      { _id: id },
      { $set: { status: "confirmed" } }
    );
    return res.status(200).json({
      status: "success",
      message: "Check-in thành công",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.checkOut = async (req, res) => {
  try {
    const { id } = req.params;
    const date = new Date();
    await BookingModel.updateOne(
      { _id: id },
      { $set: { status: "completed", checkOutDate: date } }
    );
    return res.status(200).json({
      status: "success",
      message: "Check-out thành công",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.cancelled = async (req, res) => {
  try {
    const { id } = req.params;
    await BookingModel.updateOne(
      { _id: id },
      { $set: { status: "cancelled" } }
    );
    const booking = await BookingModel.findById(id);
    await RoomModel.updateOne(
      {
        _id: booking.room_id,
      },
      { $set: { status: "clean" } }
    );
    return res.status(200).json({
      status: "success",
      message: "Hủy đặt phòng thành công",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
