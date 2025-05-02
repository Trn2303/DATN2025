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

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa loại phòng này không?")) {
      try {
        await deleteRoomType(id);
        toast.success("Xóa loại phòng thành công");
        fetchRoomTypes();
      } catch (error) {
        console.error("Xóa thất bại:", error);
        toast.error("Đã xảy ra lỗi khi xóa");
      }
    }
  };

  return (
    <div className="container">
      <ToastContainer position="bottom-right" />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-00">Quản lý loại phòng</h2>

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
              {editingId ? "Cập nhật" : "Thêm"}
            </Button>
          </Modal.Footer>
        </form>
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
                    onClick={() => handleDelete(room._id)}
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
