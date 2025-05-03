const crypto = require("crypto");
const axios = require("axios");
const InvoiceModel = require("../../models/invoice");

async function createPayment(req, res) {
  const { amount, invoiceId } = req.body;

  if (!amount || !invoiceId) {
    return res.status(400).json({ error: "Thiếu thông tin thanh toán." });
  }

  const partnerCode = "MOMO";
  const accessKey = "F8BBA842ECF85";
  const secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
  const requestId = partnerCode + new Date().getTime();
  const orderId = invoiceId + "_" + requestId;
  const orderInfo = `Thanh toán hóa đơn ${invoiceId}`;
  const redirectUrl = "http://localhost:3000/payment-success";
  const ipnUrl = "https://localhost:8000/api/v1/payment-return";
  const requestType = "captureWallet";
  const extraData = "";

  const rawSignature =
    `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}` +
    `&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}` +
    `&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

  const signature = crypto
    .createHmac("sha256", secretkey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = {
    partnerCode,
    accessKey,
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    extraData,
    requestType,
    signature,
    lang: "vi",
  };

  try {
    const response = await axios.post(
      "https://test-payment.momo.vn/v2/gateway/api/create",
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(201).json({ paymentUrl: response.data.payUrl });
  } catch (error) {
    console.error("MoMo payment error:", error.response?.data || error.message);
    return res
      .status(500)
      .json({ error: "Không thể tạo liên kết thanh toán." });
  }
}

function generateSignatureFromObject(obj, secretKey) {
  const sortedKeys = Object.keys(obj).sort();
  const rawData = sortedKeys
    .filter((key) => key !== "signature")
    .map((key) => `${key}=${obj[key]}`)
    .join("&");

  return crypto.createHmac("sha256", secretKey).update(rawData).digest("hex");
}

async function paymentCallback(req, res) {
  const data = req.body;

  console.log("MoMo callback data:", data);

  // Xác thực chữ ký
  const generatedSignature = generateSignatureFromObject(data, secretkey);
  if (generatedSignature !== data.signature) {
    console.error("Invalid signature");
    return res.status(400).json({ error: "Chữ ký không hợp lệ." });
  }

  const resultCode = data.resultCode;
  const orderId = data.orderId;
  const invoiceId = orderId.split("_")[0];

  try {
    const invoice = await InvoiceModel.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ error: "Không tìm thấy hóa đơn." });
    }

    // Nếu thanh toán thành công
    if (resultCode === 0) {
      invoice.paymentStatus = "paid";
      invoice.paymentMethod = "momo";
      await invoice.save();
      return res
        .status(200)
        .json({ message: "Cập nhật trạng thái thanh toán thành công." });
    } else {
      return res
        .status(200)
        .json({ message: "Thanh toán thất bại hoặc bị hủy." });
    }
  } catch (err) {
    console.error("Lỗi xử lý callback:", err);
    return res.status(500).json({ error: "Lỗi máy chủ." });
  }
}

module.exports = {
  createPayment,
  paymentCallback,
};
