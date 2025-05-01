import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { cancelBooking, getBookingsByUser } from "../../services/Api";
import SidebarUser from "../../shared/components/Layout/SidebarUser";
import { toast, ToastContainer } from "react-toastify";
const BookingHistory = () => {
  const { id } = useParams();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getBookingsByUser(id, {})
      .then(({ data }) => {
        setBookings(data.data);
      })
      .catch((error) => console.log(error));
  }, [id]);

  const clickCancel = (bookingId, checkInDate) => {
    const currentTime = new Date();
    const checkInTime = new Date(checkInDate);
    const timeDifference = checkInTime - currentTime;
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    if (hoursDifference > 24) {
      cancelBooking(bookingId)
        .then(({ data }) => {
          if (data.status === "success") {
            toast.success(data.message || "Hủy đặt phòng thành công");
            setBookings((prevBookings) =>
              prevBookings.filter((booking) => booking._id !== bookingId)
            );
          }
        })
        .catch((error) => toast.error("Không thể hủy đặt phòng"));
    } else {
      toast.error("Đã đến hạn, không thể hủy đặt phòng!");
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-3">
          <SidebarUser />
        </div>
        <div className="col-md-9">
          <h2 className="mb-4">Đơn đặt phòng</h2>
          <hr className="bg-secondary" />
          <ul className="list-group">
            {bookings.length > 0 ? (
              bookings.map((booking, index) => {
                let badgeClass = "";
                let icon = "";

                switch (booking.status) {
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
                  case "confirmed":
                    badgeClass = "bg-info";
                    icon = "bi bi-check2-circle";
                    break;
                  default:
                    badgeClass = "bg-secondary";
                    icon = "bi bi-question-circle";
                }

                return (
                  <li key={index} className="list-group-item">
                    <strong>{booking.room?.name || "Không rõ"} </strong>{" "}
                    <span className={`mx-3 badge ${badgeClass} text-dark`}>
                      {booking.status} <i className={icon}></i>
                    </span>
                    <br />
                    <strong>Check-in:</strong>{" "}
                    {new Date(booking.checkInDate).toLocaleDateString()} <br />
                    <strong>Check-out:</strong>{" "}
                    {new Date(booking.checkOutDate).toLocaleDateString()} <br />
                    <strong>Tổng tiền:</strong>{" "}
                    {booking.totalPrice.toLocaleString()} ₫
                    <br />
                    {booking.status !== "cancelled" && ( 
                      <button
                        className="btn btn-danger btn-sm mt-2"
                        onClick={() =>
                          clickCancel(booking._id, booking.checkInDate)
                        } 
                      >
                        Hủy đặt phòng
                      </button>
                    )}
                  </li>
                );
              })
            ) : (
              <p>Không có lịch sử đặt phòng.</p>
            )}
          </ul>
          <ToastContainer position="bottom-right" />
        </div>
      </div>
    </div>
  );
};
export default BookingHistory;
