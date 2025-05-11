import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { register } from "../../services/Api";
import { ToastContainer, toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [inputRegister, setInputRegister] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const changeInputRegister = (e) => {
    const { name, value } = e.target;
    setInputRegister({ ...inputRegister, [name]: value });
  };

  const clickRegister = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!inputRegister.name.trim()) {
      toast.error("Vui lòng nhập họ tên!");
      return;
    }
    if (!inputRegister.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại!");
      return;
    }
    if (!inputRegister.email.trim()) {
      toast.error("Vui lòng nhập email!");
      return;
    }
    if (!emailRegex.test(inputRegister.email)) {
      toast.error("Email không hợp lệ!");
      return;
    }
    if (!inputRegister.password.trim()) {
      toast.error("Vui lòng nhập mật khẩu!");
      return;
    }
    setLoading(true);
    console.log(inputRegister);
    register(inputRegister)
      .then(({ data }) => {
        if (data.status === "success") {
          toast.success(data.message || "Đăng ký thành công!");
          setTimeout(() => {
            navigate("/Login");
          }, 5000);
        }
      })
      .catch((error) => {
        const errorMessage =
          error?.response?.data?.message || "Đăng ký thất bại!";
        toast.error(errorMessage);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="login-background d-flex justify-content-center align-items-center vh-100">
      <div
        className="login-box p-4 rounded-4 shadow"
        style={{ minWidth: "350px" }}
      >
        <h2 className="text-center text-white fw-bold mb-4">Đăng ký</h2>

        <form method="post">
          <input
            type="text"
            name="name"
            className="form-control mb-3 rounded-5 py-2"
            placeholder="Họ và tên"
            value={inputRegister.name}
            onChange={changeInputRegister}
            required
          />
          <input
            type="email"
            name="email"
            className="form-control mb-3 rounded-5 py-2"
            placeholder="Email"
            value={inputRegister.email}
            onChange={changeInputRegister}
            required
          />
          <input
            type="text"
            name="phone"
            className="form-control mb-3 rounded-5 py-2"
            placeholder="Số điện thoại"
            pattern="0[0-9]{9,10}"
            title="Số điện thoại không hợp lệ"
            value={inputRegister.phone}
            onChange={changeInputRegister}
            required
          />
          <div className="input-group mb-3">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="form-control rounded-start-5"
              placeholder="Mật khẩu"
              value={inputRegister.password}
              onChange={changeInputRegister}
              required
            />
            <button
              type="button"
              className="btn btn-secondary rounded-end-5"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
            >
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
              ></i>
            </button>
          </div>
          <button
            type="button"
            onClick={clickRegister}
            className="btn btn-success w-75 fw-bold rounded-3"
            disabled={loading}
          >
            {loading ? "Đang đăng ký..." : "TẠO TÀI KHOẢN"}
          </button>
        </form>

        <div className="text-center text-white mt-4 small">
          <p className="text-white">
            Đã có tài khoản?{" "}
            <span
              className="text-info fw-semibold"
              role="button"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/Login")}
            >
              Đăng nhập ngay
            </span>
          </p>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Register;
