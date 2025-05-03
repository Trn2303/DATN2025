import { useState, useEffect } from "react";
import SearchBox from "../../shared/components/search-box";
import { useSearchParams } from "react-router-dom";
import { getRooms } from "../../services/Api";
import RoomItem from "../../shared/components/room-item";
import Pagination from "../../shared/components/_pagination";
const Search = () => {
  const [rooms, setRooms] = useState([]);
  const [searchParams] = useSearchParams();
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const roomTypeId = searchParams.get("roomTypeId");
  const page = searchParams.get("page") || 1;

  const limit = 9;
  const [pageIndex, setPageIndex] = useState({
    limit,
  });
  const [total, setTotal] = useState([]);
  useEffect(() => {
    getRooms({
      params: {
        roomTypeId,
        checkIn,
        checkOut,
        limit,
        page,
      },
    })
      .then(({ data }) => {
        setRooms(data.data.docs);
        setTotal(data.data.pages.totalRows);
        setPageIndex({ limit, ...data.data.pages });
      })
      .catch((error) => console.log(error));
  }, [checkIn, checkOut, roomTypeId, page]);

  return (
    <>
      <div className="hero-section">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-title">
              <h2>Tìm kiếm phòng khách sạn</h2>
            </div>
          </div>
        </div>
      </div>

      <SearchBox />
      <div className="rooms-section spad my-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 my-3">
              <h4>Tìm thấy {total?.totalRows} kết quả</h4>
            </div>
          </div>
          <div className="row">
            {rooms?.map((items, index) => (
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
export default Search;
