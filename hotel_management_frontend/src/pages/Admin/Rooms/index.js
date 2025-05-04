import { useEffect, useState } from "react";
import {
  deleteRoom,
  getAdminRooms,
  getAmenities,
  getRoomTypes,
  createRoom,
  updateRoom,
} from "../../../services/Api";
import { useSearchParams } from "react-router-dom";
import { getImageRoom } from "../../../shared/ultils";
import { toast, ToastContainer } from "react-toastify";
import Pagination from "../../../shared/components/_pagination";
import Modal from "react-bootstrap/Modal";

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
  const [currentRoom, setCurrentRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [roomTypes, setRoomTypes] = useState([]);
  const [allAmenities, setAllAmenities] = useState([]);
  const [selectedAmenity, setSelectedAmenity] = useState("");
  const [isSelectingAmenity, setIsSelectingAmenity] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);

  const clickEdit = (room) => {
    setIsEditMode(true);
    setCurrentRoom(room);
    setShowModal(true);
  };

  const clickAdd = () => {
    setIsEditMode(false);
    setCurrentRoom({
      name: "",
      floor: "",
      room_type: roomTypes[0]?._id || "",
      status: "clean",
      amenities: [],
      imageFile: null,
    });
    setShowModal(true);
  };

  const clickDelete = (room) => {
    setRoomToDelete(room);
    setShowDeleteModal(true);
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

  return (
    <div className="container my-4">
      {currentRoom && (
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {isEditMode
                ? `Chỉnh sửa phòng: ${currentRoom.name}`
                : "Thêm phòng mới"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const formData = new FormData();
                  formData.append("name", currentRoom.name);
                  formData.append("floor", currentRoom.floor);
                  formData.append("room_type", currentRoom.room_type);
                  formData.append("status", currentRoom.status);

                  formData.append(
                    "amenities",
                    JSON.stringify(
                      currentRoom.amenities.map((a) =>
                        typeof a === "string" ? a : a._id
                      )
                    )
                  );
                  if (!currentRoom.imageFile && isEditMode) {
                    formData.append("image", currentRoom.image);
                  }

                  if (currentRoom.imageFile) {
                    formData.append("imageFile", currentRoom.imageFile);
                  }
                  for (let [key, value] of formData.entries()) {
                    console.log(key, value);
                  }

                  let res;
                  if (isEditMode) {
                    res = await updateRoom(currentRoom._id, formData);
                  } else {
                    res = await createRoom(formData);
                  }

                  toast.success(res.data.message);
                  setShowModal(false);
                  setCurrentRoom(null);

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
                  toast.error("Lỗi khi lưu phòng");
                }
              }}
            >
              <div className="mb-3">
                <label className="form-label">Tên phòng</label>
                <input
                  className="form-control"
                  value={currentRoom.name}
                  onChange={(e) =>
                    setCurrentRoom({ ...currentRoom, name: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Tầng</label>
                <input
                  className="form-control"
                  value={currentRoom.floor}
                  onChange={(e) =>
                    setCurrentRoom({ ...currentRoom, floor: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Loại phòng</label>
                <select
                  className="form-control"
                  value={currentRoom.room_type}
                  onChange={(e) =>
                    setCurrentRoom({
                      ...currentRoom,
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
                  value={currentRoom.status}
                  onChange={(e) =>
                    setCurrentRoom({ ...currentRoom, status: e.target.value })
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

                {!isSelectingAmenity && (
                  <button
                    type="button"
                    className="btn btn-outline-primary mb-2"
                    onClick={() => setIsSelectingAmenity(true)}
                  >
                    + Thêm dịch vụ
                  </button>
                )}

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
                            !currentRoom.amenities.some(
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
                          setCurrentRoom({
                            ...currentRoom,
                            amenities: [...currentRoom.amenities, newAmenity],
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

                <div className="d-flex flex-wrap gap-2">
                  {currentRoom.amenities.map((a) => {
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
                            setCurrentRoom({
                              ...currentRoom,
                              amenities: currentRoom.amenities.filter(
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
                {isEditMode && currentRoom.image && (
                  <div className="mb-2">
                    <img
                      src={getImageRoom(currentRoom.image)}
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
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setCurrentRoom({
                      ...currentRoom,
                      imageFile: file,
                    });
                  }}
                />
              </div>

              <button className="btn btn-primary" type="submit">
                {isEditMode ? "Cập nhật" : "Tạo"}
              </button>
            </form>
          </Modal.Body>
        </Modal>
      )}

      <h2 className="mb-4 text-center">Quản lý Phòng</h2>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-success" onClick={clickAdd}>
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
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa phòng <strong>{roomToDelete?.name}</strong>{" "}
          không?
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            Hủy
          </button>
          <button
            className="btn btn-danger"
            onClick={async () => {
              try {
                const res = await deleteRoom(roomToDelete._id);
                toast.success(res.data.message);
                setRooms((prev) => ({
                  ...prev,
                  [roomToDelete.status]: prev[roomToDelete.status].filter(
                    (r) => r._id !== roomToDelete._id
                  ),
                }));
              } catch (error) {
                console.error(error);
                toast.error("Đã xảy ra lỗi khi xóa phòng.");
              } finally {
                setShowDeleteModal(false);
                setRoomToDelete(null);
              }
            }}
          >
            Xác nhận
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default RoomsAdmin;
