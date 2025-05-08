import Http from "./Http";

// Auth
export const login = (data) => Http.post("/login", data);
export const register = (data) => Http.post("/register", data);
export const logout = (data) => Http.post("/logout", data);
export const refreshToken = (config) => Http.get("/auth/refresh-token", config);

// User
export const getUser = (id, config) => Http.get(`/users/${id}`, config);
export const updateUser = (id, data) => Http.post(`/users/${id}/update`, data);
export const getAdminUser = (config) => Http.get(`/admin/users`, config);
export const deleteUser = (id) => Http.delete(`/admin/users/${id}/delete`, id);
export const updateAdminUser = (id, data) =>
  Http.post(`/admin/users/${id}/update]`, id, data);

export const forgotPassword = (data) => Http.post(`/forgot-password`, data);

// Booking
export const getBookings = (config) => Http.get("admin/bookings", config);
export const getBookingById = (id, config) =>
  Http.get(`/bookings/${id}`, config);
export const createBooking = (data) => Http.post("/bookings", data);
export const cancelBooking = (id) => Http.patch(`/bookings/${id}/cancelled`);
export const checkInBooking = (id, data) =>
  Http.patch(`/admin/bookings/${id}/check-in`, id, data);
export const checkOutBooking = (id, data) =>
  Http.patch(`/admin/bookings/${id}/check-out`, id, data);
export const getBookingsByUser = (id, config) =>
  Http.get(`/users/${id}/bookings`, config);

// Room
export const getAdminRooms = (config) => Http.get("/admin/rooms", config);
export const getRooms = (config) => Http.get("/rooms", config);
export const getRoomById = (id, config) => Http.get(`/rooms/${id}`, config);
export const createRoom = (data) =>
  Http.post("/admin/rooms", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateRoom = (id, data) =>
  Http.put(`/admin/rooms/${id}/update`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteRoom = (id) => Http.delete(`/admin/rooms/${id}/delete`);

// Room Type
export const getRoomTypes = (config) => Http.get("/room-types", config);
export const getRoomTypeById = (id, config) =>
  Http.get(`/room-types/${id}`, config);
export const createRoomType = (data) => Http.post("/admin/room-types", data);
export const updateRoomType = (id, data) =>
  Http.put(`/admin/room-types/${id}/update`, data);
export const deleteRoomType = (id) =>
  Http.delete(`/admin/room-types/${id}/delete`);
export const getRoomsRoomType = (id, config) =>
  Http.get(`/room-types/${id}/rooms`, config);

// Service
export const getServices = (config) => Http.get("/services", config);
export const getAdminServices = (config) => Http.get("/admin/services", config);
export const getServiceById = (id, config) =>
  Http.get(`/services/${id}`, config);
export const createService = (data) => Http.post("/admin/services", data);
export const updateService = (id, data) =>
  Http.put(`/admin/services/${id}/update`, data);
export const getReviewsService = (id, config) =>
  Http.get(`/services/${id}/reviews`, config);
export const createReviewService = (id, data) =>
  Http.post(`/services/${id}/reviews`, data);

// Order
export const getOrdersByUser = (id, config) =>
  Http.get(`/users/${id}/orders`, config);
export const getOrders = (config) => Http.get(`/admin/orders`, config);
export const getOrderById = (id, config) => Http.get(`/orders/${id}`, config);
export const createOrder = (id, data) => Http.post(`/users/${id}/orders`, data);
export const cancelOrder = (id, data) =>
  Http.patch(`/orders/${id}/cancelled`, data);

// Staff
export const getStaffs = (config) => Http.get("/admin/staffs", config);
export const getStaffById = (id, config) =>
  Http.get(`/admin/staffs/${id}`, config);
export const createStaff = (data) => Http.post("/admin/staffs", data);
export const updateStaff = (id, data, config) =>
  Http.put(`/admin/staffs/${id}/update`, data, config);
export const updateStaffStatus = (id, data, config) =>
  Http.patch(`/admin/staffs/${id}/status`, data, config);

// Amenity
export const getAmenities = (config) => Http.get("/admin/amenities", config);
export const createAmenity = (data) => Http.post("/admin/amenities", data);
export const updateAmenity = (id, data, config) =>
  Http.put(`/admin/amenities/${id}/update`, data, config);
export const deleteAmenity = (id, config) =>
  Http.delete(`/admin/amenities/${id}/delete`, config);

// Invoice
export const getInvoices = (config) => Http.get("/admin/invoices", config);
export const getInvoicesByUser = (id, config) =>
  Http.get(`/users/${id}/invoices`, config);
export const getInvoiceById = (id, config) =>
  Http.get(`/invoices/${id}`, config);
export const createInvoice = (data) => Http.post("/admin/invoices", data);
export const updateInvoice = (id, data) =>
  Http.put(`/admin/invoices/${id}/update`, data);

// Statistics
export const getDailyStatistics = (config) =>
  Http.get("/admin/statistics/daily", config);

// payment
export const payCash = (data) => Http.post("/paycash", data);
export const createPayment = (data) => Http.post("/payment", data);
export const momoReturn = (config) => Http.post("/payment-return", config);
