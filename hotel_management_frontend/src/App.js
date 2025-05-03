import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "./shared/components/Layout/Footer";
import Header from "./shared/components/Layout/Header";
import HeaderAfterLogin from "./shared/components/Layout/HeaderAfterLogin";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import RoomDetails from "./pages/RoomDetails";
import Services from "./pages/ListService";
import Rooms from "./pages/Rooms";
import RoomType from "./pages/RoomType";
import BookingService from "./pages/BookingService";
import Search from "./pages/Search/index";
import ServiceDetails from "./pages/ServiceDetails";
import BookingHistory from "./pages/BookingHistory";
import OrderHistory from "./pages/OrderHistory";
import UserInvoices from "./pages/UserInvoices";
import UserProfile from "./pages/Profile";
import Booking from "./pages/Booking";
import AdminLayout from "./shared/components/Layout/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import RoomsAdmin from "./pages/Admin/Rooms";
import RoomTypeAdmin from "./pages/Admin/RoomTypes";
import StaffManagement from "./pages/Admin/Staffs";
import ServiceAdmin from "./pages/Admin/Services_";
import BookingManagement from "./pages/Admin/Bookings";
import AmenityManagement from "./pages/Admin/Amenities";
import InvoiceManagement from "./pages/Admin/Invoices";
import PaymentSuccess from "./pages/PaymentSuccess";

const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, [location]);

  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAdminRoute) {
    return children; // Không render header/footer
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
          <Route path="/payment-success" element={<PaymentSuccess />} />
          {/* Redirects */}
          <Route path="*" element={<Navigate to="/NotFound" />} />
        </Routes>
      </LayoutWrapper>
    </BrowserRouter>
  );
};

export default App;
