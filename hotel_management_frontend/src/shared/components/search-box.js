import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getRoomTypes } from "../../services/Api";

const SearchBox = () => {
  const [checIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [roomTypeId, setRoomTypeId] = useState("");
  const [room_types, setRoom_types] = useState([]);
  useEffect(() => {
    getRoomTypes({})
      .then(({ data }) => setRoom_types(data.data.docs))
      .catch((error) => console.log(error));
  }, []);
  const navigate = useNavigate();
  const clickSearch = () =>
    navigate(
      `/Search?checkIn=${checIn}&checkOut=${checkOut}&roomTypeId=${roomTypeId}`
    );
  return (
    <>
      <div className="search-container">
        <form className="search-form">
          <div className="input-container">
            <label htmlFor="checkin">Ngày Check-in</label>
            <input
              type="date"
              id="checkin"
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setCheckIn(e.target.value)}
              required
            />
          </div>
          <div className="input-container">
            <label htmlFor="checkout">Ngày Check-out</label>
            <input
              type="date"
              id="checkout"
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setCheckOut(e.target.value)}
              required
            />
          </div>
          <div className="input-container">
            <label htmlFor="roomTypeId">Loại phòng</label>
            <select
              id="roomTypeId"
              onChange={(e) => setRoomTypeId(e.target.value)}
            >
              <option value="" disabled selected>
                Chọn loại phòng
              </option>
              {room_types.map((room_type, index) => (
                <option key={index} value={room_type._id}>
                  {room_type.name}
                </option>
              ))}
            </select>
          </div>
          <div className="input-container">
            <button onClick={clickSearch} className="btn-search" type="button">
              Tìm Kiếm
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
export default SearchBox;
