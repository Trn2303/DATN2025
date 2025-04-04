const BookingModel = require("../../models/booking");
const UserModel = require("../../models/user");
const RoomModel = require("../../models/room");
const AmenityModel = require("../../models/amenity");
const transporter = require("../../../libs/transporter");
const ejs = require("ejs");
exports.index = (req, res) => {
  res.send("Booking Index");
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
        (a) => a._id.toString() === String(item._id)
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
    })
  } catch (error) {
    res.status(500).json(error);
  }
};
