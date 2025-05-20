import { Link, useParams, useNavigate } from "react-router-dom";
import { getImageRoom } from "../../../shared/ultils";
import { useEffect, useState } from "react";
import { getRoomById } from "../../../services/Api";
import { ToastContainer, toast } from "react-toastify";

const RoomDetails = () => {
  const [room, setRoom] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    getRoomById(id, {})
      .then(({ data }) => setRoom(data.data))
      .catch((error) => console.log(error));
  }, [id]);

  if (!room) return <div>Loading...</div>;
  const handleBookingClick = () => {
    const user = localStorage.getItem("user");
    if (!user) {
      toast.warning("Vui lòng đăng nhập để đặt phòng!");
      return;
    }
    navigate(`/Booking-${room._id}`);
  };

  return (
    <div className="room-details-section spad">
      <div className="container">
        <div className="breadcrumbs-wrapper mb-4">
          <ol className="breadcrumb mb-0 mt-4">
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

        <div className="row py-5">
          <div className="col-lg-6">
            <div className="room-details-item">
              <img src={getImageRoom(room.image)} alt={room.name} />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="rd-text">
              <div className="rd-title">
                <h3>{room.name}</h3>
              </div>
              <h2>
                {room?.room_type?.base_price.toLocaleString()}
                <span>₫ / đêm</span>
              </h2>
              <table>
                <tbody>
                  <tr>
                    <td className="r-o">Loại phòng:</td>
                    <td>{room?.room_type?.name}</td>
                  </tr>
                  <tr>
                    <td className="r-o">Số tầng:</td>
                    <td>{room?.floor}</td>
                  </tr>
                  <tr>
                    <td className="r-o">Tiện nghi:</td>
                    <td>
                      {room?.amenities
                        ?.map((amenity) => amenity.name)
                        .join(", ")}
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="f-para">{room?.room_type?.description}</p>
            </div>
            <div className="rdt-right">
              <button
                onClick={handleBookingClick}
                className="btn btn-success mt-3 px-4 py-2"
              >
                <i className="bi bi-calendar-check me-2"></i> Đặt phòng ngay
              </button>
            </div>
          </div>
        </div>
        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default RoomDetails;
