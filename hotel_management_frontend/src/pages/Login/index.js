import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../../services/Api";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [inputLogin, setInputLogin] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const changeInputLogin = (e) => {
    const { name, value } = e.target;
    setInputLogin({ ...inputLogin, [name]: value });
  };
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const clickLogin = async (e) => {
    e.preventDefault();
    const { email, password } = inputLogin;

    if (!email.trim() || !password.trim()) {
      toast.error("Vui lòng nhập đầy đủ email và mật khẩu!");
      return;
    }
    if (!isValidEmail(email)) {
      toast.error("Email không hợp lệ!");
      return;
    }
    setLoading(true);
    login(inputLogin)
      .then(({ data }) => {
        if (data.status === "success") {
          const user = data.user;
          localStorage.setItem("token", data.accessToken);
          localStorage.setItem("user", JSON.stringify(data.user));
          toast.success(data.message || "Đăng nhập thành công!");
          if (user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }
      })
      .catch((error) => {
        const errorMessage =
          error?.response?.data?.message || "Đăng nhập thất bại!";
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
        <h2 className="text-center text-white fw-bold mb-4">Đăng nhập</h2>

        <form method="post">
          <input
            type="email"
            name="email"
            className="form-control mb-3 rounded-5 py-2"
            placeholder="Email"
            value={inputLogin.email}
            onChange={changeInputLogin}
            required
          />
          <input
            type="password"
            name="password"
            className="form-control mb-3 rounded-5 py-2"
            placeholder="Mật khẩu"
            value={inputLogin.password}
            onChange={changeInputLogin}
            required
          />
          <button
            type="button"
            onClick={clickLogin}
            className="btn btn-warning w-75 fw-bold rounded-5"
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "TIẾN HÀNH ĐĂNG NHẬP"}
          </button>
        </form>
        <div className="small mt-4">
          <span
            className="text-info fw-semibold"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/forgot-password")}
          >
            Quên mật khẩu?
          </span>
        </div>

        <div className="text-white mt-4 small">
          <p className="text-white">
            Chưa có tài khoản?{" "}
            <span
              className="text-info fw-semibold"
              role="button"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/Register")}
            >
              Đăng ký tài khoản mới
            </span>
          </p>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Login;
