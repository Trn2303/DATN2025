import { useEffect, useState } from "react";
import { getRooms } from "../../services/Api";
import RoomItem from "../../shared/components/room-item";
import { useSearchParams } from "react-router-dom";
import Slider from "../../shared/components/Layout/Slider";
import Pagination from "../../shared/components/_pagination";

const Rooms = () => {
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const limit = 9;

  const [rooms, setRooms] = useState([]);
  const [pageIndex, setPageIndex] = useState({ limit });

  useEffect(() => {
    getRooms({
      params: {
        limit,
        page,
      },
    })
      .then(({ data }) => {
        setRooms(data.data.docs);
        setPageIndex({ limit, ...data.data.pages });
      })
      .catch((error) => console.log(error));
  }, [page]);
  return (
    <>
      <Slider />
      <div className="rooms-section spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title">
                <h2>Our Rooms</h2>
              </div>
            </div>
          </div>
          <div className="row">
            {rooms.map((items, index) => (
              <RoomItem key={index} item={items} />
            ))}
            <div className="col-lg-12">
              <Pagination pages={pageIndex} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Rooms;
