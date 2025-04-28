import { useState, useEffect } from "react";
import { getRoomsRoomType } from "../../services/Api";
import RoomItem from "../../shared/components/room-item";
import { useParams, Link } from "react-router-dom";
import Slider from "../../shared/components/Layout/Slider";
const RoomType = () => {
    const [rooms, setRooms] = useState([]);
    const [total, setTotal] = useState([]);
    const { id } = useParams();
    useEffect(() => {
        getRoomsRoomType(id, {})
            .then(({ data }) => {
                setRooms(data.data.docs);
                setTotal(data.data.pages.total)
            })
            .catch((error) => console.log(error));
    }, [id]);
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
                        <h4>Hiện có {total} phòng</h4>
                        {rooms.map((items, index) => (
                            <RoomItem key={index} item={items} />
                        ))}
                        <div className="col-lg-12">
                            <div className="room-pagination">
                                <Link to="/rooms?page=1">1</Link>
                                <Link to="/rooms?page=2">2</Link>
                                <Link to="/rooms?page=3">
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
export default RoomType;