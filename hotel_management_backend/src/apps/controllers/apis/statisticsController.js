const InvoiceModel = require("../../models/invoice");
const BookingModel = require("../../models/booking");
const RoomModel = require("../../models/room");

exports.dailyReport = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const countCheckIn = await BookingModel.countDocuments({
      checkInDate: { $gte: today, $lt: tomorrow },
      status: "confirmed",
    });
    const countCheckOut = await BookingModel.countDocuments({
      checkOutDate: { $gte: today, $lt: tomorrow },
      status: "completed",
    });
    // Tính doanh thu mỗi ngày
    const getIncomeForDay = async (day) => {
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - day);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1);

      const invoices = await InvoiceModel.find({
        paymentDate: { $gte: startDate, $lt: endDate },
        status: "paid",
      });

      const total = invoices.reduce((sum, p) => sum + p.totalAmount, 0);
      return total;
    };
    // Khách đang lưu trú
    const stayingGuests = await BookingModel.countDocuments({
      status: "confirmed",
    });
    // booking của ngày hôm nay
    const bookingsToday = await BookingModel.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    });
    // Phòng còn trống
    const emptyRooms = await RoomModel.countDocuments({
      status: "clean",
    });
    const incomeLast7Days = [];
    const last7DaysLabels = [];
    for (let i = 6; i >= 0; i--) {
      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() - i);
      const label = `${startDate.getDate().toString().padStart(2, "0")}/${(
        startDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}`;
      last7DaysLabels.push(label);
      incomeLast7Days.push(await getIncomeForDay(i));
    }
    return res.status(200).json({
      status: "success",
      data: {
        countCheckIn,
        countCheckOut,
        incomeLast7Days,
        last7DaysLabels,
        emptyRooms,
        stayingGuests,
        bookingsToday,
      },
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
