import { useState, useEffect } from "react";
import SidebarUser from "../../shared/components/Layout/SidebarUser";
import { toast, ToastContainer } from "react-toastify";
import { updateUser } from "../../services/Api";
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState({
    _id: "",
    name: "",
    email: "",
    phone: "",
    role: "",
    updatedAt: "",
  });

  useEffect(() => {
    try {
      const userString = localStorage.getItem("user");
      if (userString) {
        const user = JSON.parse(userString);
        setUserInfo({
          _id: user._id || "",
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          role: user.role || "",
          updatedAt: user.updatedAt || "",
        });
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      toast.error("Lỗi khi tải thông tin người dùng");
    }
  }, []);

  const changeInfo = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };
  const clickUpdate = () => {
    console.log(userInfo);
    updateUser(id, { name: userInfo.name, phone: userInfo.phone })
      .then(({ data }) => {
        if (data.status === "success") {
          const updatedUser = {
            ...data.data,
            updatedAt: new Date().toISOString(),
          };

          try {
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUserInfo(updatedUser);
            toast.success("Cập nhật thông tin thành công!");
            window.location.reload();
          } catch (err) {
            console.log("Failed to update localStorage:", err);
          }
        } else {
          toast.error("Không thể cập nhật thông tin: " + data.message);
        }
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        toast.error("Có lỗi xảy ra khi cập nhật thông tin");
      });
  };
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-3">
          <SidebarUser />
        </div>
        <div className="col-md-9">
          <h2 className="mb-4">Thông tin cá nhân</h2>
          <hr className="bg-secondary" />
          <form method="post">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Họ và tên
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={userInfo.name}
                onChange={changeInfo}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={userInfo.email}
                disabled
              />
            </div>

            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Số điện thoại
              </label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                name="phone"
                value={userInfo.phone}
                onChange={changeInfo}
                required
              />
            </div>

            <button
              onClick={clickUpdate}
              type="button"
              className="btn btn-success"
            >
              Cập nhật thông tin
            </button>
          </form>
          <ToastContainer position="bottom-right" />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
