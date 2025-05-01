import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
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

const App = () => {
  const HeaderWrapper = () => {
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(
      !!localStorage.getItem("token")
    );

    useEffect(() => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    }, [location]);

    return isLoggedIn ? <HeaderAfterLogin /> : <Header />;
  };
  return (
    <>
      <BrowserRouter>
        {/* Header Section Begin */}
        <HeaderWrapper />
        {/* Header End */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/About" element={<About />} />
          <Route path="/NotFound" element={<NotFound />} />
          <Route path="/Search" element={<Search />} />
          <Route path="/Services" element={<Services />} />
          <Route path="/ServiceDetails-:id" element={<ServiceDetails />} />
          <Route path="/Rooms" element={<Rooms />} />
          <Route path="/RoomType-:id" element={<RoomType />} />
          <Route path="/RoomDetails-:id" element={<RoomDetails />} />
          <Route path="/BookingService-:id" element={<BookingService />} />
          <Route path="/Users-:id/BookingHistory" element={<BookingHistory />} />
          <Route path="/Users-:id/OrderHistory" element={<OrderHistory />} />
          <Route path="/Users-:id/Invoices" element={<UserInvoices />} />
          <Route path="/Users-:id/Profile" element={<UserProfile />} />
        </Routes>
        {/* Footer Section Begin */}
        <Footer />
        {/* Footer Section End */}
      </BrowserRouter>
    </>
  );
};

export default App;
