import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const userId = user?._id;

    const redirectToInvoices = () => {
      if (userId) {
        navigate(`/Users-${userId}/Invoices`);
      } else {
        navigate("/");
      }
    };

    const timer = setTimeout(redirectToInvoices, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container text-center mt-5">
      <h1 className="text-success">🎉 Thanh toán thành công!</h1>
      <p>Bạn sẽ được chuyển về trang hóa đơn trong giây lát...</p>
    </div>
  );
};

export default PaymentSuccess;
