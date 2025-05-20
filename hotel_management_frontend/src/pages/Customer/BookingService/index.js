import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { getServices, createOrder } from "../../../services/Api";
import { ToastContainer, toast } from "react-toastify";
import Pagination from "../../../shared/components/_pagination";

const BookingService = () => {
  const [services, setServices] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const limit = 6;
  const [pageIndex, setPageIndex] = useState({ limit });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getServices({
      params: {
        limit,
        page,
      },
    })
      .then(({ data }) => {
        setServices(data.data.docs);
        setPageIndex({ limit, ...data.data.pages });
      })
      .catch((error) => console.log(error));
  }, [page]);

  useEffect(() => {
    if (!id) return;
    const service = services.find((s) => s._id === id);
    if (service) {
      setOrderItems((prev) => {
        const exists = prev.find((item) => item.service_id === id);
        if (exists) return prev;
        return [
          ...prev,
          {
            service_id: service._id,
            name: service.name,
            price: service.price,
            quantity: 1,
          },
        ];
      });
    }
  }, [id, services]);
  const clickAdd = (service) => {
    const exists = orderItems.find((item) => item.service_id === service._id);
    if (exists) {
      setOrderItems(
        orderItems.map((item) =>
          item.service_id === service._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setOrderItems([
        ...orderItems,
        {
          service_id: service._id,
          name: service.name,
          price: service.price,
          quantity: 1,
        },
      ]);
    }
  };

  const changeQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setOrderItems(
      orderItems.map((item) =>
        item.service_id === id ? { ...item, quantity } : item
      )
    );
  };

  const clickRemove = (id) => {
    setOrderItems(orderItems.filter((item) => item.service_id !== id));
  };

  const totalPrice = orderItems.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );

  const clickOrder = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const payload = {
      items: orderItems.map(({ service_id, name, quantity, price }) => ({
        service_id,
        name,
        quantity,
        price,
      })),
    };

    createOrder(user._id, payload)
      .then(({ data }) => {
        toast.success(data.message);
        setOrderItems([]);
        setTimeout(() => {
          navigate(`/Users-${user?._id}/OrderHistory`);
        }, 2000);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message);
      });
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">Đặt Dịch Vụ</h2>

      <div className="row">
        {services.map((service) => (
          <div className="col-md-4 mb-3" key={service._id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{service.name}</h5>
                <p className="card-text">
                  Giá: {service.price.toLocaleString()} ₫
                </p>
                <p className="card-text">{service.description}</p>
                <button
                  className="btn btn-primary"
                  onClick={() => clickAdd(service)}
                >
                  Thêm
                </button>
              </div>
            </div>
          </div>
        ))}
        <div className="col-lg-12">
          <Pagination pages={pageIndex} />
        </div>
      </div>

      <div className="mt-5">
        <h4>Dịch vụ đã chọn</h4>
        <table className="table table-borderless align-middle mt-3">
          <thead className="table-light">
            <tr>
              <th style={{ width: "30%" }}>Thông tin dịch vụ</th>
              <th style={{ width: "10%" }}>Tùy chọn</th>
              <th style={{ width: "10%" }} className="text-end">
                Giá
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orderItems.length > 0 ? (
              orderItems.map((item) => (
                <tr key={item.service_id}>
                  <td>{item.name}</td>
                  <td style={{ width: "100px" }}>
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        changeQuantity(
                          item.service_id,
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </td>
                  <td>{(item.price * item.quantity).toLocaleString()} ₫</td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-light"
                      onClick={() => clickRemove(item.service_id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  Chưa có dịch vụ nào được chọn.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="text-end mb-3">
          <strong>Tổng cộng: {totalPrice.toLocaleString()} ₫</strong>
        </div>

        <button
          className="btn btn-success"
          onClick={clickOrder}
          disabled={orderItems.length === 0}
        >
          Xác nhận đặt dịch vụ
        </button>
      </div>

      <ToastContainer position="bottom-right" autoClose={2000} />
    </div>
  );
};

export default BookingService;
