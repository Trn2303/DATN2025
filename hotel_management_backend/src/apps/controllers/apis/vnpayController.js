const moment = require("moment");
const querystring = require("qs");
const crypto = require("crypto");
const config = require("../../../../config/vnpay");

exports.createPaymentUrl = (req, res) => {
  const ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const tmnCode = config.vnp_TmnCode;
  const secretKey = config.vnp_HashSecret;
  const vnpUrl = config.vnp_Url;
  const returnUrl = config.vnp_ReturnUrl;

  const date = new Date();
  const createDate = moment(date).format("YYYYMMDDHHmmss");

  const orderId = moment(date).format("HHmmss");
  const amount = req.body.amount;
  const bankCode = req.body.bankCode;

  const orderInfo = "Thanh toan don hang";
  const locale = req.body.language || "vn";
  const currCode = "VND";

  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: currCode,
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: "other",
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  if (bankCode) {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  vnp_Params["vnp_SecureHash"] = signed;
  const paymentUrl = `${vnpUrl}?${querystring.stringify(vnp_Params, { encode: true })}`;

  res.status(200).json({
    status: "success",
    paymentUrl,
  });
};

exports.vnpayReturn = (req, res) => {
  let vnp_Params = req.query;
  const secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);
  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", config.vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    res.redirect(`/payment-result?code=00`);
  } else {
    res.redirect(`/payment-result?code=97`);
  }
};

function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach((key) => (sorted[key] = obj[key]));
  return sorted;
}
