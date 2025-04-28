import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getServices, createOrder } from "../../services/Api";

const BookingService = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    service_id: "",
    quantity: 1,
    room_id: "",
  });

  useEffect(() => {
    // Lấy danh sách dịch vụ
    getServices({ params: { limit: 100, status: "active" } })
      .then(({ data }) => setServices(data.data.docs))
      .catch((error) => console.log(error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedService = services.find(
      (service) => service._id === formData.service_id
    );
    if (!selectedService) {
      alert("Vui lòng chọn dịch vụ hợp lệ!");
      return;
    }

    const orderData = {
      room_id: formData.room_id,
      items: [
        {
          service_id: selectedService._id,
          name: selectedService.name,
          price: selectedService.price,
          quantity: Number(formData.quantity),
        },
      ],
    };

    createOrder(id, orderData)
      .then(() => {
        alert("Đặt dịch vụ thành công!");
        navigate("/services");
      })
      .catch((error) => {
        console.error(error);
        alert("Có lỗi xảy ra khi đặt dịch vụ!");
      });
  };

  return (
    <div className="booking-section spad">
      <div className="container">
        <h2 className="text-center mb-5">Đặt Dịch Vụ</h2>
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="row">
            <div className="col-lg-6">
              <label>Chọn dịch vụ</label>
              <select
                name="service_id"
                value={formData.service_id}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">-- Chọn dịch vụ --</option>
                {services.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.name} - {service.price.toLocaleString()}₫
                  </option>
                ))}
              </select>
            </div>

            <div className="col-lg-6">
              <label>Số lượng</label>
              <input
                type="number"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-lg-12 text-center mt-4">
              <button type="submit" className="btn btn-primary px-5 py-2">
                Đặt dịch vụ
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingService;
