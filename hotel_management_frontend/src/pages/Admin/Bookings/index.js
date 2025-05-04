import { useEffect, useState } from "react";
import {
  getBookings,
  checkInBooking,
  checkOutBooking,
  createInvoice,
} from "../../../services/Api";
import { toast, ToastContainer } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../../shared/components/_pagination";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]); // Track loading per booking
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const limit = 6;
  const [pageIndex, setPageIndex] = useState({ limit });
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    getBookings({ params: { page, limit } })
      .then(({ data }) => {
        setBookings(data.data.docs);
        setPageIndex({ limit, ...data.data.pages });
      })
      .catch(() => toast.error("Lỗi tải danh sách đặt phòng"));
  }, [page]);

  const handleCheckIn = async (id) => {
    setLoadingIds((prev) => [...prev, id]);
    try {
      const { data } = await checkInBooking(id, {});
      if (data.status === "success") {
        toast.success(data.message);
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status: "confirmed" } : b))
        );
      }
    } catch {
      toast.error("Check-in thất bại");
    } finally {
      setLoadingIds((prev) => prev.filter((x) => x !== id));
    }
  };

  const handleCheckOut = async (id) => {
    setLoadingIds((prev) => [...prev, id]);
    try {
      const { data } = await checkOutBooking(id, {});
      if (data.status === "success") {
        toast.success(data.message);

        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status: "completed" } : b))
        );
        console.log(id);
        try {
          const invoiceRes = await createInvoice({
            booking_id: id,
          });
          if (invoiceRes.data.status === "success") {
            toast.success("Đã tạo hóa đơn thành công");
          } else {
            toast.warn("Check-out thành công, nhưng không tạo được hóa đơn");
          }
        } catch (invoiceErr) {
          toast.error("Tạo hóa đơn thất bại");
        }
      }
    } catch {
      toast.error("Check-out thất bại");
    } finally {
      setLoadingIds((prev) => prev.filter((x) => x !== id));
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchSearch =
      booking.room?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.room?.floor?.toString().includes(searchText);
    const matchStatus = filterStatus ? booking.status === filterStatus : true;
    return matchSearch && matchStatus;
  });

  return (
    <div className="container py-4">
      <h3 className="text-center mb-4">Quản lý đặt phòng</h3>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <input
          type="text"
          className="form-control"
          placeholder="Tìm kiếm theo tên phòng hoặc tầng..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <select
          className="form-select w-25 ms-3"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="pending">Chờ check-in</option>
          <option value="confirmed">Đã check-in</option>
          <option value="completed">Đã check-out</option>
        </select>
      </div>

      <div className="row g-3">
        {filteredBookings.map((booking) => (
          <div className="col-md-6" key={booking._id}>
            <div className="card shadow-sm">
              <div className="card-body">
                <h5>{booking.room?.name || "Không có"}</h5>
                <p>Tầng: {booking.room?.floor ?? "Không có"}</p>
                <p>
                  Ngày nhận phòng:{" "}
                  {new Date(booking.checkInDate).toLocaleDateString()}
                </p>
                <p>
                  Ngày trả phòng:{" "}
                  {new Date(booking.checkOutDate).toLocaleDateString()}
                </p>
                <p>Trạng thái: {booking.status}</p>
                <div className="d-flex gap-2">
                  {booking.status === "pending" && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleCheckIn(booking._id)}
                      disabled={loadingIds.includes(booking._id)}
                    >
                      {loadingIds.includes(booking._id)
                        ? "Đang xử lý..."
                        : "Check-in"}
                    </button>
                  )}
                  {booking.status === "confirmed" && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleCheckOut(booking._id)}
                      disabled={loadingIds.includes(booking._id)}
                    >
                      {loadingIds.includes(booking._id)
                        ? "Đang xử lý..."
                        : "Check-out"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredBookings.length === 0 && (
          <p className="text-center text-muted mt-4">
            Không có dữ liệu đặt phòng.
          </p>
        )}
      </div>
      <div className="d-flex justify-content-center mt-4">
        <Pagination pages={pageIndex} />
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default BookingManagement;
