const mongoose = require("../../common/init.mongodb")();

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, text: true, required: true },
    floor: { type: Number, required: true },
    room_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomTypes",
      required: true,
    },
    status: {
      type: String,
      enum: ["clean", "occupied", "dirty", "maintenance"],
      default: "clean",
      required: true,
    },
    amenities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Amenities" }], // Tiện ích: Wifi, Máy lạnh, TV...
    image: { type: String },
  },
  { timestamps: true }
);

const RoomModel = mongoose.model("Rooms", roomSchema, "rooms");
module.exports = RoomModel;
