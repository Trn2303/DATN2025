import { useEffect, useState } from "react";
import {
  getRoomTypes,
  createRoomType,
  updateRoomType,
  deleteRoomType,
} from "../../../services/Api";
import { ToastContainer, toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const RoomTypeAdmin = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    base_price: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchRoomTypes = async () => {
    try {
      const res = await getRoomTypes();
      setRoomTypes(res.data.data.docs);
    } catch (error) {
      console.error("Không thể tải danh sách loại phòng:", error);
      toast.error("Không thể tải danh sách loại phòng");
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateRoomType(editingId, {
          ...formData,
          base_price: Number(formData.base_price),
        });
        toast.success("Cập nhật loại phòng thành công");
        setEditingId(null);
      } else {
        await createRoomType({
          ...formData,
          base_price: Number(formData.base_price),
        });
        toast.success("Thêm loại phòng thành công");
      }
      setFormData({ name: "", description: "", base_price: "" });
      setShowModal(false);
      fetchRoomTypes();
    } catch (error) {
      console.error("Lưu thất bại:", error);
      toast.error("Đã xảy ra lỗi khi lưu dữ liệu");
    }
  };

  const handleEdit = (roomType) => {
    setFormData({
      name: roomType.name,
      description: roomType.description,
      base_price: roomType.base_price,
    });
    setEditingId(roomType._id);
    setShowModal(true);
  };

  const confirmDelete = (id) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };
  const handleDelete = async () => {
    try {
      await deleteRoomType(deletingId);
      toast.success("Xóa loại phòng thành công");
      fetchRoomTypes();
    } catch (error) {
      console.error("Xóa thất bại:", error);
      toast.error("Đã xảy ra lỗi khi xóa");
    } finally {
      setShowDeleteModal(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer position="bottom-right" />
      <h3 className="mb-4 text-center">Quản lý loại phòng</h3>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button
          variant="success"
          className="mb-3"
          onClick={() => {
            setEditingId(null);
            setFormData({ name: "", description: "", base_price: "" });
            setShowModal(true);
          }}
        >
          <i className="bi bi-plus"></i> Thêm
        </Button>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingId ? "Cập nhật loại phòng" : "Thêm loại phòng"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label className="form-label">Tên loại phòng</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Mô tả</label>
              <textarea
                name="description"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Giá cơ bản</label>
              <input
                type="number"
                name="base_price"
                className="form-control"
                value={formData.base_price}
                onChange={handleChange}
                required
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Đóng
            </Button>
            <Button type="submit" variant="primary">
              {editingId ? "Cập nhật" : "Tạo"}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn xóa loại phòng này không?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Tên</th>
            <th>Mô tả</th>
            <th>Giá cơ bản</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {roomTypes.length > 0 ? (
            roomTypes.map((room) => (
              <tr key={room._id}>
                <td>{room.name}</td>
                <td>{room.description}</td>
                <td>{room.base_price}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(room)}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => confirmDelete(room._id)}
                  >
                    Xóa
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                Không có loại phòng nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RoomTypeAdmin;
