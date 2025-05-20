import { useEffect, useState, useCallback } from "react";
import { getInvoices, updateInvoice } from "../../../services/Api";
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
  const limit = 9;
  const [pageIndex, setPageIndex] = useState({ limit });

  const loadInvoices = useCallback(() => {
    getInvoices({ params: { page, limit } })
      .then(({ data }) => {
        setInvoices(data.data.docs);
        setPageIndex({
          limit,
          ...data.data.pages,
        });
      })
      .catch(() => {
        toast.error("Lỗi khi tải hóa đơn");
      });
  }, [page, limit]);


  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);
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
    setFormData({ paymentMethod: "cash", dueDate: "" });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    updateInvoice(editingInvoice._id, formData)
      .then(({ data }) => {
        toast.success(data.message);
        loadInvoices();
        handleCloseModal();
      })
      .catch(() => {
        toast.error("Lỗi khi cập nhật hóa đơn!");
      });
  };

  const printInvoice = (invoice) => {
    const printWindow = window.open("", "_blank");

    const formatDate = (dateStr) =>
      dateStr ? new Date(dateStr).toLocaleDateString("vi-VN") : "-";

    const itemsHtml =
      invoice.orders_id
        ?.flatMap((order) =>
          order.items.map(
            (item) => `
        <tr>
          <td>${item.name || "Dịch vụ"}</td>
          <td style="text-align: center;">${item.quantity}</td>
          <td style="text-align: right;">${item.price.toLocaleString()}đ</td>
          <td style="text-align: right;">${(
                item.quantity * item.price
              ).toLocaleString()}đ</td>
        </tr>
      `
          )
        )
        .join("") || "";

    const htmlContent = `
      <html>
        <head>
          <title>Hóa đơn</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              color: #333;
            }
            h1 {
              color: #b30000;
              margin-bottom: 0;
            }
            .header, .footer {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .section {
              margin-top: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            }
            th, td {
              border-bottom: 1px solid #ddd;
              padding: 8px;
            }
            th {
              background-color: #eee;
              text-align: center;
            }
            .total {
              text-align: right;
              font-weight: bold;
              font-size: 16px;
            }
            .red {
              color: #b30000;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>HÓA ĐƠN</h1>
              <p><strong class="red">Khách sạn Bình Dân</strong></p>
              <p>SĐT: +84 382 025 369</p>
              <p>Địa chỉ: 30A Trúc Lạc, Trúc Bạch, Ba Đình, Hà Nội, Việt Nam</p>
            </div>
            <div style="text-align: right;">
              <p><strong>Hóa đơn #${invoice._id}</strong></p>
              <p>Ngày lập: ${formatDate(invoice.issuedDate)}</p>
            </div>
          </div>
  
          <hr />
  
          <div class="section">
            <p><strong>Khách hàng:</strong> ${invoice.user_id?.name}</p>
            <p><strong>Phòng:</strong> ${invoice.booking_id?.room_id?.name}</p>
          </div>
  
          <table>
            <thead>
              <tr>
                <th>Mục</th>
                <th>Số lượng</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
            <tr>
          <td>${invoice.booking_id?.room_id?.name}${" - "}${invoice.booking_id?.room_id?.roomTypeId?.name
      }</td>
          <td style="text-align: center;">${invoice.booking_id.totalPrice /
      invoice.booking_id?.room_id?.roomTypeId?.base_price
      }</td>
          <td style="text-align: right;">${invoice.booking_id?.room_id?.roomTypeId?.base_price
      }đ</td>
          <td style="text-align: right;">${invoice.booking_id.totalPrice}đ</td>
        </tr>
            ${itemsHtml}
            </tbody>
          </table>
  
          <div class="section total">
            <span class="red">TỔNG TIỀN: ${invoice.totalAmount.toLocaleString()}đ</span>
          </div>
  
          <div class="section">
            <p><strong>Phương thức thanh toán:</strong> ${invoice.paymentMethod === "cash"
        ? "Tiền mặt"
        : invoice.paymentMethod === "momo"
          ? "Ví MoMo"
          : invoice.paymentMethod || "-"
      }</p>
            <p><strong>Hạn thanh toán:</strong> ${formatDate(
        invoice.dueDate
      )}</p>
            <p><strong>Ngày thanh toán:</strong> ${formatDate(
        invoice.paymentDate
      )}</p>            
            <p><strong>Trạng thái:</strong> ${invoice.paymentStatus}</p>
          </div>
  
          <hr />
  
          <div class="footer section">
            <div>
              <p><strong>Thông tin liên hệ:</strong></p>
              <p>Email: binhdanhotel@gmail.com</p>
              <p>Hotline: +84 382 025 369</p>
            </div>
            <div>
              <img src="/img/logo.png" alt="Logo" />
            </div>
          </div>
  
          <script>
            window.onload = () => {
              window.print();
              window.onafterprint = () => window.close();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="container py-4 flex-grow-1">
        <h3 className="mb-4 text-center">Quản lý hóa đơn</h3>

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
                <th>Ngày thanh toán</th>
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
                    {invoice.paymentDate
                      ? new Date(invoice.paymentDate).toLocaleDateString()
                      : "-"}
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
                      variant="primary"
                      onClick={() => handleShowModal(invoice)}
                      disabled={invoice.paymentStatus !== "pending"}
                    >
                      Sửa
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => printInvoice(invoice)}
                      className="ms-2"
                    >
                      In
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

      <div className="bg-white ">
        <div className="d-flex justify-content-center">
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

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default InvoiceManagement;
