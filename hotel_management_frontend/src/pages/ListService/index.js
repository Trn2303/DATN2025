import { useEffect, useState } from "react";
import { getServices } from "../../services/Api";
import { Link } from "react-router-dom";
import ServiceItem from "../../shared/components/service-item";
import Slider from "../../shared/components/Layout/Slider";

const Services = () => {
    const [services, setServices] = useState([]);
    useEffect(() => {
        getServices({
            params: {
                limit: 9,
            }
        })
            .then(({ data }) => setServices(data.data.docs))
            .catch((error) => console.log(error)
            )
    }, []);
    return (
        <>
            <Slider />
            <div className="services-section spad">
                <div className="container">
                    <div className="row">
                        {services.map((items, index) => (
                            <ServiceItem key={index} item={items} />
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
export default Services;
