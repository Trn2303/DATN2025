const axios = require("axios");
const InvoiceModel = require("../../models/invoice");
const BookingModel = require("../../models/booking");
const OrderModel = require("../../models/order");

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
    "https://ce2c-14-235-27-87.ngrok-free.app/api/v1/payment-return";
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
  console.log("--------------------RAW SIGNATURE----------------");
  console.log(rawSignature);
  const crypto = require("crypto");
  var signature = crypto
    .createHmac("sha256", secretkey)
    .update(rawSignature)
    .digest("hex");
  console.log("--------------------SIGNATURE----------------");
  console.log(signature);

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

    console.log("MoMo callback raw data:", {
      accessKey,
      amount,
      extraData,
      message,
      orderId,
      orderInfo,
      orderType,
      partnerCode,
      payType,
      requestId,
      responseTime,
      resultCode,
      transId,
    });
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
    console.log("Raw Signature String:", rawSignature);
    console.log("Expected Signature:", expectedSignature);
    console.log("Received Signature:", signature);

    if (signature !== expectedSignature) {
      return res.status(400).json({ error: "Chữ ký không hợp lệ." });
    }
    const invoice = await InvoiceModel.findById(orderInfo);

    if (!invoice) {
      return res.status(404).json({ error: "Hóa đơn không tồn tại." });
    }
    if (Number(resultCode) === 0) {
      // Cập nhật trạng thái hóa đơn
      await InvoiceModel.updateOne(
        { _id: invoice._id },
        {
          $set: {
            paymentStatus: "paid",
            paymentMethod: "momo",
            transaction_id: transId,
          },
        }
      );
      await BookingModel.updateOne(
        { _id: invoice.booking_id },
        { $set: { status: "completed" } }
      );
      if (invoice.orders_id.length > 0) {
        await OrderModel.updateMany(
          { _id: { $in: invoice.orders_id } },
          { $set: { status: "completed" } }
        );
      }
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
async function payCash(req, res) {
  try {
    const { invoiceId } = req.body;

    if (!invoiceId) {
      return res.status(400).json({ error: "Thiếu mã hóa đơn." });
    }

    const invoice = await InvoiceModel.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ error: "Hóa đơn không tồn tại." });
    }

    await InvoiceModel.updateOne(
      { _id: invoice._id },
      {
        $set: {
          paymentStatus: "paid",
          paymentMethod: "cash",
          transaction_id: `CASH-${Date.now()}`,
        },
      }
    );

    await BookingModel.updateOne(
      { _id: invoice.booking_id },
      { $set: { status: "completed" } }
    );

    if (invoice.orders_id.length > 0) {
      await OrderModel.updateMany(
        { _id: { $in: invoice.orders_id } },
        { $set: { status: "completed" } }
      );
    }

    return res.status(200).json({
      status: "success",
      message: "Thanh toán tiền mặt thành công.",
    });
  } catch (error) {
    console.error("Lỗi thanh toán tiền mặt:", error);
    return res.status(500).json({ error: "Thanh toán thất bại." });
  }
}

module.exports = {
  createPayment,
  paymentCallback,
  payCash,
};
