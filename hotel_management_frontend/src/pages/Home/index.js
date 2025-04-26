import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getRooms } from "../../services/Api";
import RoomItem from "../../shared/components/room-item";
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
  return (
    <>
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
                  {rooms.map((item, index) => (
                    <RoomItem key={index} item={item} />
                  ))}
                  <div className="col-lg-12">
                    <div className="btn-view">
                      <Link to="/rooms" className="btn-view-all">
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
                  <div className="col-lg-4 col-md-6">
                    <div className="room-item">
                      <img src="img/room/room-1.jpg" alt />
                      <div className="ri-text">
                        <h4>Premium King Room</h4>
                        <h3>
                          159$<span>/Pernight</span>
                        </h3>
                        <table>
                          <tbody>
                            <tr>
                              <td className="r-o">Loại phòng:</td>
                              <td>30 ft</td>
                            </tr>
                            <tr>
                              <td className="r-o">Tiện nghi:</td>
                              <td>Wifi, Television, Bathroom,...</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="room-item">
                      <img src="img/room/room-2.jpg" alt />
                      <div className="ri-text">
                        <h4>Deluxe Room</h4>
                        <h3>
                          159$<span>/Pernight</span>
                        </h3>
                        <table>
                          <tbody>
                            <tr>
                              <td className="r-o">Loại phòng:</td>
                              <td>30 ft</td>
                            </tr>
                            <tr>
                              <td className="r-o">Tiện nghi:</td>
                              <td>Wifi, Television, Bathroom,...</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="room-item">
                      <img src="img/room/room-3.jpg" alt />
                      <div className="ri-text">
                        <h4>Double Room</h4>
                        <h3>
                          159$<span>/Pernight</span>
                        </h3>
                        <table>
                          <tbody>
                            <tr>
                              <td className="r-o">Loại phòng:</td>
                              <td>30 ft</td>
                            </tr>
                            <tr>
                              <td className="r-o">Tiện nghi:</td>
                              <td>Wifi, Television, Bathroom,...</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="room-item">
                      <img src="img/room/room-4.jpg" alt />
                      <div className="ri-text">
                        <h4>Luxury Room</h4>
                        <h3>
                          159$<span>/Pernight</span>
                        </h3>
                        <table>
                          <tbody>
                            <tr>
                              <td className="r-o">Loại phòng:</td>
                              <td>30 ft</td>
                            </tr>
                            <tr>
                              <td className="r-o">Tiện nghi:</td>
                              <td>Wifi, Television, Bathroom,...</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="room-item">
                      <img src="img/room/room-5.jpg" alt />
                      <div className="ri-text">
                        <h4>Room With View</h4>
                        <h3>
                          159$<span>/Pernight</span>
                        </h3>
                        <table>
                          <tbody>
                            <tr>
                              <td className="r-o">Loại phòng:</td>
                              <td>30 ft</td>
                            </tr>
                            <tr>
                              <td className="r-o">Tiện nghi:</td>
                              <td>Wifi, Television, Bathroom,...</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="room-item">
                      <img src="img/room/room-6.jpg" alt />
                      <div className="ri-text">
                        <h4>Small View</h4>
                        <h3>
                          159$<span>/Pernight</span>
                        </h3>
                        <table>
                          <tbody>
                            <tr>
                              <td className="r-o">Loại phòng:</td>
                              <td>30 ft</td>
                            </tr>
                            <tr>
                              <td className="r-o">Tiện nghi:</td>
                              <td>Wifi, Television, Bathroom,...</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="btn-view">
                      <Link to="/rooms" className="btn-view-all">
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
