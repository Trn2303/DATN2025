import { useEffect, useState } from "react";
import {
  deleteRoom,
  getAdminRooms,
  getAmenities,
  getRoomTypes,
} from "../../../services/Api";
import { useSearchParams } from "react-router-dom";
import { getImageRoom } from "../../../shared/ultils";
import { toast, ToastContainer } from "react-toastify";
import Pagination from "../../../shared/components/_pagination";
import Modal from "react-bootstrap/Modal";
import { updateRoom } from "../../../services/Api";

const RoomsAdmin = () => {
  const RoomCard = ({ room }) => (
    <div className="card mb-3 shadow-sm">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h5 className="card-title">{room.name}</h5>
          <h6 className="card-subtitle mb-2 text-muted">
            {room.roomTypeId?.name}
          </h6>
          <div>
            <button
              className="btn btn-xs btn-warning me-2"
              onClick={() => clickEdit(room)}
            >
              Edit
            </button>
            <button
              className="btn btn-xs btn-danger"
              onClick={() => clickDelete(room)}
            >
              Delete
            </button>
          </div>
        </div>
        {room.image && (
          <img
            src={getImageRoom(room.image)}
            alt={room.name}
            className="rounded"
            width="70"
            height="70"
          />
        )}
      </div>
    </div>
  );

  const RoomColumn = ({ title, rooms, count }) => (
    <div className="col-md-3 px-1">
      <div className="bg-light py-3 px-2 rounded">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">{title}</h5>
          <span className="badge bg-primary">{count}</span>
        </div>
        {rooms.length === 0 ? (
          <p className="text-center text-muted">No Records in {title}</p>
        ) : (
          rooms.map((room, index) => <RoomCard key={index} room={room} />)
        )}
      </div>
    </div>
  );
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const limit = 4;
  const [pageIndex, setPageIndex] = useState({ limit });
  const [rooms, setRooms] = useState({
    clean: [],
    occupied: [],
    dirty: [],
    maintenance: [],
    totalCounts: {},
  });
  const [editingRoom, setEditingRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [roomTypes, setRoomTypes] = useState([]);
  const [allAmenities, setAllAmenities] = useState([]);
  const [selectedAmenity, setSelectedAmenity] = useState("");
  const [isSelectingAmenity, setIsSelectingAmenity] = useState(false);

  const clickEdit = (room) => {
    setEditingRoom(room);
    setShowModal(true);
  };

  const clickDelete = (room) => {
    if (window.confirm(`Bạn có chắc muốn xóa ${room.name}?`)) {
      deleteRoom(room._id)
        .then(({ data }) => {
          toast.success(data.message);
          setRooms((prev) => ({
            ...prev,
            [room.status]: prev[room.status].filter((r) => r._id !== room._id),
          }));
        })
        .catch((error) => {
          console.log(error);
          toast.error("Đã xảy ra lỗi khi xóa phòng.");
        });
    }
  };

  useEffect(() => {
    getAdminRooms({
      params: {
        page,
        limit,
      },
    })
      .then(({ data }) => {
        setRooms({
          clean: data.data.docs.clean || [],
          occupied: data.data.docs.occupied || [],
          dirty: data.data.docs.dirty || [],
          maintenance: data.data.docs.maintenance || [],
          totalCounts: data.data.totalCounts,
        });
        setPageIndex({ limit, ...data.data.pages });
      })
      .catch((error) => console.log(error));
  }, [page]);

  useEffect(() => {
    getRoomTypes({})
      .then(({ data }) => setRoomTypes(data.data.docs))
      .catch((error) => console.log(error));
    getAmenities({})
      .then(({ data }) => setAllAmenities(data.data.docs))
      .catch((error) => console.log(error));
  }, []);
  console.log(allAmenities);

  return (
    <div className="container my-4">
      {editingRoom && (
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Chỉnh sửa phòng: {editingRoom.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const formData = new FormData();
                  formData.append("name", editingRoom.name);
                  formData.append("floor", editingRoom.floor);
                  formData.append("room_type", editingRoom.room_type);
                  formData.append("status", editingRoom.status);
                  editingRoom.amenities.forEach((a) => {
                    formData.append("amenities", a._id || a);
                  });
                  if (editingRoom.imageFile) {
                    formData.append("image", editingRoom.imageFile);
                  }

                  const res = await updateRoom(editingRoom._id, formData);
                  toast.success(res.data.message);
                  setShowModal(false);
                  setEditingRoom(null);

                  const { data } = await getAdminRooms({
                    params: { page, limit },
                  });
                  setRooms({
                    clean: data.data.docs.clean || [],
                    occupied: data.data.docs.occupied || [],
                    dirty: data.data.docs.dirty || [],
                    maintenance: data.data.docs.maintenance || [],
                    totalCounts: data.data.totalCounts,
                  });
                } catch (err) {
                  console.error(err);
                  toast.error("Lỗi khi cập nhật phòng");
                }
              }}
            >
              <div className="mb-3">
                <label className="form-label">Tên phòng</label>
                <input
                  className="form-control"
                  value={editingRoom.name}
                  onChange={(e) =>
                    setEditingRoom({ ...editingRoom, name: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Tầng</label>
                <input
                  className="form-control"
                  value={editingRoom.floor}
                  onChange={(e) =>
                    setEditingRoom({ ...editingRoom, floor: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Loại phòng</label>
                <select
                  className="form-control"
                  value={editingRoom.room_type}
                  onChange={(e) =>
                    setEditingRoom({
                      ...editingRoom,
                      room_type: e.target.value,
                    })
                  }
                >
                  {roomTypes.map((type) => (
                    <option key={type._id} value={type._id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Trạng thái</label>
                <select
                  className="form-control"
                  value={editingRoom.status}
                  onChange={(e) =>
                    setEditingRoom({ ...editingRoom, status: e.target.value })
                  }
                >
                  <option value="clean">Clean</option>
                  <option value="occupied">Occupied</option>
                  <option value="dirty">Dirty</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Dịch vụ</label>

                {/* Nút để mở dropdown */}
                {!isSelectingAmenity && (
                  <button
                    type="button"
                    className="btn btn-outline-primary mb-2"
                    onClick={() => setIsSelectingAmenity(true)}
                  >
                    + Thêm dịch vụ
                  </button>
                )}

                {/* Dropdown hiển thị khi nhấn + */}
                {isSelectingAmenity && (
                  <div className="d-flex mb-2">
                    <select
                      className="form-select me-2"
                      value={selectedAmenity}
                      onChange={(e) => setSelectedAmenity(e.target.value)}
                    >
                      <option value="">-- Chọn dịch vụ --</option>
                      {allAmenities
                        .filter(
                          (a) =>
                            !editingRoom.amenities.some(
                              (item) =>
                                (typeof item === "string" ? item : item._id) ===
                                a._id
                            )
                        )
                        .map((a) => (
                          <option key={a._id} value={a._id}>
                            {a.name}
                          </option>
                        ))}
                    </select>
                    <button
                      type="button"
                      className="btn btn-success"
                      disabled={!selectedAmenity}
                      onClick={() => {
                        const newAmenity = allAmenities.find(
                          (a) => a._id === selectedAmenity
                        );
                        if (newAmenity) {
                          setEditingRoom({
                            ...editingRoom,
                            amenities: [...editingRoom.amenities, newAmenity],
                          });
                          setSelectedAmenity("");
                          setIsSelectingAmenity(false);
                        }
                      }}
                    >
                      OK
                    </button>
                  </div>
                )}

                {/* Danh sách các amenity đã chọn */}
                <div className="d-flex flex-wrap gap-2">
                  {editingRoom.amenities.map((a) => {
                    const amenity =
                      typeof a === "string"
                        ? allAmenities.find((x) => x._id === a)
                        : a;
                    if (!amenity) return null;
                    return (
                      <span
                        key={amenity._id}
                        className="badge bg-secondary d-flex align-items-center"
                      >
                        {amenity.name}
                        <button
                          type="button"
                          className="btn-close btn-close-white ms-2"
                          onClick={() => {
                            setEditingRoom({
                              ...editingRoom,
                              amenities: editingRoom.amenities.filter(
                                (item) =>
                                  (typeof item === "string"
                                    ? item
                                    : item._id) !== amenity._id
                              ),
                            });
                          }}
                        ></button>
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Ảnh phòng</label>
                {editingRoom.image && (
                  <div className="mb-2">
                    <img
                      src={getImageRoom(editingRoom.image)}
                      alt="room"
                      width="120"
                      height="80"
                      className="rounded"
                    />
                  </div>
                )}
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) =>
                    setEditingRoom({
                      ...editingRoom,
                      imageFile: e.target.files[0],
                    })
                  }
                />
              </div>
              <button className="btn btn-primary" type="submit">
                Cập nhật
              </button>
            </form>
          </Modal.Body>
        </Modal>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Phòng</h2>
        <button className="btn btn-success">
          <i className="bi bi-plus"></i> Thêm
        </button>
      </div>
      <div className="row g-3">
        <RoomColumn
          title="Clean"
          rooms={rooms.clean}
          count={rooms.totalCounts.clean}
        />
        <RoomColumn
          title="Occupied"
          rooms={rooms.occupied}
          count={rooms.totalCounts.occupied}
        />
        <RoomColumn
          title="Dirty"
          rooms={rooms.dirty}
          count={rooms.totalCounts.dirty}
        />
        <RoomColumn
          title="Maintenance Block"
          rooms={rooms.maintenance}
          count={rooms.totalCounts.maintenance}
        />
      </div>
      <div className="col-lg-12">
        <Pagination pages={pageIndex} />
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};
export default RoomsAdmin;
