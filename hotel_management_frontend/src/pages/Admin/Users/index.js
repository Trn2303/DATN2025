import { useEffect, useState, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useSearchParams, useNavigate } from "react-router-dom";
import Pagination from "../../../shared/components/_pagination";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {
  getAdminUser,
  deleteUser,
  updateAdminUser,
  createAdminUser,
} from "../../../services/Api";

const UserManagement = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = 8;

  const [pageIndex, setPageIndex] = useState({ limit });
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "customer",
    position: "",
    address: "",
    salary: "",
    status: "active",
  });

  const fetchUsers = useCallback(async () => {
    const config = {
      params: {
        page,
        limit,
        role,
      },
    };
    getAdminUser(config)
      .then(({ data }) => {
        setUsers(data.data.docs);
        setPageIndex({ limit, ...data.data.pages });
      })
      .catch(() => {
        toast.error("Lỗi tải danh sách người dùng");
      });
  }, [page, role]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    navigate(`?page=1`);
  }, [role, navigate]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const confirmDelete = () => {
    if (!userToDelete) return;

    deleteUser(userToDelete._id)
      .then(({ data }) => {
        toast.success(data.message);
        fetchUsers();
      })
      .catch((error) => {
        console.log(error);
        toast.error("Lỗi khi xoá người dùng");
      })
      .finally(() => {
        setShowConfirmModal(false);
        setUserToDelete(null);
      });
  };


  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowConfirmModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const action = isEditing
      ? updateAdminUser(editingUserId, formData)
      : createAdminUser(formData);

    action
      .then(({ data }) => {
        toast.success(data.message);
        fetchUsers();
        setShowModal(false);
        resetForm();
      })
      .catch((error) => {
        console.log(error);
        toast.error("Lỗi khi xử lý người dùng");
      });
  };


  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "customer",
      position: "",
      address: "",
      salary: "",
      status: "active",
    });
    setIsEditing(false);
    setEditingUserId(null);
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      phone: user.phone,
      role: user.role,
    });
    setEditingUserId(user._id);
    setIsEditing(true);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="container my-4 flex-grow-1 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Danh sách người dùng</h2>
          <button
            className="btn btn-success"
            onClick={() => setShowModal(true)}
          >
            + Thêm
          </button>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-auto">
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Tất cả vai trò</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
              <option value="staff">Staff</option>
            </select>
          </div>
        </div>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Điện thoại</th>
              <th>Vai trò</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, idx) => (
                <tr key={idx}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(user)}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteUser(user)}
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-auto d-flex justify-content-center">
          <Pagination pages={pageIndex} />
        </div>

        <Modal show={showModal} onHide={closeModal}>
          <form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>
                {isEditing ? "Cập nhật người dùng" : "Tạo người dùng mới"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3">
                <label className="form-label">Họ tên</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  required
                  value={formData.name}
                  onChange={handleFormChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  required
                  disabled={isEditing}
                  value={formData.email}
                  onChange={handleFormChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Mật khẩu
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-control"
                    placeholder={isEditing ? "(Để trống nếu không đổi mật khẩu)" : "Nhập mật khẩu"}
                    value={formData.password}
                    onChange={handleFormChange}
                    required={!isEditing} // bắt buộc nhập nếu là tạo mới
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

              <div className="mb-3">
                <label className="form-label">Số điện thoại</label>
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  required
                  pattern="0[0-9]{9,10}"
                  title="Số điện thoại không hợp lệ"
                  value={formData.phone}
                  onChange={handleFormChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Vai trò</label>
                <select
                  name="role"
                  className="form-select"
                  required
                  value={formData.role}
                  onChange={handleFormChange}
                >
                  <option value="admin">Admin</option>
                  <option value="customer">Customer</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button type="submit" className="btn btn-success">
                {isEditing ? "Lưu" : "Tạo"}
              </button>
            </Modal.Footer>
          </form>
        </Modal>
        <Modal
          show={showConfirmModal}
          onHide={() => setShowConfirmModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận xoá</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Bạn có chắc chắn muốn xoá người dùng{" "}
            <strong>{userToDelete?.name}</strong> không?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowConfirmModal(false)}
            >
              Huỷ
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Xoá
            </Button>
          </Modal.Footer>
        </Modal>

        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default UserManagement;
