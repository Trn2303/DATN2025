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
const StaffController = require("../apps/controllers/apis/staffController");
const AmenityController = require("../apps/controllers/apis/amenityController");

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
router.get(`/bookings`, BookingController.index);
router.get(`/bookings/:id`, BookingController.show);
router.post(`/bookings`, BookingController.booking);
router.patch(`/bookings/:id/cancelled`, BookingController.cancelled);
router.patch(`/bookings/:id/confirm`, BookingController.confirmBooking);
router.get(`/users/:id/bookings`, BookingController.getBookingsByUser);

// Router room
router.get(`/rooms`, RoomController.index);
router.get(`/rooms/:id`, RoomController.show);
router.post(`/rooms`, RoomController.store);
router.put(`/rooms/:id/update`, RoomController.update);
router.delete(`/rooms/:id/delete`, RoomController.destroy);

// Router room type
router.get(`/room-types`, RoomTypeController.index);
router.get(`/room-types/:id`, RoomTypeController.show);
router.post(`/room-types`, RoomTypeController.store);
router.put(`/room-types/:id/update`, RoomTypeController.update);
router.delete(`/room-types/:id/delete`, RoomTypeController.destroy);
router.get(`/room-types/:id/rooms`, RoomTypeController.getRoomsByType);

// Router service
router.get(`/services`, ServiceController.index);
router.get(`/services/:id`, ServiceController.show); // service details
router.get(`/services/:id/reviews`, ServiceController.reviews); // get reviews by service id
router.post(`/services/:id/reviews`, ServiceController.storeReviews); // create new review

// Router order
router.get(`/users/:id/orders`, OrderController.index);
router.get(`/orders/:id`, OrderController.show);
router.post(`/users/:id/orders`, OrderController.store);
router.patch(`/orders/:id/cancelled`, OrderController.cancelled);

// Router staff
router.get(`/staffs`, StaffController.index);
router.get(`/staffs/:id`, StaffController.show);
router.post(`/staffs`, StaffController.store);
router.put(`/staffs/:id/update`, StaffController.update);
router.patch(`/staffs/:id/status`, StaffController.deactivate);

// Router amenity
router.get(`/amenities`, AmenityController.index);
router.post(`/amenities`, AmenityController.store);
router.put(`/amenities/:id/update`, AmenityController.update);
router.delete(`/amenities/:id/delete`, AmenityController.destroy);

module.exports = router;
