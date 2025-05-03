const mongoose = require("mongoose");
const OrderModel = require("../../models/order");
const BookingModel = require("../../models/booking");
const pagination = require("../../../libs/pagination");
exports.index = async (req, res) => {
  try {
    const query = {};
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const orders = await OrderModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "room_id",
        select: "name",
      })
      .lean();
    return res.status(200).json({
      status: "success",
      data: {
        docs: orders.map((order) => ({
          ...order,
          room: order.room_id ? { name: order.room_id.name } : null,
        })),
        pages: await pagination(page, OrderModel, query, limit),
      },
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
exports.getOrdersByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await OrderModel.find({ user_id: id })
      .sort({ createdAt: -1 })
      .populate("room_id", "name")
      .lean();
    return res.status(200).json({
      status: "success",
      data: {
        docs: orders.map((order) => ({
          ...order,
          room: order.room_id ? { name: order.room_id.name } : null,
        })),
        pages: await pagination(page, OrderModel, query, limit),
      },
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.show = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await OrderModel.findById(id);
    return res.status(200).json({
      status: "success",
      data: order,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
exports.store = async (req, res) => {
  try {
    const { id } = req.params;
    const order = req.body;

    if (!Array.isArray(order.items) || order.items.length === 0) {
      return res
        .status(400)
        .json({ status: "fail", message: "Danh sách dịch vụ không hợp lệ" });
    }

    const booking = await BookingModel.findOne({
      user_id: new mongoose.Types.ObjectId(id),
      status: "confirmed",
    });

    if (!booking) {
      return res.status(400).json({
        status: "fail",
        message: "Cần đặt phòng và check-in trước khi đặt dịch vụ",
      });
    }

    order.user_id = new mongoose.Types.ObjectId(id);
    order.room_id = booking.room_id;
    order.items = order.items.map((item) => ({
      service_id: new mongoose.Types.ObjectId(item.service_id),
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    order.totalPrice = order.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    order.status = "pending";

    await new OrderModel(order).save();

    return res.status(200).json({
      status: "success",
      message: "Đặt dịch vụ thành công",
    });
  } catch (error) {
    console.error("Lỗi tạo order:", error);
    res.status(500).json({ status: "error", message: "Lỗi server", error });
  }
};

exports.cancelled = async (req, res) => {
  try {
    const { id } = req.params;
    await OrderModel.updateOne({ _id: id }, { $set: { status: "cancelled" } });
    return res.status(200).json({
      status: "success",
      message: "Đã hủy đơn thành công!",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
