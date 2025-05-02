import { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import {
  getAdminServices,
  createService,
  updateService,
} from "../../../services/Api";
import { useSearchParams } from "react-router-dom";

const AdminServiceManager = () => {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    unit: "",
    status: "available",
  });
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const limit = 6;
  const [pageIndex, setPageIndex] = useState({ limit });

  useEffect(() => {
    getAdminServices({
      params: {
        page,
        limit,
      },
    })
      .then(({ data }) => {
        setServices(data.data.docs);
        setPageIndex({ limit, ...data.data.pages });
      })
      .catch((err) => console.log(err));
  }, [page]);
  console.log(services)

  const handleShowModal = (service = null) => {
    setEditingService(service);
    setFormData(
      service || {
        name: "",
        description: "",
        price: "",
        unit: "",
        status: "available",
      }
    );
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingService(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      unit: "",
      status: "available",
    });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      if (editingService) {
        await updateService(editingService._id, formData);
      } else {
        await createService(formData);
      }
      getAdminServices({
        params: {
          page,
          limit,
        },
      })
        .then(({ data }) => {
          setServices(data.data.docs);
          setPageIndex({ limit, ...data.data.pages });
        })
        .catch((err) => console.log(err));
      handleCloseModal();
    } catch (err) {
      console.error("Lỗi khi lưu dịch vụ:", err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Quản lý Dịch vụ</h3>
        <Button variant="success" onClick={() => handleShowModal()}><i className="bi bi-plus"></i> Thêm</Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Tên dịch vụ</th>
            <th>Mô tả</th>
            <th>Giá</th>
            <th>Đơn vị</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service, index) => (
            <tr key={service._id}>
              <td>{index + 1}</td>
              <td>{service.name}</td>
              <td>{service.description}</td>
              <td>{service.price}</td>
              <td>{service.unit}</td>
              <td>{service.status === "available" ? "Hiển thị" : "Ẩn"}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleShowModal(service)}
                >
                  Sửa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingService ? "Sửa" : "Thêm"} Dịch vụ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên dịch vụ</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập tên dịch vụ"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Nhập mô tả dịch vụ"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Giá</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Nhập giá"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Đơn vị</Form.Label>
              <Form.Control
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="Nhập đơn vị (lần, suất...)"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="available">Hiển thị</option>
                <option value="unavailable">Ẩn</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editingService ? "Cập nhật" : "Tạo"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminServiceManager;
