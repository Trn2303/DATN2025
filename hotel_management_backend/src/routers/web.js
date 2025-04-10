const express = require("express");
const router = express.Router();
const config = require("config");

// Import controller
const AuthController = require("../apps/controllers/apis/authController");
const BookingController = require("../apps/controllers/apis/bookingController");
const OrderController = require("../apps/controllers/apis/orderController");
const UserController = require("../apps/controllers/apis/userController");
const RoomController = require("../apps/controllers/apis/roomController");
const RoomTypeController = require("../apps/controllers/apis/roomTypeController");
const ServiceController = require("../apps/controllers/apis/serviceController");

// Import middleware
const AuthMiddleware = require("../apps/middlewares/authMiddleware");

// Router auth
router.post(`/login`, AuthController.loginCustomer);
router.post(`/register`, AuthController.registerCustomer);
router.post(`/users/:id/update`, UserController.update);
router.get(
  `/customer/test`,
  AuthMiddleware.verifyAuthenticationCustomer,
  (req, res) => {
    return res.status(200).json("pass auth");
  }
);
// router.post(`/logout`, AuthController.logoutCustomer);

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
router.get(`/users/:id/orders`, OrderController.index);
router.get(`/orders/:id`, OrderController.show);
router.patch(`/orders/:id/cancelled`, OrderController.cancelled);

module.exports = router;
