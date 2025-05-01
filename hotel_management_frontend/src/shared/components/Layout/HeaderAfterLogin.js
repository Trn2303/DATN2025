import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getRoomTypes, logout } from "../../../services/Api";

const HeaderLogin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => (location.pathname === path ? "active" : "");

  const [room_types, setRoom_types] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    getRoomTypes({})
      .then(({ data }) => setRoom_types(data.data.docs))
      .catch((error) => console.log(error));
  }, []);

  const clickLogout = async () => {
    try {
      await logout(user);
    } catch (e) {
      console.error("Logout failed:", e);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

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
                          {room_types.map((room_type, index) => (
                            <li key={index}>
                              <Link to={`/RoomType-${room_type._id}`}>
                                {room_type.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                  <div className="nav-right dropdown">
                    <button
                      className="btn btn-light rounded-pill dropdown-toggle  "
                      type="button"
                      id="userDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i class="bi bi-person"></i> {user?.name || "Tài khoản"}
                    </button>
                    <ul
                      className="dropdown-menu dropdown-menu-end shadow-sm"
                      aria-labelledby="userDropdown"
                    >
                      <li>
                        <Link className="dropdown-item" to={`/Users-${user?._id}/Profile`}>
                        <i className="bi bi-person-lines-fill"></i> Thông tin cá nhân
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to={`/Users-${user?._id}/BookingHistory`}>
                        <i className="bi bi-buildings"></i> Đơn đặt phòng
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to={`/Users-${user?._id}/OrderHistory`}>
                        <i className="bi bi-justify-left"></i> Đơn đặt dịch vụ
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to={`/Users-${user?._id}/Invoices`}>
                        <i className="bi bi-receipt-cutoff"></i> Hóa đơn
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={clickLogout}
                        >
                          <i className="bi bi-box-arrow-left"></i> Đăng xuất
                        </button>
                      </li>
                    </ul>
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

export default HeaderLogin;
