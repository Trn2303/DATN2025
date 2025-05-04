import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/Api";
import { ToastContainer, toast } from "react-toastify";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({ email: "", newPassword: "" });
  const [loading, setLoading] = useState(false);

  const changeInput = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await forgotPassword(input);
      toast.success(res.data.message || "Đặt lại mật khẩu thành công!");
      setInput({ email: "", newPassword: "" });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-background d-flex justify-content-center align-items-center vh-100">
      <div
        className="login-box p-4 rounded-4 shadow"
        style={{ minWidth: "350px" }}
      >
        <h2 className="text-center text-white fw-bold mb-4">Quên mật khẩu</h2>

        <form onSubmit={handleResetPassword}>
          <input
            type="email"
            name="email"
            className="form-control mb-3 rounded-5 py-2"
            placeholder="Email đã đăng ký"
            value={input.email}
            onChange={changeInput}
            required
          />
          <input
            type="password"
            name="newPassword"
            className="form-control mb-3 rounded-5 py-2"
            placeholder="Mật khẩu mới"
            value={input.newPassword}
            onChange={changeInput}
            required
          />
          <button
            type="submit"
            className="btn btn-warning w-75 fw-bold rounded-5"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "ĐẶT LẠI MẬT KHẨU"}
          </button>
        </form>

        <div className="text-white mt-4 small text-center">
          <span
            className="text-info fw-semibold"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Quay lại đăng nhập
          </span>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default ForgotPassword;
