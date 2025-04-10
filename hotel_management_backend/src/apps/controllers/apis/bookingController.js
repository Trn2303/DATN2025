const BookingModel = require("../../models/booking");
const UserModel = require("../../models/user");
const RoomModel = require("../../models/room");
const AmenityModel = require("../../models/amenity");
const transporter = require("../../../libs/transporter");
const pagination = require("../../../libs/pagination");
const ejs = require("ejs");
exports.index = async (req, res) => {
  try {
    const query = {};
    const page = Number(req.query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;
    const bookings = await BookingModel.find(query).skip(skip).limit(limit);
    res.status(200).json({
      status: "success",
      data: {
        docs: bookings,
        pages: await pagination(page, BookingModel, query, limit),
      },
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.getBookingsByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const bookings = await BookingModel.find({ user_id: id });
    return res.status(200).json({
      status: "success",
      data: bookings,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.booking = async (req, res) => {
  try {
    const { body } = req;
    await new BookingModel(body).save();
    const user = await UserModel.findById(body.user_id);
    const room = await RoomModel.findById(body.room_id);

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
    const depositPaid = body.totalPrice * 0.5;
    const remainingBalance = body.totalPrice - depositPaid;
    const newBody = {
      roomName: room.name,
      checkInTime: new Date(body.checkInDate).toLocaleString(),
      checkOutTime: new Date(body.checkOutDate).toLocaleString(),
      amenities: amenitiesList,
      totalPrice: body.totalPrice,
      depositPaid,
      remainingBalance,
    };
    // send mail
    const html = await ejs.renderFile(`${__dirname}/../../views/mail.ejs`, {
      newBody,
    });
    await transporter.sendMail({
      from: '"Binh Dan Hotel 💫" <binhdanhotel@gmail.com>', // sender address
      to: user.email, // list of receivers
      subject: "Booking Confirmation ✔️",
      html, // html body
    });
    return res.status(200).json({
      status: "success",
      message: "Booking successfully",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.show = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await BookingModel.findById(id);
    if (!booking) {
      return res.status(404).json({
        status: "fail",
        message: "Booking not found",
      });
    }
    return res.status(200).json({
      status: "success",
      data: booking,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.confirmBooking = async (req, res) => {
  try {
    const { id } = req.params;
    await BookingModel.updateOne(
      { _id: id },
      { $set: { status: "confirmed" } }
    );
    return res.status(200).json({
      status: "success",
      message: "Booking confirmed successfully",
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
    return res.status(200).json({
      status: "success",
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
