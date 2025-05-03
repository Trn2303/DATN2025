const mongoose = require("../../common/init.mongodb")();
const invoiceSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    booking_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bookings",
      required: true,
    },
    orders_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "Orders" }], // Dịch vụ đã đặt
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["cash", "momo"],
      required: true,
    },
    issuedDate: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "cancelled"], 
      default: "pending",
    },
  },
  { timestamps: true }
);
const InvoiceModel = mongoose.model("Invoices", invoiceSchema, "invoices");
module.exports = InvoiceModel;
