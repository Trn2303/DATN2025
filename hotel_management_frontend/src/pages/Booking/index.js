import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getRoomById, createBooking } from "../../services/Api";
import { getImageRoom } from "../../shared/ultils";
import { toast, ToastContainer } from "react-toastify";

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [inputBooking, setInputBooking] = useState({
    user_id: "",
    room_id: id,
    checkInDate: "",
    checkOutDate: "",
    name: "",
    email: "",
    phone: "",
  });
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    getRoomById(id, {})
      .then(({ data }) => {
        setRoom(data.data);
        setInputBooking((prev) => ({
          ...prev,
          room_id: data.data._id,
          user_id: user?._id || "",
          name: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
        }));
      })
      .catch((error) => console.log(error));
  }, [id]);

  console.log(inputBooking);

  const changeInputBooking = (e) => {
    const { name, value } = e.target;
    setInputBooking({ ...inputBooking, [name]: value });
  };

  const clickBooking = async (e) => {
    e.preventDefault();
    const bookingData = {
      user_id: inputBooking.user_id,
      room_id: inputBooking.room_id,
      checkInDate: inputBooking.checkInDate,
      checkOutDate: inputBooking.checkOutDate,
      email: inputBooking.email,
    };
    createBooking(bookingData)
      .then(({ data }) => {
        if (data.status === "success") {
          toast.success(data.message);
          setTimeout(() => {
            navigate(`/Users-${bookingData.user_id}/BookingHistory`);
          }, 3500);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Đặt phòng thất bại.");
      });
  };

  if (!room) return <div>Loading...</div>;

  return (
    <div className="booking-section">
      <div className="container">
        <div className="breadcrumbs-wrapper mb-4">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item d-flex align-items-center gap-2">
              <Link to="/" className="text-muted text-decoration-none">
                <i className="bi bi-house-door"></i> Trang chủ
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/Rooms" className="text-muted text-decoration-none">
                Tìm khách sạn
              </Link>
            </li>
            <li
              className="breadcrumb-item active text-dark fw-semibold"
              aria-current="page"
            >
              {room.name}
            </li>
          </ol>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="section-title">
              <h2>Đặt phòng</h2>
            </div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-lg-6">
            <img
              src={getImageRoom(room.image)}
              alt={room.name}
              className="img-fluid"
            />
            <h3 className="mt-3">{room.name}</h3>
            <p>{room?.room_type?.description}</p>
            <p>Tiện nghi: {room.amenities.map((a) => a.name).join(", ")}</p>
            <p>Giá: {room?.room_type?.base_price.toLocaleString()}₫ / đêm</p>
          </div>
          <div className="col-lg-6">
            <h4>Thông tin đặt phòng</h4>
            <form method="post" className="my-4">
              {/* User Name */}
              <div className="form-group">
                <label>Họ và tên:</label>
                <input
                  type="text"
                  name="name"
                  value={inputBooking.name}
                  onChange={changeInputBooking}
                  className="form-control"
                  required
                />
              </div>
              {/* User Email */}
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={inputBooking.email}
                  onChange={changeInputBooking}
                  className="form-control"
                  required
                />
              </div>
              {/* User Phone */}
              <div className="form-group">
                <label>Số điện thoại:</label>
                <input
                  type="text"
                  name="phone"
                  value={inputBooking.phone}
                  onChange={changeInputBooking}
                  className="form-control"
                  required
                />
              </div>
              {/* Check-In Date */}
              <div className="form-group">
                <label>Ngày nhận phòng:</label>
                <input
                  type="date"
                  name="checkInDate"
                  value={inputBooking.checkInDate}
                  onChange={changeInputBooking}
                  className="form-control"
                  required
                />
              </div>
              {/* Check-Out Date */}
              <div className="form-group">
                <label>Ngày trả phòng:</label>
                <input
                  type="date"
                  name="checkOutDate"
                  value={inputBooking.checkOutDate}
                  onChange={changeInputBooking}
                  className="form-control"
                  required
                />
              </div>
              {/* Submit Button */}
              <button
                onClick={clickBooking}
                type="button"
                className="btn btn-primary mt-3"
              >
                Xác nhận đặt phòng
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Booking;
