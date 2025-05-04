const axios = require("axios");
const InvoiceModel = require("../../models/invoice");
const PaymentModel = require("../../models/payment"); // Thêm dòng này

const partnerCode = "MOMO";
const accessKey = "F8BBA842ECF85";
const secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";

async function createPayment(req, res) {
  const { amount, invoiceId } = req.body;

  if (!amount || !invoiceId) {
    return res.status(400).json({ error: "Thiếu thông tin thanh toán." });
  }

  const requestId = partnerCode + new Date().getTime();
  const orderId = `${requestId}`;
  const orderInfo = `${invoiceId}`;
  const redirectUrl = "http://localhost:3000/payment-success";
  const ipnUrl =
    "https://6eda-14-235-27-87.ngrok-free.app/api/v1/payment-return";
  const requestType = "captureWallet";
  const extraData = "";

  var rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    amount +
    "&extraData=" +
    (extraData || "") +
    "&ipnUrl=" +
    ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    requestType;
  //puts raw signature
  const crypto = require("crypto");
  var signature = crypto
    .createHmac("sha256", secretkey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    accessKey: accessKey,
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    extraData: extraData,
    requestType: requestType,
    signature: signature,
    lang: "en",
  });

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

async function paymentCallback(req, res) {
  try {
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature,
    } = req.body;

    const rawSignature =
      "accessKey=" +
      accessKey +
      "&amount=" +
      amount +
      "&extraData=" +
      extraData +
      "&message=" +
      message +
      "&orderId=" +
      orderId +
      "&orderInfo=" +
      orderInfo +
      "&orderType=" +
      orderType +
      "&partnerCode=" +
      partnerCode +
      "&payType=" +
      payType +
      "&requestId=" +
      requestId +
      "&responseTime=" +
      responseTime +
      "&resultCode=" +
      resultCode +
      "&transId=" +
      transId;

    const expectedSignature = require("crypto")
      .createHmac("sha256", secretkey)
      .update(rawSignature)
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).json({ error: "Chữ ký không hợp lệ." });
    }
    const invoice = await InvoiceModel.findById(orderInfo);

    if (!invoice) {
      return res.status(404).json({ error: "Hóa đơn không tồn tại." });
    }
    if (Number(resultCode) === 0) {
      // Lưu thông tin thanh toán
      const payment = new PaymentModel({
        invoice_id: invoice._id,
        user_id: invoice.user_id,
        transaction_id: transId,
        amount,
        paymentMethod: "momo",
        status: "successful",
      });
      await payment.save();
      // Cập nhật trạng thái hóa đơn
      await InvoiceModel.updateOne(
        { _id: invoice._id },
        {
          $set: {
            paymentStatus: "paid",
            paymentMethod: "momo",
          },
        }
      );

      return res.status(200).json({ message: "Thanh toán thành công." });
    } else {
      return res
        .status(200)
        .json({ message: "Thanh toán thất bại.", resultCode });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
}

module.exports = {
  createPayment,
  paymentCallback,
};
