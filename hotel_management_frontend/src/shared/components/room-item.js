import { getImageRoom } from "../ultils";
import { Link } from "react-router-dom";
const RoomItem = ({ item }) => {
  return (
    <div className="col-lg-4 col-md-6">
      <Link to={`/RoomDetails-${item._id}`}>
        <div className="room-item">
          <img src={getImageRoom(item.image)} alt={item.name} />
          <div className="ri-text">
            <h4>{item.name}</h4>
            <h3>
              {item.room_type?.base_price?.toLocaleString()}<span>₫ / đêm</span>
            </h3>
            <table>
              <tbody>
                <tr>
                  <td className="r-o">Loại phòng:</td>
                  <td>{item.room_type?.name}</td>
                </tr>
                <tr>
                  <td className="r-o">Tiện nghi:</td>
                  <td>{item.amenities.slice(0, 3).map((amenity) => amenity.name).join(", ")}{item.amenities.length > 3 ? "..." : ""}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Link>
    </div>
  );
};
export default RoomItem;
