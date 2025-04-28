import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./shared/components/Layout/Footer";
import Header from "./shared/components/Layout/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import RoomDetails from "./pages/RoomDetails";
import Services from "./pages/ListService";
import Rooms from "./pages/Rooms";
import BookingService from "./pages/BookingService";
import Search from './pages/Search/index';
import ServiceDetails from "./pages/ServiceDetails";

const App = () => {
  return (
    <>
      <BrowserRouter>
        {/* Header Section Begin */}
        <Header />
        {/* Header End */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<About />} />
          <Route path="/Search" element={<Search />} />
          <Route path="/Services" element={<Services />} />
          <Route path="/ServiceDetails-:id" element={<ServiceDetails />} />
          <Route path="/Rooms" element={<Rooms />} />
          <Route path="/RoomTypes-:id" element={<Rooms />} />
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
