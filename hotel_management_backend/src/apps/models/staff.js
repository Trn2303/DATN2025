const mongoose = require("../../common/init.mongodb")();

const staffSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    position: { type: String, required: true },
    address: { type: String, required: true },
    salary: { type: Number, required: true, min: 5000000 },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

const StaffModel = mongoose.model("Staffs", staffSchema, "staffs");
module.exports = StaffModel;
