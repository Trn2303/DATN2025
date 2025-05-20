import { useState, useEffect } from "react";
import { getRooms, getRoomTypeById } from "../../../services/Api";
import RoomItem from "../../../shared/components/room-item";
import { useParams, useSearchParams } from "react-router-dom";
import Slider from "../../../shared/components/Layout/Slider";
import Pagination from "../../../shared/components/_pagination";
const RoomType = () => {
  const [rooms, setRooms] = useState([]);
  const [total, setTotal] = useState([]);
  const [roomType, setRoomType] = useState([]);
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const limit = 9;
  const [pageIndex, setPageIndex] = useState({
    limit,
  });

  useEffect(() => {
    getRoomTypeById(id, {})
      .then(({ data }) => setRoomType(data.data))
      .catch((error) => console.log(error));
    getRooms({
      params: {
        roomTypeId: id,
        page,
        limit,
      },
    })
      .then(({ data }) => {
        setRooms(data.data.docs);
        setTotal(data.data.pages.totalRows);
        setPageIndex({ limit, ...data.data.pages });
      })
      .catch((error) => console.log(error));
  }, [id, page]);

  return (
    <>
      <Slider />
      <div className="rooms-section spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title">
                <h2>{roomType.name}</h2>
              </div>
            </div>
          </div>
          <div className="row p-3">
            <h4>Hiện có {total} phòng</h4>
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
export default RoomType;
