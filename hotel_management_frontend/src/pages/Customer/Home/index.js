import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getRooms, getServices } from "../../../services/Api";
import RoomItem from "../../../shared/components/room-item";
import ServiceItem from "../../../shared/components/service-item";
import Slider from "../../../shared/components/Layout/Slider";
import Search from "../../../shared/components/search-box";
const Home = () => {
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    getRooms({
      params: {
        limit: 6,
      },
    })
      .then(({ data }) => {
        setRooms(data.data.docs);
      })
      .catch((error) => console.log(error));
  }, []);
  const [services, setServices] = useState([]);
  useEffect(() => {
    getServices({})
      .then(({ data }) => setServices(data.data.docs))
      .catch((error) => console.log(error));
  }, []);
  return (
    <>
      <Slider />
      <Search />

      <section className=" bg-light spad">
        <div className="container py-5">
          {/* Our Rooms Section */}
          <div className="mb-5">
            <div className="row">
              <div className="col-12 text-center mb-4">
                <h2 className="fw-bold">Our Rooms</h2>
              </div>
            </div>
            <div className="row">
              {rooms?.map((items, index) => (
                <RoomItem key={index} item={items} />
              ))}
              <div className="col-12 text-center mt-4">
                <div className="btn-view">
                  <Link to="/Rooms" className="btn-view-all">
                    Xem tất cả phòng <i className="bi bi-arrow-right" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Our Services Section */}
          <div>
            <div className="row">
              <div className="col-12 text-center mb-4">
                <h2 className="fw-bold">Discover Our Services</h2>
              </div>
            </div>
            <div className="row">
              {services?.map((items, index) => (
                <ServiceItem key={index} item={items} />
              ))}
              <div className="col-12 text-center mt-4">
                <div className="btn-view">
                  <Link to="/Services" className="btn-view-all">
                    Xem tất cả dịch vụ <i className="bi bi-arrow-right" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default Home;
