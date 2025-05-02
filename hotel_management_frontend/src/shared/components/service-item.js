import { Link } from "react-router-dom";
const ServiceItem = ({ item }) => {
  return (
    <div className="col-lg-4 col-md-6 mb-4">
      <Link
        to={`/ServiceDetails-${item._id}`}
        className="text-decoration-none text-dark"
      >
        <div className="service-card border rounded shadow-sm h-100 p-3 d-flex flex-column justify-content-between">
          <div className="sc-text mb-3">
            <h3 className="mb-2">{item.name}</h3>
            <p className="text-muted">{item.description}</p>
          </div>
          <div className="price-container text-end">
            <p className="mb-0 fw-bold ">
              {item.price.toLocaleString()}₫ / {item.unit}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};
export default ServiceItem;
