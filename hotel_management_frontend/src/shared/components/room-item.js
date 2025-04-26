import { getImageRoom } from "../ultils";
const RoomItem = ({ item }) => {
  return (
    <div className="col-lg-4 col-md-6">
      <div className="room-item">
        <img src={getImageRoom(item.image)} alt/>
        <div className="ri-text">
          <h4>{item.name}</h4>
          <h3>
            item.price<span>/Pernight</span>
          </h3>
          <table>
            <tbody>
              <tr>
                <td className="r-o">Loại phòng:</td>
                <td>item.roomType</td>
              </tr>
              <tr>
                <td className="r-o">Tiện nghi:</td>
                <td>item.amenities</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default RoomItem;
