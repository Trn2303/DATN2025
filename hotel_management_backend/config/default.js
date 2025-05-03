require("dotenv").config();

module.exports = {
  app: require("./app"),
  db: require("./db"),
  mail: require("./mail"),
  vnpay: {
    "vnp_TmnCode":"7O3KZ6O3",
    "vnp_HashSecret":"WK609RB7CBA19UXXLQE59DSGQKFIOWY5",
    "vnp_Url":"https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    "vnp_Api":"https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
    "vnp_ReturnUrl": "http://localhost:8888/order/vnpay_return"
  }
};
