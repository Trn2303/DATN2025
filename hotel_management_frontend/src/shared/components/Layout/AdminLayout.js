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
  { label: "Người dùng", path: "/admin/users" },
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
  const allowedMenuItems =
    user?.role === "staff"
      ? menuItems.filter((item) =>
          ["/admin", "/admin/bookings", "/admin/invoices"].includes(item.path)
        )
      : menuItems;

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        {/* Sidebar */}
        <nav
          className="col-md-2 bg-dark text-white d-flex flex-column p-3 position-fixed min-vh-100"
          style={{ left: 0, top: 0 }}
        >
          <h4 className="text-center mb-4">Binh Dan Hotel</h4>
          <ul className="nav flex-column mb-auto">
            {allowedMenuItems.map((item) => (
              <li className="nav-item" key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link mb-2 ${
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
          <div className="mt-auto">
            <button
              onClick={clickLogout}
              className="btn btn-outline-light w-100"
            >
              Đăng xuất
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="offset-md-2 col-md-10 ms-sm-auto px-md-4 py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
