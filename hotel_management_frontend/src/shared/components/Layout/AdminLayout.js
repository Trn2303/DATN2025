import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../../services/Api";

const menuItems = [
  { label: "Thống kê", path: "/admin" },
  { label: "Quản lý đặt phòng", path: "/admin/bookings" },
  { label: "Phòng", path: "/admin/rooms" },
  { label: "Loại phòng", path: "/admin/room-types" },
  { label: "Dịch vụ", path: "/admin/services" },
  { label: "Nhân viên", path: "/admin/staffs" },
  { label: "Tiện nghi", path: "/admin/amenities" },
  { label: "Hóa đơn", path: "/admin/invoices" },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
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
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <nav className="col-md-2 d-none d-md-block sidebar ">
          <div className="sidebar-sticky pt-3 text-white">
            <h4 className="text-center text-white mb-4">Binh Dan Hotel</h4>
            <ul className="nav flex-column">
              {menuItems.map((item) => (
                <li className="nav-item" key={item.path}>
                  <Link
                    to={item.path}
                    className={`nav-link ${
                      location.pathname === item.path
                        ? "active text-white bg-secondary"
                        : "text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-auto p-3">
            <button
              onClick={clickLogout}
              className="btn btn-outline-light w-100"
            >
              Đăng xuất
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="col-md-10 ms-sm-auto col-lg-10 px-md-4 py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;
