import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { cancelBooking, getBookingsByUser } from "../../services/Api";
import SidebarUser from "../../shared/components/Layout/SidebarUser";
import { toast, ToastContainer } from "react-toastify";
import Pagination from "../../shared/components/_pagination";
const BookingHistory = () => {
  const { id } = useParams();
  const [bookings, setBookings] = useState([]);
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 5;
  const [pageIndex, setPageIndex] = useState({ limit });
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    getBookingsByUser(id, {
      params: { page, limit },
    })
      .then(({ data }) => {
        if (data.status === "success") {
          setBookings(data.data.docs);
          setPageIndex({ limit, ...data.data.pages });
        }
      })
      .catch((error) => console.log(error));
  }, [id, page]);
  const handleClickCancel = (bookingId, checkInDate) => {
    setSelectedBooking({ bookingId, checkInDate });
  };

  const confirmCancelBooking = () => {
    const { bookingId, checkInDate } = selectedBooking;
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
          setSelectedBooking(null);
        })
        .catch(() => toast.error("Không thể hủy đặt phòng"));
    } else {
      toast.error("Đã đến hạn, không thể hủy đặt phòng!");
      setSelectedBooking(null);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-3">
          <SidebarUser />
        </div>
        <div className="col-md-9">
          <h3 className="mb-4">Đơn đặt phòng</h3>
          <hr className="bg-secondary" />
          <hr />
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
                <div
                  key={index}
                  className="card shadow-sm mb-4 border-0 rounded-4"
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="card-title mb-0">
                        {booking.room?.name || "Phòng không xác định"}
                      </h5>
                      <span
                        className={`badge ${badgeClass} px-3 py-2 rounded-pill`}
                      >
                        {booking.status.toUpperCase()} <i className={icon}></i>
                      </span>
                    </div>

                    <p className="mb-1">
                      <strong>Check-in:</strong>{" "}
                      {new Date(booking.checkInDate).toLocaleDateString()}
                    </p>
                    <p className="mb-1">
                      <strong>Check-out:</strong>{" "}
                      {new Date(booking.checkOutDate).toLocaleDateString()}
                    </p>
                    <p className="mb-1">
                      <strong>Tổng tiền:</strong>{" "}
                      {booking.totalPrice.toLocaleString()} ₫
                    </p>

                    {booking.status !== "cancelled" && (
                      <div className="text-end mt-3">
                        <button
                          className="btn btn-outline-danger btn-sm px-4 py-2"
                          data-bs-toggle="modal"
                          data-bs-target="#cancelModal"
                          onClick={() =>
                            handleClickCancel(booking._id, booking.checkInDate)
                          }
                        >
                          Hủy đặt phòng
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="alert alert-secondary text-center">
              Không có lịch sử đặt phòng.
            </div>
          )}
          <div
            className="modal fade"
            id="cancelModal"
            tabIndex="-1"
            aria-labelledby="cancelModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="cancelModalLabel">
                    Xác nhận hủy đặt phòng
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  Bạn có chắc chắn muốn hủy đặt phòng này không?
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Đóng
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                    onClick={confirmCancelBooking}
                  >
                    Xác nhận hủy
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-center mt-4">
            <Pagination pages={pageIndex} />
          </div>
          <ToastContainer position="bottom-right" />
        </div>
      </div>
    </div>
  );
};
export default BookingHistory;
