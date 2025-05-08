import { useEffect, useState, useCallback } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Pagination from "../../../shared/components/_pagination";
import { toast, ToastContainer } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import {
  getStaffs,
  getStaffById,
  createStaff,
  updateStaff,
  updateStaffStatus,
  getUser,
} from "../../../services/Api";

const StaffManagement = () => {
  const [staffs, setStaffs] = useState([]);
  const [staff, setStaff] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    position: "",
    address: "",
    salary: "",
  });
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = 6;
  const [pageIndex, setPageIndex] = useState({ limit });
  const [statusFilter, setStatusFilter] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const reloadStaffs = useCallback(() => {
    const config = {
      params: {
        page,
        limit,
        status: statusFilter || undefined,
      },
    };

    getStaffs(config)
      .then(({ data }) => {
        setStaffs(data.data.docs);
        setPageIndex({ limit, ...data.data.pages });
      })
      .catch(() => {
        toast.error("Lỗi tải danh sách nhân viên!");
      });
  }, [page, statusFilter]);

  useEffect(() => {
    reloadStaffs();
  }, [page, reloadStaffs]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (staff) {
        response = await updateStaff(staff._id, formData);
        toast.success(response.data.message);
      } else {
        response = await createStaff(formData);
        toast.success(response.data.message);
      }
      reloadStaffs();
      handleCloseModal();
    } catch (e) {
      const message =
        e?.response?.data?.message || e?.message || "Có lỗi xảy ra!";
      toast.error(message);
    }
  };

  const handleEdit = async (id) => {
    try {
      const { data: staffRes } = await getStaffById(id);
      const staffData = staffRes.data;

      const { data: userRes } = await getUser(staffData.user_id);
      const user = userRes.data;

      setStaff(staffData);
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        phone: user.phone || "",
        position: staffData.position || "",
        address: staffData.address || "",
        salary: staffData.salary || "",
      });

      setShowModal(true);
    } catch (err) {
      toast.error("Không thể lấy thông tin nhân viên!");
    }
  };
  const handleStatusChange = async (id) => {
    try {
      await updateStaffStatus(id, {});
      reloadStaffs();
      toast.success("Thay đổi trạng thái thành công!");
    } catch {
      toast.error("Không thể thay đổi trạng thái!");
    }
  };

  const handleShowModal = () => {
    setStaff(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      position: "",
      address: "",
      salary: "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setStaff(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      position: "",
      address: "",
      salary: "",
    });
    setShowPassword(false);
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4 text-center">Quản lý nhân viên</h3>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button variant="success" onClick={handleShowModal}>
          <i className="bi bi-plus"></i> Thêm
        </Button>
        <select
          className="form-select"
          style={{ width: 180 }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang làm</option>
          <option value="inactive">Đã nghỉ</option>
        </select>
      </div>

      {/* Modal thêm/sửa nhân viên */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {staff ? "Cập nhật nhân viên" : "Thêm nhân viên"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} id="staff-form">
            <div className="mb-2">
              <label className="form-label">Họ tên</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nhập họ tên"
                required
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Nhập email"
                required
                disabled={!!staff}
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Mật khẩu</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={
                    staff
                      ? "(Để trống nếu không đổi mật khẩu)"
                      : "Nhập mật khẩu"
                  }
                  required={!staff}
                />
                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showPassword ? "Ẩn" : "Hiện"}
                </Button>
              </div>
            </div>
            <div className="mb-2">
              <label className="form-label">Số điện thoại</label>
              <input
                type="text"
                name="phone"
                className="form-control"
                value={formData.phone}
                pattern="0[0-9]{9,10}"
                title="Số điện thoại không hợp lệ"
                onChange={handleInputChange}
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Chức vụ</label>
              <input
                type="text"
                name="position"
                className="form-control"
                value={formData.position}
                onChange={handleInputChange}
                placeholder="Nhập chức vụ"
                required
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Địa chỉ</label>
              <input
                type="text"
                name="address"
                className="form-control"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Nhập địa chỉ"
                required
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Lương</label>
              <input
                type="number"
                name="salary"
                className="form-control"
                value={formData.salary}
                onChange={handleInputChange}
                placeholder="Nhập lương"
                required
                min={0}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Hủy
          </Button>
          <Button variant="primary" type="submit" form="staff-form">
            {staff ? "Cập nhật" : "Tạo"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Danh sách nhân viên */}
      <div className="row g-3">
        {staffs.map((staff) => (
          <div className="col-md-6 col-lg-4" key={staff._id}>
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title mb-1">{staff.user_id.name}</h5>
                <p className="mb-1">
                  <strong>Chức vụ:</strong> {staff.position}
                </p>
                <p className="mb-1">
                  <strong>SĐT:</strong> {staff.user_id.phone}
                </p>
                <p className="mb-1">
                  <strong>Trạng thái:</strong>{" "}
                  <span
                    className={
                      staff.status === "active" ? "text-success" : "text-danger"
                    }
                  >
                    {staff.status === "active" ? "Đang làm" : "Đã nghỉ"}
                  </span>
                </p>
                <div className="mt-3 d-flex gap-2">
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEdit(staff._id)}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant={staff.status === "active" ? "danger" : "success"}
                    size="sm"
                    onClick={() => handleStatusChange(staff._id)}
                  >
                    {staff.status === "active" ? "Nghỉ việc" : "Kích hoạt"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {staffs.length === 0 && (
          <p className="text-center text-muted mt-4">Không có nhân viên nào.</p>
        )}
      </div>

      {/* Phân trang */}
      <div className="col-lg-12 mt-4 d-flex justify-content-center">
        <Pagination pages={pageIndex} />
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default StaffManagement;
