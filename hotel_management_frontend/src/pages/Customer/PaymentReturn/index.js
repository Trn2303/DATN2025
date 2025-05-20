import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentReturn = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState();

  useEffect(() => {
    const resultCode = searchParams.get("resultCode");
    if (resultCode === "0") {
      setStatus("success");
    } else {
      setStatus("failed");
    }
  }, [searchParams]);
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
    <div
      className="container text-center mt-5"
      style={{
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {status === "success" && (
        <>
          <h1 className="text-success">🎉 Thanh toán thành công!</h1>
          <p>Bạn sẽ được chuyển về trang hóa đơn trong giây lát...</p>
        </>
      )}
      {status === "failed" && (
        <>
          <h1 className="text-danger">❌ Thanh toán thất bại hoặc bị hủy!</h1>
          <p>Bạn sẽ được chuyển về trang hóa đơn trong giây lát...</p>
        </>
      )}
    </div>
  );
};

export default PaymentReturn;
