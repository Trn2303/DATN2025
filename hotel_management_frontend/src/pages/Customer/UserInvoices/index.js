import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import SidebarUser from "../../../shared/components/Layout/SidebarUser";
import { getInvoicesByUser, createPayment, payCash } from "../../../services/Api";
import { ToastContainer, toast } from "react-toastify";
import Pagination from "../../../shared/components/_pagination";

const UserInvoices = () => {
  const { id } = useParams();
  const [invoices, setInvoices] = useState([]);
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const limit = 5;
  const [pageIndex, setPageIndex] = useState({ limit });
  const [showModal, setShowModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

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

  const openPaymentModal = (invoiceId) => {
    const invoice = invoices.find((inv) => inv._id === invoiceId);
    if (!invoice) return;
    setSelectedInvoice(invoice);
    setShowModal(true);
  };

  const handlePayment = (method) => {
    if (!selectedInvoice) return;

    if (method === "momo") {
      createPayment({
        amount: selectedInvoice.totalAmount.toString(),
        invoiceId: selectedInvoice._id,
      })
        .then((response) => {
          const data = response.data;
          if (data?.paymentUrl) {
            window.location.href = data.paymentUrl;
          } else {
            toast.error("Không thể tạo liên kết thanh toán.");
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error("Lỗi khi xử lý thanh toán.");
        });
    } else if (method === "cash") {
      payCash({ invoiceId: selectedInvoice._id })
        .then((response) => {
          const data = response.data;
          if (data.status === "success") {
            toast.success("Thanh toán tiền mặt thành công.");
          }
          setShowModal(false);
          window.location.reload();
        })
        .catch((error) => {
          console.error(error);
          toast.error("Lỗi khi xử lý thanh toán.");
        });
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
                    </div>
                    <div className="my-3">
                      <strong className="fs-4">
                        {invoice.booking_id.room_id?.name}
                      </strong>
                    </div>
                    <p className="mb-1">
                      <div>
                        <strong>Ngày xuất:</strong>{" "}
                        {new Date(invoice.issuedDate).toLocaleDateString()}
                        <strong className="ms-3">Hạn thanh toán:</strong>{" "}
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </div>
                    </p>
                    <p className="mb-1">
                      <strong>Tổng tiền:</strong>{" "}
                      {invoice.totalAmount.toLocaleString()} ₫
                    </p>
                    {invoice.paymentStatus === "paid" && (
                      <p className="mb-1">
                        <strong>Ngày thanh toán:</strong>{" "}
                        {new Date(invoice.paymentDate).toLocaleDateString()}
                      </p>
                    )}

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
                          onClick={() => openPaymentModal(invoice._id)}
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

          <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
      </div>
      {showModal && selectedInvoice && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header">
                <h5 className="modal-title">Chọn phương thức thanh toán</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="fs-5">
                  <strong>{selectedInvoice.booking_id.room_id?.name}</strong>
                </p>
                <p>Hóa đơn: {selectedInvoice._id}</p>
                <p>Số tiền: {selectedInvoice.totalAmount.toLocaleString()} ₫</p>
                <div className="d-flex gap-3 justify-content-end mt-4">
                  <button
                    className="btn btn-warning"
                    onClick={() => handlePayment("cash")}
                  >
                    Thanh toán tiền mặt
                  </button>
                  <button
                    className="btn btn-momo"
                    onClick={() => handlePayment("momo")}
                  >
                    Thanh toán MoMo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInvoices;
