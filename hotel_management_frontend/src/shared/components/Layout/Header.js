import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getRoomTypes } from "../../../services/Api";

const Header = () => {
  const location = useLocation(); // lấy đường dẫn hiện tại

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const [room_types, setRoom_types] = useState([])
  useEffect(() => {
    getRoomTypes({})
      .then(({ data }) => setRoom_types(data.data.docs))
      .catch((error) => console.log(error))
  }, []);

  return (
    <>
      <div className="header-section">
        <div className="menu-item">
          <div className="container">
            <div className="row">
              <div className="col-lg-2">
                <div className="logo">
                  <Link to="/">
                    <img src="img/logo.png" alt="Logo" />
                  </Link>
                </div>
              </div>
              <div className="col-lg-10">
                <div className="nav-menu">
                  <nav className="mainmenu">
                    <ul>
                      <li className={isActive("/")}>
                        <Link to="/">Home</Link>
                      </li>
                      <li className={isActive("/rooms")}>
                        <Link to="/Rooms">Phòng khách sạn</Link>
                      </li>
                      <li className={isActive("/services")}>
                        <Link to="/Services">Dịch vụ</Link>
                      </li>
                      <li>
                        <Link to="#">Loại phòng</Link>
                        <ul className="dropdown">
                          {
                            room_types.map((room_type, index) =>
                              <li key={index}>
                                <Link to={`/RoomTypes-${room_type._id}`}>{room_type.name}</Link>
                              </li>
                            )
                          }

                        </ul>
                      </li>
                      <li className={isActive("/search")}>
                        <Link to="/Search">Tìm kiếm</Link>
                      </li>
                    </ul>
                  </nav>
                  <div className="nav-right auth-buttons">
                    <Link to="/Login">
                      <button className="btn-login">Đăng nhập</button>
                    </Link>
                    <Link to="/Register">
                      <button className="btn-register">Đăng ký</button>
                    </Link>
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

export default Header;
