const mongoose = require("../../common/init.mongodb")();

const paymentSchema = new mongoose.Schema(
  {
    invoice_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoices",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    paymentMethod: {
      type: String,
      enum: ["cash", "momo", "vnpay"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "successful", "cancelled"],
      default: "pending",
    },
    transaction_id: { type: String, unique: true, required: true },
  },
  { timestamps: true }
);

const PaymentModel = mongoose.model("Payments", paymentSchema, "payments");
module.exports = PaymentModel;
