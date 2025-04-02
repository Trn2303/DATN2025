const express = require("express");
const router = express.Router();
const config = require("config");

// Import controller
const AuthController = require(__dirname + "/../apps/controllers/apis/authController");
const BookingController = require(__dirname + "/../apps/controllers/apis/bookingController");
const RoomController = require(__dirname + "/../apps/controllers/apis/roomController");
const UserController = require(__dirname + "/../apps/controllers/apis/userController");
const RoomTypeController = require(__dirname + "/../apps/controllers/apis/roomTypeController");
const ServiceController = require(__dirname + "/../apps/controllers/apis/serviceController");
const OrderController = require(__dirname + "/../apps/controllers/apis/orderController");


// Router room
router.get(`/rooms`, RoomController.index);
router.get(`/rooms/:id`, RoomController.show);

// Router room type
router.get(`/room-types`, RoomTypeController.index);
router.get(`/room-types/:id`, RoomTypeController.show);
router.get(`/room-types/:id/rooms`, RoomTypeController.getRoomsByType);


module.exports = router;
