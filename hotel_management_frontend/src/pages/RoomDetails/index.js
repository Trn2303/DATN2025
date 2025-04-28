import { Link, useParams } from "react-router-dom";
import { getImageRoom } from "../../shared/ultils";
import { useEffect, useState } from "react";
import { getRoomById } from "../../services/Api";

const RoomDetails = () => {
  const [room, setRoom] = useState({});
  const { id } = useParams();

  useEffect(() => {
    getRoomById(id, {})
      .then(({ data }) => setRoom(data.data))
      .catch((error) => console.log(error));
  }, [id]);

  if (!room) return <div>Loading...</div>;

  return (
    <div className="room-details-section spad">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="room-details-item">
              <img src={getImageRoom(room.image)} alt={room.name} />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="rd-text">
              <div className="rd-title">
                <h3>{room.name}</h3>
              </div>
              <h2>
                {room?.room_type?.base_price.toLocaleString()}<span>₫ / đêm</span>
              </h2>
              <table>
                <tbody>
                  <tr>
                    <td className="r-o">Loại phòng:</td>
                    <td>{room?.room_type?.name}</td>
                  </tr>
                  <tr>
                    <td className="r-o">Số tầng:</td>
                    <td>{room?.floor}</td>
                  </tr>
                  <tr>
                    <td className="r-o">Tiện nghi:</td>
                    <td>
                      {room?.amenities?.map((amenity) => amenity.name).join(", ")}
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="f-para">{room?.room_type?.description}</p>
            </div>
            <div className="rdt-right">
              <Link to={`/Booking-${room._id}`}>Booking Now</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
