
const bookingAmounts = function (next) {
  if (this.isNew) {
    this.depositAmount = this.totalPrice * 0.5; // 50% của tổng tiền phòng
    this.remainingBalance = this.totalPrice - this.depositAmount; // Số tiền còn lại
  }
  next();
};

module.exports = bookingAmounts;
