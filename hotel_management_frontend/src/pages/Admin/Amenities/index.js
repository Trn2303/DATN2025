import { useEffect, useState, useCallback } from "react";
import {
  getAmenities,
  createAmenity,
  updateAmenity,
  deleteAmenity,
} from "../../../services/Api";
import { Button, Modal, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../../shared/components/_pagination";

const AmenityManagement = () => {
  const [amenities, setAmenities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState(null);
  const [formData, setFormData] = useState({ name: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [amenityToDelete, setAmenityToDelete] = useState(null);
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const limit = 10;
  const [pageIndex, setPageIndex] = useState({ limit });

  const loadAmenities = useCallback(() => {
    getAmenities({
      params: {
        page,
        limit,
      },
    })
      .then(({ data }) => {
        setAmenities(data.data.docs);
        setPageIndex({ limit, ...data.data.pages });
      })
      .catch(() => toast.error("Lỗi khi tải danh sách tiện nghi"));
  }, [page, limit]);

  useEffect(() => {
    loadAmenities();
  }, [loadAmenities]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingAmenity) {
      updateAmenity(editingAmenity._id, formData)
        .then(({ data }) => {
          toast.success(data.message);
          setShowModal(false);
          setFormData({ name: "" });
          setEditingAmenity(null);
          loadAmenities();
        })
        .catch((err) => {
          toast.error(err.response?.data?.message || "Đã xảy ra lỗi");
        });
    } else {
      createAmenity(formData)
        .then(({ data }) => {
          toast.success(data.message);
          setShowModal(false);
          setFormData({ name: "" });
          setEditingAmenity(null);
          loadAmenities();
        })
        .catch((err) => {
          toast.error(err.response?.data?.message || "Đã xảy ra lỗi");
        });
    }
  };

  const handleEdit = (amenity) => {
    setEditingAmenity(amenity);
    setFormData({ name: amenity.name });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setAmenityToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!amenityToDelete) return;
    deleteAmenity(amenityToDelete)
      .then(({ data }) => {
        toast.success(data.message);
        loadAmenities();
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Đã xảy ra lỗi");
      })
      .finally(() => {
        setShowDeleteModal(false);
        setAmenityToDelete(null);
      });
  };
  const closeModal = () => {
    setShowModal(false);
    setFormData({ name: "" });
    setEditingAmenity(null);
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4 text-center">Quản lý tiện nghi</h3>
      <div className="mb-3 d-flex justify-content-end">
        <Button variant="success" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus"></i> Thêm tiện nghi
        </Button>
      </div>

      <ul className="list-group mb-3">
        {amenities.map((a) => (
          <li
            key={a._id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {a.name}
            <div>
              <Button
                variant="warning"
                size="sm"
                className="me-2"
                onClick={() => handleEdit(a)}
              >
                Sửa
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(a._id)}
              >
                Xoá
              </Button>
            </div>
          </li>
        ))}
        {amenities.length === 0 && (
          <p className="text-muted text-center">Chưa có tiện nghi nào.</p>
        )}
      </ul>
      <div className="d-flex justify-content-center mt-4">
        <Pagination pages={pageIndex} />
      </div>
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingAmenity ? "Cập nhật tiện nghi" : "Thêm tiện nghi"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Tên tiện nghi</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                placeholder="Nhập tên tiện nghi"
                required
              />
            </Form.Group>
            <div className="text-end">
              <Button
                variant="secondary"
                onClick={closeModal}
                className="me-2"
              >
                Huỷ
              </Button>
              <Button type="submit" variant="primary">
                {editingAmenity ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton className="no-modal-border">
          <Modal.Title>Xác nhận xoá</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn xóa tiện nghi này?</Modal.Body>
        <Modal.Footer className="no-modal-border">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default AmenityManagement;
