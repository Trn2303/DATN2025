import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import SidebarUser from "../../shared/components/Layout/SidebarUser";
import { getInvoicesByUser, createPayment } from "../../services/Api";
import { ToastContainer, toast } from "react-toastify";
import Pagination from "../../shared/components/_pagination";

const UserInvoices = () => {
  const { id } = useParams();
  const [invoices, setInvoices] = useState([]);
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const limit = 5;
  const [pageIndex, setPageIndex] = useState({ limit });

  useEffect(() => {
    getInvoicesByUser(id, {
      params: { page, limit },
    })
      .then(({ data }) => {
        if (data.status === "success") {
          setInvoices(data.data.docs);
          setPageIndex({ limit, ...data.data.pages });
        }
      })
      .catch((error) => console.log(error));
  }, [id, page]);

  const clickPay = async (invoiceId) => {
    try {
      const invoice = invoices.find((inv) => inv._id === invoiceId);
      if (!invoice) return;

      const { data } = await createPayment({
        amount: invoice.totalAmount.toString(),
        invoiceId: invoice._id,
      });

      if (data?.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        toast.error("Không thể tạo liên kết thanh toán.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tạo liên kết thanh toán.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-3">
          <SidebarUser />
        </div>
        <div className="col-md-9">
          <h3 className="mb-4">Danh sách Hóa đơn</h3>
          <hr className="mb-4" />
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
                  badgeClass = "bg-warning text-dark";
                  icon = "bi bi-hourglass-split";
                  break;
                default:
                  badgeClass = "bg-secondary";
                  icon = "bi bi-question-circle";
              }

              return (
                <div
                  key={index}
                  className="card shadow-sm mb-4 border-0 rounded-4"
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span
                        className={`badge ${badgeClass} px-3 py-2 rounded-pill`}
                      >
                        {invoice.paymentStatus.toUpperCase()}{" "}
                        <i className={icon}></i>
                      </span>
                      <span>
                        <strong>Phương thức:</strong>{" "}
                        {invoice.paymentMethod.toUpperCase()}
                      </span>
                    </div>
                    <p className="mb-1">
                      <strong>Ngày xuất:</strong>{" "}
                      {new Date(invoice.issuedDate).toLocaleDateString()}
                    </p>
                    <p className="mb-1">
                      <strong>Hạn thanh toán:</strong>{" "}
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                    <p className="mb-1">
                      <strong>Tổng tiền:</strong>{" "}
                      {invoice.totalAmount.toLocaleString()} ₫
                    </p>

                    {invoice.orders_id?.length > 0 && (
                      <div className="mt-3">
                        <strong>Dịch vụ:</strong>
                        <ul className="list-unstyled mt-2">
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
                    {invoice.paymentStatus !== "paid" && (
                      <div className="mt-3 text-end">
                        <button
                          className="btn btn-outline-danger btn-sm px-4 py-2"
                          onClick={() => clickPay(invoice._id)}
                        >
                          Thanh toán
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="alert alert-secondary text-center">
              Không có hóa đơn.
            </div>
          )}

          <div className="d-flex justify-content-center mt-4">
            <Pagination pages={pageIndex} />
          </div>

          <ToastContainer position="bottom-right" />
        </div>
      </div>
    </div>
  );
};

export default UserInvoices;
