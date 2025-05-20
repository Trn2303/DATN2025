import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "./shared/components/Layout/Footer";
import Header from "./shared/components/Layout/Header";
import HeaderAfterLogin from "./shared/components/Layout/HeaderAfterLogin";
import Home from "./pages/Customer/Home";
import Login from "./pages/Customer/Login";
import Register from "./pages/Customer/Register";
import About from "./pages/Customer/About";
import NotFound from "./pages/NotFound";
import RoomDetails from "./pages/Customer/RoomDetails";
import Services from "./pages/Customer/ListService";
import Rooms from "./pages/Customer/Rooms";
import RoomType from "./pages/Customer/RoomType";
import BookingService from "./pages/Customer/BookingService";
import Search from "./pages/Customer/Search/index";
import ServiceDetails from "./pages/Customer/ServiceDetails";
import BookingHistory from "./pages/Customer/BookingHistory";
import OrderHistory from "./pages/Customer/OrderHistory";
import UserInvoices from "./pages/Customer/UserInvoices";
import UserProfile from "./pages/Customer/Profile";
import Booking from "./pages/Customer/Booking";
import PaymentReturn from "./pages/Customer/PaymentReturn";
import ForgotPassword from "./pages/Customer/ForgotPassword";
import AdminLayout from "./shared/components/Layout/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import RoomsAdmin from "./pages/Admin/Rooms";
import RoomTypeAdmin from "./pages/Admin/RoomTypes";
import StaffManagement from "./pages/Admin/Staffs";
import ServiceAdmin from "./pages/Admin/Services_";
import BookingManagement from "./pages/Admin/Bookings";
import AmenityManagement from "./pages/Admin/Amenities";
import InvoiceManagement from "./pages/Admin/Invoices";
import UserManagement from "./pages/Admin/Users";

const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  // eslint-disable-next-line no-unused-vars
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, [location]);

  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAdminRoute) {
    return children;
  }

  return (
    <>
      {isLoggedIn ? <HeaderAfterLogin /> : <Header />}
      {children}
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <LayoutWrapper>
        <Routes>
          {/* Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="rooms" element={<RoomsAdmin />} />
            <Route path="room-types" element={<RoomTypeAdmin />} />
            <Route path="staffs" element={<StaffManagement />} />
            <Route path="services" element={<ServiceAdmin />} />
            <Route path="bookings" element={<BookingManagement />} />
            <Route path="amenities" element={<AmenityManagement />} />
            <Route path="invoices" element={<InvoiceManagement />} />
            <Route path="users" element={<UserManagement />} />
          </Route>

          {/* User */}
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/About" element={<About />} />
          <Route path="/NotFound" element={<NotFound />} />
          <Route path="/Search" element={<Search />} />
          <Route path="/Services" element={<Services />} />
          <Route path="/ServiceDetails-:id" element={<ServiceDetails />} />
          <Route path="/BookingService-:id" element={<BookingService />} />
          <Route path="/BookingService" element={<BookingService />} />
          <Route path="/Rooms" element={<Rooms />} />
          <Route path="/RoomType-:id" element={<RoomType />} />
          <Route path="/RoomDetails-:id" element={<RoomDetails />} />
          <Route path="/Booking-:id" element={<Booking />} />
          <Route
            path="/Users-:id/BookingHistory"
            element={<BookingHistory />}
          />
          <Route path="/Users-:id/OrderHistory" element={<OrderHistory />} />
          <Route path="/Users-:id/Invoices" element={<UserInvoices />} />
          <Route path="/Users-:id/Profile" element={<UserProfile />} />
          <Route path="/payment-return" element={<PaymentReturn />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* Redirects */}
          <Route path="*" element={<Navigate to="/NotFound" />} />
        </Routes>
      </LayoutWrapper>
    </BrowserRouter>
  );
};

export default App;
