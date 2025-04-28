import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getRooms, getServices } from "../../services/Api";
import RoomItem from "../../shared/components/room-item";
import ServiceItem from "../../shared/components/service-item";
import Slider from './../../shared/components/Layout/Slider';
import Search from "../../shared/components/search-box";
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
      .catch((error) => console.log(error)
      );
  })
  return (
    <>
      <Slider />
      <Search />
      <div className="hp-room-section">
        <div className="container-fluid">
          <div className="hp-room-items">
            <div className="rooms-section spad">
              <div className="container">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="section-title">
                      <h2>Our Rooms</h2>
                    </div>
                  </div>
                </div>
                <div className="row">
                  {rooms?.map((items, index) => (
                    <RoomItem key={index} item={items} />
                  ))}
                  <div className="col-lg-12">
                    <div className="btn-view">
                      <Link to="/Rooms" className="btn-view-all">
                        Xem tất cả phòng{" "}
                        <i className="fa fa-long-arrow-right" />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="section-title">
                      <h2>Discover Our Services</h2>
                    </div>
                  </div>
                </div>
                <div className="row">
                  {services?.map((items, index) => (
                    <ServiceItem key={index} item={items} />
                  ))}

                  <div className="col-lg-12">
                    <div className="btn-view">
                      <Link to="/Services" className="btn-view-all">
                        Xem tất cả dịch vụ{" "}
                        <i className="fa fa-long-arrow-right" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
