import { useEffect, useState } from "react";
import {
  getInvoices,
  createInvoice,
  updateInvoice,
  cancelInvoice,
} from "../../../services/Api";
import { toast, ToastContainer } from "react-toastify";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Pagination from "../../../shared/components/_pagination";

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    paymentMethod: "cash",
  });
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [pages, setPages] = useState({});
  const [page, setPage] = useState(1);

  const loadInvoices = async () => {
    try {
      const { data } = await getInvoices({ params: { page } });
      setInvoices(data.data.docs);
      setPages(data.data.pages);
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

  const handleShowModal = (invoice = null) => {
    setEditingInvoice(invoice);
    setFormData(
      invoice
        ? { name: invoice.roomName, paymentMethod: invoice.paymentMethod }
        : { name: "", paymentMethod: "cash" }
    );
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingInvoice(null);
    setFormData({ name: "", paymentMethod: "cash" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingInvoice) {
        await updateInvoice(editingInvoice._id, formData);
        toast.success("Cập nhật hóa đơn thành công!");
      } else {
        await createInvoice(formData);
        toast.success("Tạo hóa đơn thành công!");
      }
      loadInvoices();
      handleCloseModal();
    } catch {
      toast.error("Lỗi khi lưu hóa đơn!");
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
    <div className="container py-4">
      <h2 className="mb-4 text-center">Quản lý hóa đơn</h2>
      <Button
        variant="success"
        className="mb-3"
        onClick={() => handleShowModal()}
      >
        <i className="bi bi-plus-circle"></i> Tạo hóa đơn
      </Button>

      {/* Danh sách hóa đơn */}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Phòng</th>
              <th>Tổng tiền</th>
              <th>Ngày tạo</th>
              <th>Trạng thái</th>
              <th>Thanh toán</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice._id}>
                <td>{invoice.roomName || "(Chưa có tên)"}</td>
                <td>{invoice.totalAmount.toLocaleString()} đ</td>
                <td>{new Date(invoice.issuedDate).toLocaleDateString()}</td>
                <td>{invoice.status || "Đang xử lý"}</td>
                <td>{invoice.paymentStatus}</td>
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
                <td colSpan="6" className="text-center">
                  Không có hóa đơn nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination pages={pages} onPageChange={setPage} />

      {/* Modal thêm/sửa */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingInvoice ? "Cập nhật" : "Tạo mới"} hóa đơn
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} id="invoice-form">
            <div className="mb-3">
              <label className="form-label">Tên phòng</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phương thức thanh toán</label>
              <select
                name="paymentMethod"
                className="form-select"
                value={formData.paymentMethod}
                onChange={handleInputChange}
              >
                <option value="cash">Tiền mặt</option>
                <option value="bank">Chuyển khoản</option>
              </select>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Hủy
          </Button>
          <Button variant="primary" type="submit" form="invoice-form">
            {editingInvoice ? "Cập nhật" : "Tạo mới"}
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default InvoiceManagement;
