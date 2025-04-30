import { BrowserRouter, Route, Routes } from "react-router-dom";
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

const App = () => {
  const isLoggedIn = !!localStorage.getItem("token");
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };
  return (
    <>
      <BrowserRouter>
        {/* Header Section Begin */}
        {isLoggedIn ? <HeaderAfterLogin /> : <Header />}
        {/* <HeaderAfterLogin/> */}
        {/* Header End */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Home" element={<Home />} />
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
        </Routes>
        {/* Footer Section Begin */}
        <Footer />
        {/* Footer Section End */}
      </BrowserRouter>
    </>
  );
};

export default App;
