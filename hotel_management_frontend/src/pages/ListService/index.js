import { useEffect, useState } from "react";
import { getServices } from "../../services/Api";
import { useSearchParams } from "react-router-dom";
import ServiceItem from "../../shared/components/service-item";
import Slider from "../../shared/components/Layout/Slider";
import Pagination from "../../shared/components/_pagination";

const Services = () => {
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const limit = 9;
  const [pageIndex, setPageIndex] = useState({ limit });
  const [services, setServices] = useState([]);
  useEffect(() => {
    getServices({
      params: {
        limit,
        page,
      },
    })
      .then(({ data }) => {
        setServices(data.data.docs);
        setPageIndex({ limit, ...data.data.pages });
      })
      .catch((error) => console.log(error));
  }, [page]);
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
              <Pagination pages={pageIndex} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Services;
