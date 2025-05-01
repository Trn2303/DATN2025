import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SidebarUser from "../../shared/components/Layout/SidebarUser";
import { getInvoicesByUser } from "../../services/Api"; // Giả sử API gọi tên này
import { ToastContainer } from "react-toastify";

const UserInvoices = () => {
  const { id } = useParams();
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    getInvoicesByUser(id, {})
      .then(({ data }) => {
        if (data.status === "success") {
          setInvoices(data.data.docs);
        }
      })
      .catch((error) => console.log(error));
  }, [id]);
  const clickPay = (invoiceId) => {
    
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-3">
          <SidebarUser />
        </div>
        <div className="col-md-9">
          <h2 className="mb-4">Hóa đơn</h2>
          <hr className="bg-secondary" />
          <ul className="list-group">
            {invoices.length > 0 ? (
              invoices.map((invoice, index) => {
                let badgeClass = "";
                let icon = "";

                switch (invoice.paymentStatus) {
                  case "paid":
                    badgeClass = "bg-success";
                    icon = "bi bi-check-circle";
                    break;
                  case "pending":
                    badgeClass = "bg-warning";
                    icon = "bi bi-hourglass-split";
                    break;
                  default:
                    badgeClass = "bg-secondary";
                    icon = "bi bi-question-circle";
                }

                return (
                  <li key={index} className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className={`badge ${badgeClass} text-dark`}>
                        {invoice.paymentStatus} <i className={icon}></i>
                      </span>
                      <span>
                        <strong>Phương thức:</strong>{" "}
                        {invoice.paymentMethod.toUpperCase()}
                      </span>
                    </div>

                    <div className="mt-2">
                      <strong>Ngày xuất:</strong>{" "}
                      {new Date(invoice.issuedDate).toLocaleDateString()} <br />
                      <strong>Hạn thanh toán:</strong>{" "}
                      {new Date(invoice.dueDate).toLocaleDateString()} <br />
                      <strong>Tổng tiền:</strong>{" "}
                      {invoice.totalAmount.toLocaleString()} ₫ <br />
                    </div>

                    {invoice.orders_id?.length > 0 && (
                      <div className="mt-2">
                        <strong>Dịch vụ:</strong>
                        <ul className="mb-0">
                          {invoice.orders_id.map((order, idx) => (
                            <li key={idx}>
                              {order.items?.map((item) => (
                                <div key={item._id}>
                                  {item.name} - SL: {item.quantity}
                                </div>
                              ))}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <br />
                    {invoice.status !== "paid" && (
                      <button
                        className="btn btn-danger btn-sm mt-2"
                        onClick={() => clickPay(invoice._id)}
                      >
                        Thanh toán
                      </button>
                    )}
                  </li>
                );
              })
            ) : (
              <p>Không có hóa đơn nào.</p>
            )}
          </ul>
          <ToastContainer position="bottom-right" />
        </div>
      </div>
    </div>
  );
};

export default UserInvoices;
