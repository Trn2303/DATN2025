import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./shared/components/Layout/Footer";
import Header from "./shared/components/Layout/Header";
import Slider from "./shared/components/Layout/Slider";
import Home from "./pages/Home";
import About from "./pages/About";
import RoomDetails from "./pages/RoomDetails";
import ServiceDetails from "./pages/ServiceDetails";
import Rooms from "./pages/Rooms";

const App = () => {
  return (
    <>
      <BrowserRouter>
        {/* Header Section Begin */}
        <Header />
        {/* Header End */}
        {/* Slider Begin */}
        <Slider />
        {/* Slider End */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<ServiceDetails />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/room-details" element={<RoomDetails />} />
        </Routes>
        {/* Footer Section Begin */}
        <Footer />
        {/* Footer Section End */}
      </BrowserRouter>
    </>
  );
};

export default App;
