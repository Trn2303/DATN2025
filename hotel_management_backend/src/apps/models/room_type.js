const mongoose = require("../../common/init.mongodb")();

const roomTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  base_price: { type: Number, required: true },
});

const RoomTypeModel = mongoose.model("RoomTypes", roomTypeSchema, "room_types");
module.exports = RoomTypeModel;
