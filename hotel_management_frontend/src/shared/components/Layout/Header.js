import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getRoomTypes } from "../../../services/Api";

const Header = () => {
  const location = useLocation(); // lấy đường dẫn hiện tại

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const [room_types, setRoom_types] = useState([]);
  useEffect(() => {
    getRoomTypes({})
      .then(({ data }) => setRoom_types(data.data.docs))
      .catch((error) => console.log(error));
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
                    <img src="/img/logo.png" alt="Logo" />
                  </Link>
                </div>
              </div>
              <div className="col-lg-10">
                <div className="nav-menu d-flex justify-content-between align-items-center">
                  <nav className="mainmenu">
                    <ul className="navbar-nav flex-row">
                      <li className={`nav-item ${isActive("/")}`}>
                        <Link className="nav-link" to="/">
                        Trang chủ
                        </Link>
                      </li>
                      <li className={`nav-item ${isActive("/Rooms")}`}>
                        <Link className="nav-link" to="/Rooms">
                          Phòng khách sạn
                        </Link>
                      </li>
                      <li className={`nav-item ${isActive("/Services")}`}>
                        <Link className="nav-link" to="/Services">
                          Dịch vụ
                        </Link>
                      </li>
                      <li className="nav-item dropdown">
                        <Link
                          className="nav-link dropdown-toggle"
                          to="#"
                          data-bs-toggle="dropdown"
                        >
                          Loại phòng
                        </Link>
                        <ul className="dropdown-menu">
                          {room_types.map((room_type, index) => (
                            <li key={index}>
                              <Link
                                className="dropdown-item"
                                to={`/RoomType-${room_type._id}`}
                              >
                                {room_type.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                  <div className="nav-right auth-buttons">
                    <Link to="/Login">
                      <button className=" btn-login">
                        Đăng nhập
                      </button>
                    </Link>
                    <Link to="/Register">
                      <button className=" btn-register">
                        Đăng ký
                      </button>
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
