const mongoose = require("../../common/init.mongodb")();

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    unit: { type: String, required: true }, // Đơn vị: lần, suất...ss
    status: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
      required: true,
    },
  },
  { timestamps: true }
);

const ServiceModel = mongoose.model("Services", serviceSchema, "services");
module.exports = ServiceModel;
