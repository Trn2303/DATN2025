const mongoose = require("../../common/init.mongodb")();

const amenitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const AmenitiesModel = mongoose.model("Amenities", amenitySchema, "amenities");
module.exports = AmenitiesModel;