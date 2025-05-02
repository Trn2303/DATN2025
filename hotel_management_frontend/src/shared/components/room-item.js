import { getImageRoom } from "../ultils";
import { Link } from "react-router-dom";
const RoomItem = ({ item }) => {
  return (
    <div className="col-lg-4 col-md-6 mb-4">
      <Link
        to={`/RoomDetails-${item._id}`}
        className="text-decoration-none text-dark"
      >
        <div className="room-item card-hover border rounded overflow-hidden h-100 transition-shadow">
          <img
            src={getImageRoom(item.image)}
            alt={item.name}
            className="img-fluid w-100"
            style={{
              objectFit: "cover",
              height: "200px",
            }}
          />

          <div className="ri-text p-3">
            <h4 className="mb-2 text-truncate" title={item.name}>
              {item.name}
            </h4>

            <h3 className="mb-3">
              {item.room_type?.base_price?.toLocaleString()}
              <span className="fs-6 text-muted"> ₫ / đêm</span>
            </h3>

            <table className="table table-borderless mb-0">
              <tbody>
                <tr>
                  <td className="fw-bold text-muted">Loại phòng:</td>
                  <td className="text-truncate">
                    {item.room_type?.name || "N/A"}
                  </td>
                </tr>

                <tr>
                  <td className="fw-bold text-muted">Tiện nghi:</td>
                  <td>
                    {item.amenities
                      ?.slice(0, 3)
                      .map((amenity) => amenity.name)
                      .join(", ")}
                    {item.amenities && item.amenities.length > 3 ? "..." : ""}
                  </td>
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
