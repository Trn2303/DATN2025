import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getRoomById, createBooking } from "../../../services/Api";
import { getImageRoom } from "../../../shared/ultils";
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
  const validateBooking = () => {
    const { checkInDate, checkOutDate, email } = inputBooking;

    if (!checkInDate || !checkOutDate) {
      toast.error("Vui lòng chọn ngày nhận và ngày trả phòng.");
      return false;
    }

    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      toast.error("Ngày trả phòng phải sau ngày nhận phòng.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Email không hợp lệ");
      return false;
    }

    return true;
  };

  const changeInputBooking = (e) => {
    const { name, value } = e.target;
    setInputBooking({ ...inputBooking, [name]: value });
  };

  const clickBooking = async (e) => {
    e.preventDefault();
    if (!validateBooking()) return;
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
          }, 2000);
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
        <div className="breadcrumbs-wrapper mt-4">
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
            <div className="section-title m-0">
              <h2>Đặt phòng</h2>
            </div>
          </div>
        </div>
        <div className="row mb-5 g-4">
          {/* thông tin phòng */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm p-4">
              <div className="row">
                <h4 className="card-title">{room.name}</h4>
                <p className="text-muted">{room?.room_type?.description}</p>
                <p className="mb-1">
                  <strong>Tiện nghi:</strong>{" "}
                  {room.amenities.map((a) => a.name).join(", ")}
                </p>
                <p>
                  <strong>Giá:</strong>{" "}
                  {room?.room_type?.base_price.toLocaleString()}₫ / đêm
                </p>
              </div>
              <div className="row">
                <img
                  src={getImageRoom(room.image)}
                  alt={room.name}
                  className="img-fluid rounded-start object-fit-cover w-100"
                />
              </div>
            </div>
          </div>

          {/* form đặt phòng */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm p-4">
              <h4 className="mb-3">Thông tin đặt phòng</h4>
              <form method="post">
                <div className="mb-3">
                  <label className="form-label">Họ và tên:</label>
                  <input
                    type="text"
                    name="name"
                    value={inputBooking.name}
                    onChange={changeInputBooking}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={inputBooking.email}
                    onChange={changeInputBooking}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Số điện thoại:</label>
                  <input
                    type="text"
                    name="phone"
                    value={inputBooking.phone}
                    onChange={changeInputBooking}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Ngày nhận phòng:</label>
                  <input
                    type="date"
                    name="checkInDate"
                    value={inputBooking.checkInDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={changeInputBooking}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Ngày trả phòng:</label>
                  <input
                    type="date"
                    name="checkOutDate"
                    value={inputBooking.checkOutDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={changeInputBooking}
                    className="form-control"
                    required
                  />
                </div>
                <button
                  onClick={clickBooking}
                  type="button"
                  className="btn btn-primary w-100 mt-2"
                >
                  Xác nhận đặt phòng
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={2000} />
    </div>
  );
};

export default Booking;
