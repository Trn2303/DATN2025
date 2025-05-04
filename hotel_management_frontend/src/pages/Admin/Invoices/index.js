import { useEffect, useState } from "react";
import {
  getInvoices,
  updateInvoice,
  cancelInvoice,
} from "../../../services/Api";
import { toast, ToastContainer } from "react-toastify";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../../shared/components/_pagination";

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [formData, setFormData] = useState({
    paymentMethod: "cash",
    dueDate: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const limit = 10;
  const [pageIndex, setPageIndex] = useState({ limit });

  const loadInvoices = async () => {
    try {
      const { data } = await getInvoices({ params: { page, limit } });
      setInvoices(data.data.docs);
      setPageIndex({
        limit,
        ...data.data.pages,
      });
    } catch (error) {
      toast.error("Lỗi khi tải hóa đơn");
    }
  };
  useEffect(() => {
    loadInvoices();
  }, [page]);
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShowModal = (invoice) => {
    if (!invoice) return;
    setEditingInvoice(invoice);
    setFormData({
      paymentMethod: invoice.paymentMethod,
      dueDate: invoice.dueDate?.slice(0, 10),
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingInvoice(null);
    setFormData({ name: "", paymentMethod: "cash" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingInvoice) {
      toast.error("Không thể tạo hóa đơn mới!");
      return;
    }

    try {
      await updateInvoice(editingInvoice._id, formData);
      toast.success("Cập nhật hóa đơn thành công!");
      loadInvoices();
      handleCloseModal();
    } catch {
      toast.error("Lỗi khi cập nhật hóa đơn!");
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Bạn có chắc muốn hủy hóa đơn này?")) {
      try {
        await cancelInvoice(id);
        toast.success("Đã hủy hóa đơn");
        loadInvoices();
      } catch {
        toast.error("Không thể hủy hóa đơn");
      }
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="container py-4 flex-grow-1">
        <h2 className="mb-4 text-center">Quản lý hóa đơn</h2>

        {/* Danh sách hóa đơn */}
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Phòng</th>
                <th>Khách hàng</th>
                <th>Tổng tiền</th>
                <th>Ngày lập</th>
                <th>Hạn thanh toán</th>
                <th>Phương thức</th>
                <th>Thanh toán</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice._id}>
                  <td>
                    {invoice.booking_id?.room_id?.name || "(Chưa có tên)"}
                  </td>
                  <td>
                    {invoice.user_id?.name || invoice.user_id?.email || "N/A"}
                  </td>
                  <td>{invoice.totalAmount.toLocaleString()} đ</td>
                  <td>{new Date(invoice.issuedDate).toLocaleDateString()}</td>
                  <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                  <td>
                    {invoice.paymentMethod === "cash" ? "Tiền mặt" : "Momo"}
                  </td>
                  <td>
                    <span
                      className={
                        "badge " +
                        (invoice.paymentStatus === "paid"
                          ? "bg-success"
                          : invoice.paymentStatus === "cancelled"
                          ? "bg-danger"
                          : "bg-warning text-dark")
                      }
                    >
                      {invoice.paymentStatus === "pending"
                        ? "Chờ thanh toán"
                        : invoice.paymentStatus === "paid"
                        ? "Đã thanh toán"
                        : "Đã hủy"}
                    </span>
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => handleShowModal(invoice)}
                    >
                      Sửa
                    </Button>{" "}
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleCancel(invoice._id)}
                    >
                      Hủy
                    </Button>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center">
                    Không có hóa đơn nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white py-3 ">
        <div className="container d-flex justify-content-center">
          <Pagination pages={pageIndex} />
        </div>
      </div>

      {/* Modal thêm/sửa */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật hóa đơn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} id="invoice-form">
            <div className="mb-3">
              <label className="form-label">Phương thức thanh toán</label>
              <select
                name="paymentMethod"
                className="form-select"
                value={formData.paymentMethod}
                onChange={handleInputChange}
              >
                <option value="cash">Tiền mặt</option>
                <option value="bank">MOMO</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Hạn thanh toán</label>
              <input
                type="date"
                name="dueDate"
                className="form-control"
                value={formData.dueDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Hủy
          </Button>
          <Button variant="primary" type="submit" form="invoice-form">
            Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default InvoiceManagement;
