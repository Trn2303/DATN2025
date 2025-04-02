const mongoose = require("../../common/init.mongodb")();

const bookingSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rooms",
      required: true,
    },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    depositAmount: { 
      type: Number, 
    },
    remainingBalance: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["vnpay", "momo"],
      required: true,
    },
  },
  { timestamps: true }
);

// Middleware để tính toán depositAmount và remainingBalance
bookingSchema.pre('save', function(next) {
  if (this.isNew) {
    this.depositAmount = this.totalPrice * 0.5; // 50% của tổng tiền phòng
    this.remainingBalance = this.totalPrice - this.depositAmount; // Số tiền còn lại
  }
  next();
});

const BookingModel = mongoose.model("Bookings", bookingSchema, "bookings");
module.exports = BookingModel;
