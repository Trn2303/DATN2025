import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import SidebarUser from "../../shared/components/Layout/SidebarUser";
import { getOrdersByUser, cancelOrder } from "../../services/Api";
import { ToastContainer, toast } from "react-toastify";
import Pagination from "../../shared/components/_pagination";

const OrderHistory = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [pageIndex, setPageIndex] = useState({});
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const limit = 5;

  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    getOrdersByUser(id, {
      params: { page, limit },
    })
      .then(({ data }) => {
        if (data.status === "success") {
          setOrders(data.data.docs);
          setPageIndex({ limit, ...data.data.pages });
        }
      })
      .catch((error) => console.log(error));
  }, [id, page]);

  const openModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedOrderId(null);
    setShowModal(false);
  };

  const handleCancelConfirm = async () => {
    try {
      const response = await cancelOrder(selectedOrderId);
      if (response.data.status === "success") {
        toast.success("Đã hủy đơn thành công!");
        setOrders((prev) =>
          prev.map((order) =>
            order._id === selectedOrderId
              ? { ...order, status: "cancelled" }
              : order
          )
        );
        closeModal();
      }
    } catch (error) {
      toast.error("Hủy đơn thất bại.");
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-3">
          <SidebarUser />
        </div>
        <div className="col-md-9 d-flex flex-column">
          <h3 className="mb-4">Lịch sử Đặt Dịch Vụ</h3>
          <hr className="mb-4" />

          {orders.length > 0 ? (
            <div className="row">
              {orders.map((order, index) => {
                let badgeClass = "";
                let icon = "";

                switch (order.status) {
                  case "completed":
                    badgeClass = "bg-success";
                    icon = "bi bi-check-circle";
                    break;
                  case "pending":
                    badgeClass = "bg-warning text-dark";
                    icon = "bi bi-hourglass-split";
                    break;
                  case "cancelled":
                    badgeClass = "bg-danger";
                    icon = "bi bi-x-circle";
                    break;
                  default:
                    badgeClass = "bg-secondary";
                    icon = "bi bi-question-circle";
                }

                return (
                  <div key={index} className="col-md-6 mb-4 d-flex">
                    <div className="card shadow-sm border-0 rounded-4 w-100 d-flex flex-column">
                      <div className="card-body d-flex flex-column">
                        <div className="d-flex justify-content-between mb-2">
                          <span
                            className={`badge ${badgeClass} px-3 py-2 rounded-pill`}
                          >
                            {order.status.toUpperCase()}{" "}
                            <i className={icon}></i>
                          </span>
                          <span className="text-muted text-end">
                            Ngày tạo:{" "}
                            {new Date(order.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="mb-1">
                          <strong>
                            {order.room_id?.name || "Không xác định"}
                          </strong>
                        </p>
                        <p className="mb-2">
                          <strong>Dịch vụ:</strong>
                          <ul className="list-unstyled mt-1 mb-0">
                            {order.items.map((item) => (
                              <li key={item._id}>
                                {item.name} - SL: {item.quantity} -{" "}
                                {item.price.toLocaleString()} ₫
                              </li>
                            ))}
                          </ul>
                        </p>
                        <p className="mb-2 mt-auto">
                          <strong>Tổng tiền:</strong>{" "}
                          {order.totalPrice.toLocaleString()} ₫
                        </p>

                        {order.status === "pending" && (
                          <div className="text-end mt-2">
                            <button
                              className="btn btn-outline-danger btn-sm px-3 py-1"
                              onClick={() => openModal(order._id)}
                            >
                              Hủy dịch vụ
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="alert alert-secondary text-center">
              Không có đơn đặt dịch vụ.
            </div>
          )}

          <div className="mt-auto pt-4">
            <div className="d-flex justify-content-center">
              <Pagination pages={pageIndex} />
            </div>
          </div>

          {/* Modal xác nhận hủy */}
          {showModal && (
            <div className="modal fade show d-block" tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content rounded-4 shadow">
                  <div className="modal-header">
                    <h5 className="modal-title">Xác nhận hủy đơn</h5>
                  </div>
                  <div className="modal-body">
                    <p>Bạn có chắc chắn muốn hủy đơn dịch vụ này không?</p>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={closeModal}>
                      Đóng
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={handleCancelConfirm}
                    >
                      Xác nhận hủy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <ToastContainer position="bottom-right" />
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
