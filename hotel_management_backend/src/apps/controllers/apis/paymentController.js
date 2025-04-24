const config = require("config");
exports.createPaymentUrl = (req, res) => {
  try {
    const { amount, bankCode, orderDescription, orderType, language } =
      req.body;

    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;

    const dateFormat = require("dateformat");
    const date = new Date();

    const createDate = dateFormat(date, "yyyymmddHHmmss");
    const orderId = dateFormat(date, "HHmmss");
    const locale = language || "vn";

    const vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: config.get("vnpay.vnp_TmnCode"),
      vnp_Locale: locale,
      vnp_CurrCode: "VND",
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderDescription,
      vnp_OrderType: orderType,
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: config.get("vnpay.vnp_ReturnUrl"),
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    if (bankCode) {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    // Sort & sign
    const querystring = require("qs");
    const crypto = require("crypto");
    const sorted = Object.keys(vnp_Params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = vnp_Params[key];
        return acc;
      }, {});
    const signData = querystring.stringify(sorted, { encode: false });
    const hmac = crypto.createHmac(
      "sha512",
      config.get("vnpay.vnp_HashSecret")
    );
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    sorted["vnp_SecureHash"] = signed;
    const vnpUrl =
      config.get("vnpay.vnp_Url") +
      "?" +
      querystring.stringify(sorted, { encode: false });

    return res.status(200).json({
      status: "success",
      paymentUrl: vnpUrl,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
