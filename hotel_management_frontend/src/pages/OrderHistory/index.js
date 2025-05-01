import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SidebarUser from "../../shared/components/Layout/SidebarUser";
import { getOrdersByUser } from "../../services/Api"; // Giả sử API gọi tên này
import { ToastContainer } from "react-toastify";

const OrderHistory = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrdersByUser(id,{})
      .then(({ data }) => {
        if (data.status === "success") {
          setOrders(data.data.docs);
        }
      })
      .catch((error) => console.log(error));
  }, [id]);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-3">
          <SidebarUser />
        </div>
        <div className="col-md-9">
          <h2 className="mb-4">Đơn dịch vụ</h2>
          <hr className="bg-secondary" />
          <ul className="list-group">
            {orders.length > 0 ? (
              orders.map((order, index) => {
                let badgeClass = "";
                let icon = "";

                switch (order.status) {
                  case "completed":
                    badgeClass = "bg-success";
                    icon = "bi bi-check-circle";
                    break;
                  case "pending":
                    badgeClass = "bg-warning";
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
                  <li key={index} className="list-group-item">
                    <span className={`badge ${badgeClass} text-dark mb-2`}>
                      {order.status} <i className={icon}></i>
                    </span>
                    <br />
                    <strong>Ngày tạo:</strong>{" "}
                    {new Date(order.createdAt).toLocaleString()}
                    <br />
                    <strong>Phòng:</strong> {order.room.name}
                    <br />
                    <strong>Dịch vụ:</strong>
                    <ul className="mt-1">
                      {order.items.map((item) => (
                        <li key={item._id}>
                          {item.name} - SL: {item.quantity} -{" "}
                          {item.price.toLocaleString()} ₫
                        </li>
                      ))}
                    </ul>
                    <strong>Tổng tiền:</strong>{" "}
                    {order.totalPrice.toLocaleString()} ₫
                  </li>
                );
              })
            ) : (
              <p>Không có đơn đặt dịch vụ.</p>
            )}
          </ul>
          <ToastContainer position="bottom-right" />
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
