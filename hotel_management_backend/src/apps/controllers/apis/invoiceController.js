const InvoiceModel = require("../../models/invoice");
const pagination = require("../../../libs/pagination");
const RoomModel = require("../../models/room");
const BookingModel = require("../../models/booking");
const OrderModel = require("../../models/order");

exports.index = async (req, res) => {
  try {
    const query = {};
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const invoices = await InvoiceModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user_id", "name email")
      .populate({
        path: "booking_id",
        populate: {
          path: "room_id",
          model: "Rooms",
          select: "name",
        },
      })
      .exec();
    return res.status(200).json({
      status: "success",
      data: {
        docs: invoices,
        pages: await pagination(page, InvoiceModel, query, limit),
      },
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.getInvoicesByUser = async (req, res) => {
  try {
    const query = {};
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    const { id } = req.params;
    query.user_id = id;
    const invoices = await InvoiceModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "booking_id",
        populate: {
          path: "room_id",
          model: "Rooms",
          select: "name",
        },
      })
      .populate({
        path: "orders_id",
        populate: {
          path: "items.service_id",
          model: "Services",
        },
      });
    return res.status(200).json({
      status: "success",
      data: {
        docs: invoices,
        pages: await pagination(page, InvoiceModel, query, limit),
      },
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.show = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await InvoiceModel.findById(id);
    if (!invoice) {
      return res.status(404).json({
        status: "fail",
        message: "Invoice not found",
      });
    }
    return res.status(200).json({
      status: "success",
      data: invoice,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.store = async (req, res) => {
  try {
    const { booking_id } = req.body;

    // Lấy thông tin đặt phòng
    const booking = await BookingModel.findById(booking_id).populate("room_id");

    if (!booking) {
      return res.status(404).json({
        status: "fail",
        message: "Không tìm thấy đặt phòng",
      });
    }

    const orders = await OrderModel.find({
      room_id: booking.room_id._id,
      status: "pending",
    });

    const totalService = orders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );
    const totalAmount = booking.totalPrice + totalService;

    const invoice = new InvoiceModel({
      user_id: booking.user_id,
      booking_id: booking._id,
      orders_id: orders.map((order) => order._id),
      totalAmount,
      paymentMethod: "momo",
      issuedDate: new Date(),
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      paymentStatus: "pending",
    });

    await invoice.save();

    return res.status(201).json({
      status: "success",
      message: "Hóa đơn đã được tạo thành công",
      data: invoice,
    });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await InvoiceModel.findById(id);
    if (!invoice) {
      return res.status(404).json({
        status: "fail",
        message: "Invoice not found",
      });
    }
    const invoiceUpdate = req.body;
    await InvoiceModel.updateOne({ _id: id }, { $set: invoiceUpdate });
    return res.status(200).json({
      status: "success",
      message: "Cập nhật thành công",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
