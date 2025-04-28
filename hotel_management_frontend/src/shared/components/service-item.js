import { Link } from "react-router-dom";
const ServiceItem = ({ item }) => {
    return (
        <div className="col-lg-4 col-md-6">
            <Link to={`/ServiceDetails-${item._id}`}>
                <div className="service-card">
                    <div className="sc-text">
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                    </div>
                    <div className="price-container">
                        <p><strong>{item.price.toLocaleString()}₫ / {item.unit}</strong></p>
                    </div>
                </div></Link>
        </div>
    );
};
export default ServiceItem;
