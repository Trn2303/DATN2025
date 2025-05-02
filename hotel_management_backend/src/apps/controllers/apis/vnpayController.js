const moment = require("moment");
const querystring = require("qs");
const crypto = require("crypto");
const config = require("config");

exports.createPaymentUrl = (req, res) => {
  process.env.TZ = "Asia/Ho_Chi_Minh";

  let date = new Date();
  let createDate = moment(date).format("YYYYMMDDHHmmss");
  let orderId = moment(date).format("DDHHmmss");

  let ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket?.remoteAddress ||
    (req.connection.socket && req.connection.socket.remoteAddress) ||
    "";

  let tmnCode = config.get("vnpay.vnp_TmnCode");
  let secretKey = config.get("vnpay.vnp_HashSecret");
  let vnpUrl = config.get("vnpay.vnp_Url");
  let returnUrl = config.get("vnpay.vnp_ReturnUrl");

  let amount = parseInt(req.body.amount, 10);
  let bankCode = req.body.bankCode || "";
  let locale = req.body.language || "vn";

  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: "Thanh toan cho ma GD:" + orderId,
    vnp_OrderType: "other",
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  if (bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", config.get("vnpay.vnp_HashSecret"));
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;

  const finalUrl =
    vnpUrl + "?" + querystring.stringify(vnp_Params, { encode: true });

  res.redirect(finalUrl);
};

exports.vnpayReturn = (req, res) => {
  const querystring = require("qs");
  const crypto = require("crypto");
  const config = require("config");

  let vnp_Params = req.query;
  let secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", config.get("vnp_HashSecret"));
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    res.render("success", { code: vnp_Params["vnp_ResponseCode"] });
  } else {
    res.render("success", { code: "97" });
  }
};

// function sortObject(obj) {
//   let sorted = {};
//   let str = [];
//   let key;
//   for (key in obj) {
//     if (obj.hasOwnProperty(key)) {
//       str.push(encodeURIComponent(key));
//     }
//   }
//   str.sort();
//   for (key = 0; key < str.length; key++) {
//     sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
//   }
//   return sorted;
// }

function sortObject(obj) {
  let sorted = {};
  let keys = Object.keys(obj).sort();
  for (let key of keys) {
    sorted[key] = obj[key]; 
  }
  return sorted;
}
