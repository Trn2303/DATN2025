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
      .limit(limit);
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
    const { name } = req.body;
    const room = await RoomModel.findOne({ name });
    if (!room) {
      return res.status(404).json({
        status: "fail",
        message: "Room not found",
      });
    }
    const booking = await BookingModel.findOne({
      room_id: room._id,
      status: "confirmed",
    });
    if (!booking) {
      return res.status(404).json({
        status: "fail",
        message: "Booking not found",
      });
    }
    const orders = await OrderModel.find({
      room_id: room._id,
      status: "pending",
    });
    const totalService = orders.reduce(
      (total, order) => total + order.totalPrice,
      0
    );
    const totalAmount = booking.totalPrice + totalService;
    const invoice = new InvoiceModel({
      user_id: booking.user_id,
      booking_id: booking._id,
      orders_id: orders.length > 0 ? orders.map((order) => order._id) : [],
      totalAmount,
      paymentMethod: req.body.paymentMethod,
      issuedDate: new Date(),
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      paymentStatus: "pending",
    });
    await invoice.save();
    return res.status(201).json({
      status: "success",
      message: "invoice created successfully",
    });
  } catch (error) {
    return res.status(500).json(error);
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
      message: "Invoice updated successfully",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.cancelled = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await InvoiceModel.findById(id);
    if (!invoice) {
      return res.status(404).json({
        status: "fail",
        message: "Invoice not found",
      });
    }
    await InvoiceModel.updateOne(
      { _id: id },
      { $set: { status: "cancelled" } }
    );
    return res.status(200).json({
      status: "success",
      message: "Invoice cancelled successfully",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
