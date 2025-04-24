const InvoiceModel = require("../../models/invoice");
const BookingModel = require("../../models/booking");

exports.dailyReport = async (req, res) => {
  try {
    const today = new Date().setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const countCheckIn = BookingModel.countDocuments({
      checkInDate: { $gte: today, $lt: tomorrow },
    });
    const countCheckOut = BookingModel.countDocuments({
      checkOutDate: { $gte: today, $lt: tomorrow },
    });
    const getIncomeForDay = async (day) => {
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - day);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1);
      const invoices = await InvoiceModel.find({
        updatedAt: { $gte: startDate, $lt: endDate },
        status: "paid",
      });
      return invoices.reduce((total, invoice) => total + invoice.totalPrice, 0);
    };
    const incomeToday = await getIncomeForDay(0);
    const incomeYesterday = await getIncomeForDay(1);
    const incomeTwoDaysAgo = await getIncomeForDay(2);
    const incomeThreeDaysAgo = await getIncomeForDay(3);
    return res.status(200).json({
      status: "success",
      data: {
        countCheckIn,
        countCheckOut,
        incomeToday,
        incomeYesterday,
        incomeTwoDaysAgo,
        incomeThreeDaysAgo,
      },
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
