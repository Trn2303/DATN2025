import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation(); // lấy đường dẫn hiện tại

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
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
                        <Link to="/rooms">Phòng khách sạn</Link>
                      </li>
                      <li className={isActive("/services")}>
                        <Link to="/services">Dịch vụ</Link>
                      </li>
                      <li>
                        <Link to="#">Loại phòng</Link>
                        <ul className="dropdown">
                          <li>
                            <Link to="#">Single Room</Link>
                          </li>
                          <li>
                            <Link to="#">Double Room</Link>
                          </li>
                          <li>
                            <Link to="#">Family Room</Link>
                          </li>
                          <li>
                            <Link to="#">Twin Room</Link>
                          </li>
                        </ul>
                      </li>
                      <li className={isActive("/search")}>
                        <Link to="/search">Tìm kiếm</Link>
                      </li>
                    </ul>
                  </nav>
                  <div className="nav-right auth-buttons">
                    <Link to="/login">
                      <button className="btn-login">Đăng nhập</button>
                    </Link>
                    <Link to="/register">
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
