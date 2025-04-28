import { useEffect, useState } from "react";
import { getRooms } from "../../services/Api";
import RoomItem from "../../shared/components/room-item";
import { Link } from "react-router-dom";
import Slider from "../../shared/components/Layout/Slider";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    getRooms({
      params: {
        limit: 9,
      }
    })
      .then(({ data }) => setRooms(data.data.docs))
      .catch((error) => console.log(error)
      )
  }, []);
  return (
    <>
      <Slider />
      <div className="rooms-section spad">
        <div className="container">
          <div className="row">
            {rooms.map((items, index) => (
              <RoomItem key={index} item={items} />
            ))}
            <div className="col-lg-12">
              <div className="room-pagination">
                <Link to="">1</Link>
                <Link to="">2</Link>
                <Link to="">
                  Next <i className="fa fa-long-arrow-right" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Rooms;
