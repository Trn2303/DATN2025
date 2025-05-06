import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const SidebarUser = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div
      className="sidebar-section d-flex flex-column p-3 bg-light shadow-sm"
      style={{ minHeight: "100vh" }}
    >
      <h5 className="mb-4 text-center d-flex align-items-center justify-content-center">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="Avatar"
            className="rounded-circle me-2"
            style={{ width: "40px", height: "40px" }}
          />
        ) : (
          <i
            className="bi bi-person-circle me-2"
            style={{ fontSize: "40px" }}
          ></i>
        )}
        {user?.name || "Người dùng"}
      </h5>
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link
            to={`/Users-${user?._id}/Profile`}
            className="nav-link text-dark"
          >
            <i className="bi bi-person-lines-fill me-2"></i> Thông tin cá nhân
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to={`/Users-${user?._id}/BookingHistory`}
            className="nav-link text-dark"
          >
            <i className="bi bi-buildings me-2"></i> Đơn đặt phòng
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to={`/Users-${user?._id}/OrderHistory`}
            className="nav-link text-dark"
          >
            <i className="bi bi-justify-left me-2"></i> Đơn đặt dịch vụ
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to={`/Users-${user?._id}/Invoices`}
            className="nav-link text-dark"
          >
            <i className="bi bi-receipt-cutoff me-2"></i> Hóa đơn
          </Link>
        </li>
      </ul>
    </div>
  );
};
export default SidebarUser;
