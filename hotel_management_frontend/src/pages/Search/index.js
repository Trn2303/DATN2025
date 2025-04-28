import { useState, useEffect } from "react";
import SearchBox from "../../shared/components/search-box";
import { useSearchParams, Link } from "react-router-dom";
import { getRooms } from "../../services/Api";
import RoomItem from "../../shared/components/room-item";
const Search = () => {
  const [rooms, setRooms] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const checIn = searchParams.get("checkIn");
  const checOut = searchParams.get("checkOut");
  const roomType = searchParams.get("roomType");
  const [total, setTotal] = useState([]);
  useEffect(() => {
    getRooms({
      params: {
        roomTypeId: roomType,
        checkIn: checIn,
        checkOut: checOut,
        limit: 9,
      }
    })
      .then(({ data }) => {
        setRooms(data.data.docs);
        setTotal(data.data.pages);
      })
      .catch((error) => console.log(error))
  }, [checIn, checOut, roomType])

  return (
    <>
      <SearchBox />
      <div className="rooms-section spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h4>Tìm thấy {total} kết quả</h4>
            </div>
          </div>
          <div className="row">
            {rooms?.map((items, index) => (
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
  )
}
export default Search;