const OrderModel = require("../../models/order");
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
      .limit(limit);
    return res.status(200).json({
      status: "success",
      data: {
        docs: orders,
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
    const orders = await OrderModel.find({ user_id: id });
    return res.status(200).json({
      status: "success",
      data: orders,
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
    order.user_id = id;
    order.totalPrice = order.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    await new OrderModel(order).save();
    return res.status(200).json({
      status: "success",
      message: "Order created successfully",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
exports.cancelled = async (req, res) => {
  try {
    const { id } = req.params;
    await OrderModel.updateOne({ _id: id }, { $set: { status: "cancelled" } });
    return res.status(200).json({
      status: "success",
      message: "Order cancelled successfully",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
