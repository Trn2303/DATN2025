const express = require("express");
const router = express.Router();
const config = require("config");

// Import controller
// const AuthController = require(__dirname + "/../apps/controllers/apis/authController");
const BookingController = require(__dirname + "/../apps/controllers/apis/bookingController");
// const OrderController = require(__dirname + "/../apps/controllers/apis/orderController");
// const UserController = require(__dirname + "/../apps/controllers/apis/userController");
const RoomController = require(__dirname + "/../apps/controllers/apis/roomController");
const RoomTypeController = require(__dirname + "/../apps/controllers/apis/roomTypeController");
const ServiceController = require(__dirname + "/../apps/controllers/apis/serviceController");

// Router booking
router.post(`/booking`, BookingController.booking);


// Router room
router.get(`/rooms`, RoomController.index);
router.get(`/rooms/:id`, RoomController.show);
// router.post(`/rooms`, RoomController.create);
// router.put(`/rooms/:id`, RoomController.update);
// router.delete(`/rooms/:id`, RoomController.delete);

// Router room type
router.get(`/room-types`, RoomTypeController.index);
router.get(`/room-types/:id`, RoomTypeController.show);
router.get(`/room-types/:id/rooms`, RoomTypeController.getRoomsByType);

// Router service
router.get(`/services`, ServiceController.index);
router.get(`/services/:id`, ServiceController.show); // service details
router.get(`/services/:id/reviews`, ServiceController.reviews); // get reviews by service id
router.post(`/services/:id/reviews`, ServiceController.storeReviews); // create new review

// Router order
// router.post(`/order`, OrderController.order);

// router.get(`/users`, UserController.index);

module.exports = router;
