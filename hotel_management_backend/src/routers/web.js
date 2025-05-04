const express = require("express");
const router = express.Router();
const config = require("config");
const upload = require("../../src/apps/middlewares/upload");

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
const InvoiceController = require("../apps/controllers/apis/invoiceController");
const StatisticsController = require("../apps/controllers/apis/statisticsController");
const PaymentController = require("../apps/controllers/apis/paymentController");

// Import middleware
const AuthMiddleware = require("../apps/middlewares/authMiddleware");

// Router auth
router.post(`/login`, AuthController.login);
router.post(`/register`, AuthController.register);
router.post(
  `/logout`,
  AuthMiddleware.verifyAuthentication,
  AuthController.logout
);
router.get(`/auth/refresh-token`, AuthController.refreshToken);

// Router user
router.get(`/users/:id`, UserController.show);
router.post(`/users/:id/update`, UserController.update);

// Router booking
router.get(`/admin/bookings`, BookingController.index);
router.get(`/bookings/:id`, BookingController.show);
router.post(`/bookings`, BookingController.booking);
router.patch(`/bookings/:id/cancelled`, BookingController.cancelled);
router.patch(`/admin/bookings/:id/check-in`, BookingController.checkIn);
router.patch(`/admin/bookings/:id/check-out`, BookingController.checkOut);
router.get(`/users/:id/bookings`, BookingController.getBookingsByUser);

// Router room
router.get(`/admin/rooms`, RoomController.index);
router.get(`/rooms`, RoomController.customerIndex); // get all rooms for customer
router.get(`/rooms/:id`, RoomController.show);
router.post("/admin/rooms", upload.single("imageFile"), RoomController.store);
router.put(
  "/admin/rooms/:id/update",
  upload.single("imageFile"),
  RoomController.update
);
router.delete(`/admin/rooms/:id/delete`, RoomController.destroy);

// Router room type
router.get(`/room-types`, RoomTypeController.index);
router.get(`/room-types/:id`, RoomTypeController.show);
router.post(`/admin/room-types`, RoomTypeController.store);
router.put(`/admin/room-types/:id/update`, RoomTypeController.update);
router.delete(`/admin/room-types/:id/delete`, RoomTypeController.destroy);
router.get(`/room-types/:id/rooms`, RoomTypeController.getRoomsByType);

// Router service
router.get(`/admin/services`, ServiceController.index);
router.get(`/services`, ServiceController.getServicesByUser);
router.get(`/services/:id`, ServiceController.show); // service details
router.post(`/admin/services`, ServiceController.store);
router.put(`/admin/services/:id/update`, ServiceController.update);
router.get(`/services/:id/reviews`, ServiceController.reviews); // get reviews by service id
router.post(`/services/:id/reviews`, ServiceController.storeReviews); // create new review

// Router order
router.get(`/admin/orders`, OrderController.index);
router.get(`/users/:id/orders`, OrderController.getOrdersByUser);
router.get(`/orders/:id`, OrderController.show);
router.post(`/users/:id/orders`, OrderController.store);
router.patch(`/orders/:id/cancelled`, OrderController.cancelled);

// Router staff
router.get(`/admin/staffs`, StaffController.index);
router.get(`/admin/staffs/:id`, StaffController.show);
router.post(`/admin/staffs`, StaffController.store);
router.put(`/admin/staffs/:id/update`, StaffController.update);
router.patch(`/admin/staffs/:id/status`, StaffController.deactivate);

// Router amenity
router.get(`/admin/amenities`, AmenityController.index);
router.post(`/admin/amenities`, AmenityController.store);
router.put(`/admin/amenities/:id/update`, AmenityController.update);
router.delete(`/admin/amenities/:id/delete`, AmenityController.destroy);

// Router invoice
router.get(`/admin/invoices`, InvoiceController.index);
router.get(`/users/:id/invoices`, InvoiceController.getInvoicesByUser);
router.get(`/invoices/:id`, InvoiceController.show);
router.post(`/admin/invoices`, InvoiceController.store);
router.put(`/admin/invoices/:id/update`, InvoiceController.update);
router.patch(`/admin/invoices/:id/cancelled`, InvoiceController.cancelled);

// Router statistics
router.get(`/admin/statistics/daily`, StatisticsController.dailyReport);

// Router payment
router.post("/payment", PaymentController.createPayment);
router.post("/payment-return", PaymentController.paymentCallback);
module.exports = router;
